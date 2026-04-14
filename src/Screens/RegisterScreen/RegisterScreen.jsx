import React, { useEffect, useState } from 'react'
import TransitionOverlay from '../../Components/TransitionOverlay/TransitionOverlay'
import { Link, useNavigate, useLocation } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import { useLanguage } from '../../Context/LanguageContext'

const RegisterScreen = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const shouldTransition = location.state?.fromLanding;
    const [isTransitioning, setIsTransitioning] = useState(shouldTransition);

    useEffect(() => {
        if (shouldTransition) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [shouldTransition]);

    const {
        sendRequest,
        response,
        error,
        loading
    } = useRequest()

    const REGISTER_FORM_FIELDS = {
        EMAIL: 'email',
        PASSWORD: 'password',
        NAME: 'name'
    }

    /* 
    CONSIGNA: 
    Implementar el useForm para este formulario de registro
    */
    const initialFormState = {
        [REGISTER_FORM_FIELDS.NAME]: '',
        [REGISTER_FORM_FIELDS.EMAIL]: '',
        [REGISTER_FORM_FIELDS.PASSWORD]: ''
    }
    function onRegister(formState) {
        try {
            sendRequest(
                {
                    requestCb: () => {
                        return register(
                            {
                                email: formState[REGISTER_FORM_FIELDS.EMAIL],
                                password: formState[REGISTER_FORM_FIELDS.PASSWORD],
                                name: formState[REGISTER_FORM_FIELDS.NAME]
                            }
                        )
                    }
                }
            )
        }
        catch (error) {
            console.log(error)
        }

    }
    const { handleChangeInput, onSubmit, formState } = useForm({ initialFormState, submitFn: onRegister })
    const navigate = useNavigate()
    useEffect (
        () => {
            if(response && response.ok){
                alert(t('register.success'))
                navigate('/login')
            }
        },
        [response, t]
    )

    return (
        <div className="page-container">
            {isTransitioning && <TransitionOverlay type="out" />}
            <div className="glass-card">
                <h1 className="title">
                    {t('register.title')}
                </h1>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">{t('register.username')}</label>
                        <input className="form-input" type="text" id="name" name={REGISTER_FORM_FIELDS.NAME} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.NAME]} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">{t('register.email')}</label>
                        <input className="form-input" type="email" id="email" name={REGISTER_FORM_FIELDS.EMAIL} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.EMAIL]} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">{t('register.password')}</label>
                        <input className="form-input" type="password" id="password" name={REGISTER_FORM_FIELDS.PASSWORD} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.PASSWORD]} />
                    </div>
                    <button className="btn" type="submit" disabled={loading}>{loading ? t('register.loading') : t('register.submit')}</button>
                    {error && (
                        <div className="error-text">
                            {error.message || t('register.error')}
                        </div>
                    )}
                </form>
                <div className="footer-links">
                    <span>{t('register.have_account')} <Link className="link" to="/login">{t('register.login_link')}</Link></span>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen