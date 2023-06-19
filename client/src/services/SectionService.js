import axios from 'axios';
import authHeader from './AuthHeader';

const URL = process.env.VUE_APP_API_URL + 'sections/'

const getAllSections = () => axios({ method: 'get', url: URL })
const getSectionById = (id) => axios({ method: 'get', url: URL + `/${id}` })
const createSection = (section) => axios({ method: 'post', url: URL, data:section, headers: authHeader() })
const updateSection = (section) => axios({ method: 'put', url: URL, data:section, headers: authHeader() })
const deleteSection = (id) => axios({ method: 'delete', url: URL +`/${id}`, headers: authHeader() })

export default {
    getAllSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
}