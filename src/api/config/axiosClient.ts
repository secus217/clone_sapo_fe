import axios from 'axios';
import queryString from 'query-string';
import {API_URL, JWT_LOCAL_STORAGE_KEY} from "../../config/constant";


const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    // Handle token here ...
    // get access token from async storage
    const accessToken = window.localStorage.getItem(JWT_LOCAL_STORAGE_KEY);

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }

    return response;
}, (error) => {
    // Handle errors
    const errorMessage = "Something went wrong!"

    if (error.response.data) {
        throw error.response.data;
    }
    throw errorMessage;
});

export default axiosClient;
