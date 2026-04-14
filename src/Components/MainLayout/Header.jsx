import { User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-brand">
                    <span className="header-delta">Δ</span>
                    <span className="header-cobalt">Cobalt</span>
                </div>
            </div>
            
            <div className="user-info">
                <span className="username">{user?.name || 'User'}</span>
                <div className="user-avatar">
                    {user?.profile_picture ? (
                        <img src={user.profile_picture} alt={user.name} />
                    ) : (
                        <UserIcon size={20} />
                    )}
                </div>
                <button 
                    onClick={logout}
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem', marginLeft: '0.5rem', marginTop: 0 }}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header;
