import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const registerUser = async (userData) => {
    try {
        return axios.post(`${BASE_URL}/auth/register/`, userData)
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const loginUser = async (userData) => {
    try {
        return axios.post(`${BASE_URL}/auth/login/`, userData)
    } catch (error) {
        console.log(error);
        throw error
    }
}