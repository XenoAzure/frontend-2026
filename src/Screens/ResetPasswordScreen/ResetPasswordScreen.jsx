import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPassword } from '../../services/authService'
import { useLanguage } from '../../Context/LanguageContext'

const ResetPasswordScreen = () => {
    const { t } = useLanguage();
    const { reset_token } = useParams();
    const navigate = useNavigate();

    const {
        sendRequest,
        response,
        error,
        loading
    } = useRequest()

    const FORM_FIELDS = {
        PASSWORD: 'password'
    }

    const initialFormState = {
        [FORM_FIELDS.PASSWORD]: ''
    }

    function onResetPassword(formState) {
        sendRequest({
            requestCb: async () => {
                return await resetPassword({
                    password: formState[FORM_FIELDS.PASSWORD],
                    reset_token
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
        submitFn: onResetPassword
    })

    useEffect(() => {
        if (response && response.ok) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [response, navigate]);

    return (
        <div className="page-container">
            <div className="glass-card">
                <h1 className="title">
                    {t('reset_password.title')}
                </h1>
                
                {response && response.ok ? (
                    <div className="success-container" style={{ textAlign: 'center' }}>
                        <div className="success-text" style={{ marginBottom: '1rem' }}>
                            {t('reset_password.success')}
                        </div>
                        <p className="text-muted">
                            {t('reset_password.redirect')}
                        </p>
                    </div>
                ) : (
                    <>
                        <form className="form" onSubmit={onSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">
                                    {t('reset_password.new_password')}
                                </label>
                                <input
                                    className="form-input"
                                    type="password"
                                    id="password"
                                    name={FORM_FIELDS.PASSWORD}
                                    value={formState[FORM_FIELDS.PASSWORD]}
                                    onChange={handleChangeInput}
                                    required
                                />
                            </div>
                            <button className="btn" type="submit" disabled={loading}>
                                {loading ? t('reset_password.loading') : t('reset_password.submit')}
                            </button>
                        </form>
                        
                        {response && !response.ok && (
                            <div className="error-text" style={{ marginTop: '1rem' }}>
                                {response.message}
                            </div>
                        )}
                        
                        <div className="footer-links">
                            <span>
                                <Link className="link" to="/login">
                                    {t('register.have_account')} {t('register.login_link')}
                                </Link>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ResetPasswordScreen
