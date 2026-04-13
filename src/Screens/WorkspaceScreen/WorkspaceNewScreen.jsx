import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import { createWorkspace } from '../../services/workspaceService'
import useRequest from '../../hooks/useRequest'

const WorkspaceNewScreen = () => {

    const navigate = useNavigate()

    const {
        sendRequest,
        error,
        response,
        loading
    } = useRequest()

    const WORKSPACE_FORM_FIELDS = {
        TITLE: 'title',
        DESCRIPTION: 'description'
    }

    const initialFormState = {
        [WORKSPACE_FORM_FIELDS.TITLE]: '',
        [WORKSPACE_FORM_FIELDS.DESCRIPTION]: ''
    }

    function onCreateWorkspace(formState) {
        sendRequest({
            requestCb: async () => {
                return await createWorkspace({
                    title: formState[WORKSPACE_FORM_FIELDS.TITLE],
                    description: formState[WORKSPACE_FORM_FIELDS.DESCRIPTION]
                })
            }
        })
    }

    const {
        handleChangeInput,
        onSubmit,
        formState
    } = useForm({
        initialFormState,
        submitFn: onCreateWorkspace
    })

    useEffect(
        () => {
            if (response && response.ok) {
                // Redirigir a Home o donde corresponda cuando se crea existosamente
                navigate('/home')  
            }
        },
        [response, navigate]
    )

    return (
        <div className="page-container">
            <div className="glass-card" style={{ maxWidth: '500px' }}>
                <h1 className="title">
                    Crear nuevo espacio
                </h1>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">Título</label>
                        <input
                            className="form-input"
                            type="text"
                            id="title"
                            name={WORKSPACE_FORM_FIELDS.TITLE}
                            onChange={handleChangeInput}
                            value={formState[WORKSPACE_FORM_FIELDS.TITLE]}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Descripción</label>
                        <textarea
                            className="form-input form-textarea"
                            id="description"
                            name={WORKSPACE_FORM_FIELDS.DESCRIPTION}
                            onChange={handleChangeInput}
                            value={formState[WORKSPACE_FORM_FIELDS.DESCRIPTION]}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn" type="submit" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/home')}
                            style={{ flex: 1 }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
                {response && !response.ok && (
                    <div className="error-text">
                        {response.message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WorkspaceNewScreen
