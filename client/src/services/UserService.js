import axios from 'axios';
import authHeader from './AuthHeader';

const URL = process.env.VUE_APP_API_URL;

const register = (user) => axios({ method: 'post', url: URL + 'register', data:user })
const getUserById = (id) => axios({ method: 'get', url: URL + 'users/' + id })
const updateProfile = (user) => axios({ method: 'put', url: URL + 'users', data:user, headers: authHeader() })

export default {
    register,
    getUserById,
    updateProfile
}