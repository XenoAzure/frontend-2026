import { useEffect, useCallback } from "react"
import useRequest from "./useRequest"
import { getWorkspaces } from "../services/workspaceService"

function useWorkspaces() {
    const { sendRequest, response, loading, error, isFirstLoad } = useRequest()

    const loadWorkspaces = useCallback(() => {
        sendRequest({ requestCb: getWorkspaces })
    }, [sendRequest])

    useEffect(() => {
        loadWorkspaces()
    }, [])

    return {
        response,
        loading,
        isFirstLoad,
        error,
        workspaces: response?.data?.workspaces,
        loadWorkspaces
    }
}

export default useWorkspaces