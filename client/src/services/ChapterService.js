import axios from 'axios';
import authHeader from './AuthHeader';

const URL = process.env.VUE_APP_API_URL + 'chapters/'

const getAllChapters = () => axios({ method: 'get', url: URL })
const createChapter = (chapter) => axios({ method: 'post', url: URL, data:chapter, headers: authHeader() })
const updateChapter = (chapter) => axios({ method: 'put', url: URL, data:chapter, headers: authHeader() })
const deleteChapter = (chapter) => axios({ method: 'delete', url: URL, data:chapter, headers: authHeader() })

export default {
    getAllChapters,
    createChapter,
    updateChapter,
    deleteChapter
}