import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Tạo một event mới để thông báo lỗi
const notifyError = (message) => {
    const event = new CustomEvent('axiosError', { 
        detail: { message } 
    });
    window.dispatchEvent(event);
};

const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});


const handleRefreshToken = async () => {
    const res = await instance.get('api/v1/auth/refresh');
    if (res && res.data) return res.data.access_token;
    else return null;

}

const NO_RETRY_HEADER = 'x-no-retry';

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // Kiểm tra token trước khi thêm vào header Authorization
    const token = localStorage.getItem('access_token');

    // Nếu có token thì thêm vào headers của request hiện tại
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {


    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('error>>>>', error);
    if (error.config
        && error.response
        && +error.response.status === 401
        && error.config.url !== 'api/v1/auth/login'
        && !error.config.headers[NO_RETRY_HEADER]
    ) {
        localStorage.removeItem('access_token');
        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true';

        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem('access_token', access_token);
            return instance.request(error.config);
        }
    }

    if (error.config
        && error.response
        && +error.response.status === 400
        && error.config.url === 'api/v1/auth/refresh'
        // && location.pathname.startsWith("/admin")
    ) {
        window.location.href = '/login';
    }    if (+error.response.status === 403) {
        console.log('error.response', error.response);
        notifyError(error?.response?.data?.message || "Bạn không có quyền thực hiện hành động này");
    }

    return Promise.reject(error);
});

export default instance;
