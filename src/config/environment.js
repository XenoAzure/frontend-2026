const apiUrl = import.meta.env.VITE_API_URL || '';
const ENVIRONMENT = {
    API_URL: apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
}

export default ENVIRONMENT