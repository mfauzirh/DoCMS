import axios from 'axios';
import authHeader from './AuthHeader';

const URL = process.env.VUE_APP_API_URL + 'documentations/'

const getDocumentations = () => axios({ method: 'get', url: URL })
const getAllVersions = () => axios({ method: 'get', url: URL + 'version' })
const getMetadata = () => axios({ method: 'get', url: URL + 'metadata' })
const updateMetadata = (metadata) => axios({ method: 'put', url: URL + 'metadata', data: metadata, headers: authHeader() })

export default {
    getDocumentations,
    getAllVersions,
    getMetadata,
    updateMetadata
}