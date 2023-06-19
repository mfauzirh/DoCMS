import axios from 'axios';
import authHeader from './AuthHeader';

const URL = process.env.VUE_APP_API_URL + 'versioning/'

const createVersion = (versionName) => axios({ method: 'put', url: URL + 'create', data:versionName, headers: authHeader() })
const editVersion = (payload) => axios({ method: 'put', url: URL + 'edit', data:payload, headers: authHeader() })
const deleteVersion = (payload) => axios({ method: 'put', url: URL + 'delete', data:payload, headers: authHeader() })
const addChapter = (payload) => axios({ method: 'put', url: URL + 'chapter', data:payload, headers: authHeader() })
const removeChapter = (payload) => axios({ method: 'put', url: URL + 'chapter/delete', data:payload, headers: authHeader() })
const addSection = (payload) => axios({ method: 'put', url: URL + 'section', data:payload, headers: authHeader() })
const removeSection = (payload) => axios({ method: 'put', url: URL + 'section/delete', data:payload, headers: authHeader() })
const reorderContent = (content) => axios({ method: 'put', url: URL + 'reorder', data:content, headers: authHeader() })

export default {
    createVersion,
    editVersion,
    deleteVersion,
    addChapter,
    removeChapter,
    addSection,
    removeSection,
    reorderContent
}