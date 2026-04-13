import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'

const RegisterScreen = () => {

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
                alert('Te has registrado exitosamente, te enviamos un mail con instrucciones')
                navigate('/login')
            }
        },
        [response]
    )

    return (
        <div className="page-container">
            <div className="glass-card">
                <h1 className="title">
                    Registrarse
                </h1>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input className="form-input" type="text" id="name" name={REGISTER_FORM_FIELDS.NAME} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.NAME]} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-input" type="email" id="email" name={REGISTER_FORM_FIELDS.EMAIL} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.EMAIL]} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-input" type="password" id="password" name={REGISTER_FORM_FIELDS.PASSWORD} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.PASSWORD]} />
                    </div>
                    <button className="btn" type="submit" disabled={loading}>{loading ? 'Cargando...' : 'Registrarse'}</button>
                    {error && (
                        <div className="error-text">
                            {error.message || 'Error en el registro'}
                        </div>
                    )}
                </form>
                <div className="footer-links">
                    <span>¿Ya tienes una cuenta? <Link className="link" to="/login">Iniciar sesión</Link></span>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen