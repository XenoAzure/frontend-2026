import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-title">
                    <LogOut size={24} style={{ color: 'var(--error-color)', marginBottom: '0.5rem' }} />
                    <div>Logout Confirmation</div>
                </div>
                <div className="modal-message">
                    Are you sure you want to log out? Any unsaved changes will be lost.
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
