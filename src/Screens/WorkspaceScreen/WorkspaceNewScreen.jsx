import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import { createWorkspace } from '../../services/workspaceService'
import useRequest from '../../hooks/useRequest'
import { useLanguage } from '../../Context/LanguageContext'

const WorkspaceNewScreen = () => {
    const { t } = useLanguage();
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
        <div className="page-container" style={{ padding: '2rem' }}>
            <div className="glass-card" style={{ maxWidth: '500px' }}>
                <h1 className="title">
                    {t('workspace.new.title')}
                </h1>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">{t('workspace.new.label_title')}</label>
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
                        <label className="form-label" htmlFor="description">{t('workspace.new.label_description')}</label>
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
                            {loading ? t('workspace.new.loading') : t('workspace.new.submit')}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/home')}
                            style={{ flex: 1 }}
                        >
                            {t('workspace.new.cancel')}
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
