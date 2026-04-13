import React, { useEffect } from 'react'
import { getWorkspaces } from '../../services/workspaceService'
import useRequest from '../../hooks/useRequest'
import { Link } from 'react-router'
import useWorkspaces from '../../hooks/useWorkspaces'

const HomeScreen = () => {

  const {response, loading, error, workspaces} = useWorkspaces()

 
    return (
        <div className="dashboard-container dashboard-card">
            <div className="header-actions">
                <h1 className="dashboard-title" style={{ fontSize: '1.8rem' }}>Tus espacios de trabajo</h1>
                <Link to='/workspace/new' className="btn">Nuevo Espacio</Link>
            </div>
            
            {loading && <div className="text-center text-muted">Cargando espacios...</div>}
            
            {!loading && workspaces && (
                <div className="workspace-list">
                    {workspaces.length === 0 ? (
                        <div className="empty-state">
                            <h3>No hay espacios de trabajo</h3>
                            <p style={{ marginTop: '0.5rem' }}>Crea uno nuevo para comenzar a trabajar.</p>
                        </div>
                    ) : (
                        workspaces.map((workspace) => (
                            <div key={workspace.workspace_id} className="workspace-item">
                                <h2>{workspace.workspace_title}</h2>
                                <Link className="btn btn-secondary" to={'/workspace/' + workspace.workspace_id}>
                                    Abrir
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default HomeScreen