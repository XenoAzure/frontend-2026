import ENVIRONMENT from "../config/environment";
import { LOCALSTORAGE_TOKEN_KEY } from "../Context/AuthContext";

export async function getWorkspaces() {
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspace',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            }
        }
    )

    const response = await response_http.json()
    return response
}

export async function createWorkspace(workspace_data) {
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspace',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            },
            body: JSON.stringify(workspace_data)
        }
    )

    const response = await response_http.json()
    return response
}