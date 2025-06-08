import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getDisasters = async () => {
    try {
        return await axios.get(`${BASE_URL}/reliefweb/disasters/`)
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getDisasterStats = async () => {
    try {
        return await axios.get(`${BASE_URL}/reliefweb/stats/`)
    } catch (error) {
        console.log(error);
        throw error
    }
}