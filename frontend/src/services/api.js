import axios from '../utils/axios-customize';

// Auth API services
export const callLogin = (username, password) => {
    return axios.post('/users/login', { username, password, status: "ONLINE" });
};

export const callRegister = (name, email, password, phone) => {
    return axios.post('/auth/register', { name, email, password, phone });
};

export const getProfile = () => {
    return axios.get('/auth/profile');
};

export const refreshToken = () => {
    return axios.get('/auth/refresh');
};

export const callLogout = () => {
    return axios.post('/auth/logout');
}






