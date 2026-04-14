import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../Context/AuthContext'
import TransitionOverlay from '../../Components/TransitionOverlay/TransitionOverlay'

const LoginScreen = () => {
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
                manageLogin(response.data.auth_token)
            }
        },
        [response]
    )

    return (
        <div className="page-container">
            {isTransitioning && <TransitionOverlay type="out" />}
            <div className="glass-card">
                <h1 className="title">
                    Iniciar sesión
                </h1>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            id="email"
                            name={LOGIN_FORM_FIELDS.EMAIL}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name={LOGIN_FORM_FIELDS.PASSWORD}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar sesión'}
                    </button>
                </form>
                {response && !response.ok && (
                    <div className="error-text">
                        {response.message === 'Debes verificar tu correo electronico antes de iniciar sesion'
                            ? 'Por favor, verifica tu correo'
                            : response.message}
                    </div>
                )}
                <div className="footer-links">
                    <span>¿No tienes una cuenta? <Link className="link" to="/register">Registrarse</Link></span>
                    <span>¿Olvidaste tu contraseña? <Link className="link" to="/reset-password-request">Restablecer</Link></span>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen