import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../Context/AuthContext'
import TransitionOverlay from '../../Components/TransitionOverlay/TransitionOverlay'
import { useLanguage } from '../../Context/LanguageContext'

const LoginScreen = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const shouldTransition = location.state?.fromLanding;
    const [isTransitioning, setIsTransitioning] = useState(shouldTransition);
    const [rememberMe, setRememberMe] = useState(true);

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
        error,
        response,
        loading
    } = useRequest()

    const LOGIN_FORM_FIELDS = {
        EMAIL: 'email',
        PASSWORD: 'password'
    }

    const initialFormState = {
        [LOGIN_FORM_FIELDS.EMAIL]: '',
        [LOGIN_FORM_FIELDS.PASSWORD]: ''
    }

    const { manageLogin } = useContext(AuthContext)

    function onLogin(formState) {
        sendRequest({
            requestCb: async () => {
                return await login({
                    email: formState[LOGIN_FORM_FIELDS.EMAIL],
                    password: formState[LOGIN_FORM_FIELDS.PASSWORD]
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
        submitFn: onLogin
    })

    useEffect(
        () => {
            if (response && response.ok) {
                manageLogin(response.data.auth_token, rememberMe)
            }
        },
        [response]
    )

    return (
        <div className="page-container">
            {isTransitioning && <TransitionOverlay type="out" />}
            <div className="glass-card">
                <h1 className="title">
                    {t('login.title')}
                </h1>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">{t('login.email')}</label>
                        <input
                            className="form-input"
                            type="email"
                            id="email"
                            name={LOGIN_FORM_FIELDS.EMAIL}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">{t('login.password')}</label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name={LOGIN_FORM_FIELDS.PASSWORD}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                        />
                        <label htmlFor="rememberMe" className="form-label" style={{ cursor: 'pointer', margin: 0 }}>
                            {t('login.remember_me') || 'Remember me'}
                        </label>
                    </div>
                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? t('login.loading') : t('login.submit')}
                    </button>
                </form>
                {response && !response.ok && (
                    <div className="error-text">
                        {response.message === 'Debes verificar tu correo electronico antes de iniciar sesion'
                            ? t('errors.must_verify')
                            : response.message}
                    </div>
                )}
                <div className="footer-links">
                    <span>{t('login.no_account')} <Link className="link" to="/register">{t('login.register_link')}</Link></span>
                    <span>{t('login.forgot_password')} <Link className="link" to="/reset-password-request">{t('login.reset_link')}</Link></span>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen