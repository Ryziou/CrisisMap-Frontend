import axios from 'axios'
import { getToken } from '../lib/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getOwnProfile = async () => {
    try {
        return axios.get(`${BASE_URL}/auth/profile/`)
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getPublicProfile = async (userId) => {
    try {
        return axios.get(`${BASE_URL}/auth/profile/${userId}`)
    } catch (error) {
        console.log(error);
        
    }
}

export const updateProfile = async (userId, formData) => {
    try {
        return axios.put(`${BASE_URL}/auth/profile/${userId}/`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const deleteProfile = async (userId) => {
    try {
        return axios.delete(`${BASE_URL}/auth/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    }
}