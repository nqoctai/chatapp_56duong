import axios from '../utils/axios-customize';

// Auth API services
export const callLogin = (username, password) => {
    return axios.post('api/v1/users/login', { username, password, status: "ONLINE" });
};

export const callRegister = (name, email, password, phone) => {
    return axios.post('api/v1/auth/register', { name, email, password, phone });
};

export const getProfile = () => {
    return axios.get('api/v1/auth/profile');
};

export const refreshToken = () => {
    return axios.get('api/v1/auth/refresh');
};

export const callLogout = () => {
    return axios.post('api/v1/auth/logout');
}






