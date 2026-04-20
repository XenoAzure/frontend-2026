import { User as UserIcon, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onToggleSecondary }) => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-left">
                <button 
                    className="mobile-menu-toggle" 
                    onClick={onToggleSecondary}
                    title="Toggle Menu"
                >
                    <Menu size={24} />
                </button>
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
            </div>
        </header>
    );
};

export default Header;
