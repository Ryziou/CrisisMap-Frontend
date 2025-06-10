import axios from 'axios'
import { getToken } from '../lib/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getOwnProfile = async () => {
    try {
        return axios.get(`${BASE_URL}/auth/profile/`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getPublicProfile = async (userId) => {
    try {
        const token = getToken()
        return axios.get(`${BASE_URL}/auth/profile/${userId}`, {
            headers: token ? {
                Authorization: `Bearer ${getToken()}`} : {}
            
        })
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const updateProfile = async (formData) => {
    try {
        return axios.put(`${BASE_URL}/auth/profile/`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const deleteProfile = async () => {
    try {
        return axios.delete(`${BASE_URL}/auth/profile/`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getUserComments = async (userId) => {
    try {
        const token = getToken()
        return axios.get(`${BASE_URL}/comments/?user=${userId}`, {
            headers: token ? {
                Authorization: `Bearer ${getToken()}`} : {}
            
        })
    } catch (error) {
        console.log(error);
        throw error
    }
}