import React, { useEffect } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPasswordRequest } from '../../services/authService'

const ResetPasswordRequestScreen = () => {

  const {
    sendRequest,
    response,
    error,
    loading
  } = useRequest()

  /* Hacer un formulario donde se solcite el email, este email sera usado para saber a quien debemos mandar el mail para restablecer la contraseña */
  const FORM_FIELDS = {
    EMAIL: 'email'
  }
  const initalFormState = {
    [FORM_FIELDS.EMAIL]: ''
  }

  function submitResetPasswordRequest() {
    sendRequest(
      {
        requestCb: async () => {
          return await resetPasswordRequest({ email: formState[FORM_FIELDS.EMAIL] })
        }
      }
    )
  }

  const {
    handleChangeInput,
    onSubmit,
    formState,
    resetForm
  } = useForm({
    initialFormState: initalFormState,
    submitFn: submitResetPasswordRequest
  })
  console.log(formState)



    return (
        <div className="page-container">
            <div className="glass-card">
                <h1 className="title">Restablecer contraseña</h1>
                {
                    response && !loading && !error ?
                        <div className="success-text">{response.message}</div>
                        :
                        <>
                            <p className="text-center text-sm" style={{ marginBottom: '1.5rem' }}>
                                Se enviará un correo con instrucciones para que puedas restablecer tu contraseña
                            </p>
                            <form className="form" onSubmit={onSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        className="form-input"
                                        type="email"
                                        name={FORM_FIELDS.EMAIL}
                                        id="email"
                                        onChange={handleChangeInput}
                                        value={formState[FORM_FIELDS.EMAIL]}
                                    />
                                </div>
                                <button className="btn" type='submit' disabled={loading}>{loading ? 'Cargando...' : 'Enviar solicitud'}</button>
                            </form>
                            <div className="footer-links">
                                <span>¿Recuerdas tu contraseña? <Link className="link" to={'/login'}>Iniciar sesión</Link></span>
                                <span>¿No tienes una cuenta? <Link className="link" to="/register">Registrarse</Link></span>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default ResetPasswordRequestScreen