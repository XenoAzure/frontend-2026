import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../Context/AuthContext'

const LoginScreen = () => {

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
        <div>
            <h1>
                Iniciar sesion
            </h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name={LOGIN_FORM_FIELDS.EMAIL}
                        onChange={handleChangeInput}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name={LOGIN_FORM_FIELDS.PASSWORD}
                        onChange={handleChangeInput}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar sesion'}
                </button>
            </form>
            {response && !response.ok && (
                <p style={{ color: 'red' }}>
                    {response.message === 'Debes verificar tu correo electronico antes de iniciar sesion'
                        ? 'Por favor, verifica tu mail'
                        : response.message}
                </p>
            )}
            <span>No tienes una cuenta? <Link to="/register">Registrarse</Link></span>
            <br />
            <span>Olvidaste tu contraseña? <Link to="/reset-password-request">Restablecer</Link></span>
        </div>
    )
}

export default LoginScreen