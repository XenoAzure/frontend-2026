import { Link, useNavigate, useOutletContext } from 'react-router'
import { useState } from 'react'
import useWorkspaces from '../../hooks/useWorkspaces'
import { useLanguage } from '../../Context/LanguageContext'
import { useAuth } from '../../hooks/useAuth'
import { Search, Hash, User, UserPlus } from 'lucide-react'
import ENVIRONMENT from '../../config/environment'
import { getToken } from '../../Context/AuthContext'

const HomeScreen = () => {
  const { t } = useLanguage();
  const { response, loading, error, workspaces } = useWorkspaces()
  const { user, refreshUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendId, setFriendId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { currentFilter } = useOutletContext();
  const token = getToken();

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!friendId.trim()) return;
    setActionLoading(true);
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/user/friends`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ friend_public_id: friendId.trim() })
        });
        if (response.ok) {
            setFriendId('');
            setIsAddingFriend(false);
            refreshUser();
        } else {
            const data = await response.json();
            alert(data.message || 'Error al agregar amigo');
        }
    } catch (error) {
        alert('Error de conexión');
    } finally {
        setActionLoading(false);
    }
  };

  const filteredItems = [
      ...(currentFilter === 'workspaces' || !currentFilter ? (workspaces || []).map(w => ({ type: 'workspace', id: w.workspace_id, name: w.workspace_title })) : []),
      ...(currentFilter === 'dms' || !currentFilter ? (user?.friends || []).map(f => ({ type: 'user', id: f._id, name: f.name })) : [])
  ].filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
      <div className="dashboard-container dashboard-card home-screen-container">
          <div className="home-desktop-view">
              <div className="header-actions">
                  <h1 className="dashboard-title">{t('home.title')}</h1>
                  <Link to='/workspace/new' className="btn">{t('home.new_workspace')}</Link>
              </div>
              
              {loading && <div className="text-center text-muted">{t('home.loading')}</div>}
              
              {!loading && workspaces && (
                  <div className="workspace-list">
                      {workspaces.length === 0 ? (
                          <div className="empty-state">
                              <h3>{t('home.empty.title')}</h3>
                              <p style={{ marginTop: '0.5rem' }}>{t('home.empty.subtitle')}</p>
                          </div>
                      ) : (
                          workspaces.map((workspace) => (
                              <div key={workspace.workspace_id} className="workspace-item">
                                  <h2>{workspace.workspace_title}</h2>
                                  <Link className="btn btn-secondary" to={'/workspace/' + workspace.workspace_id}>
                                      {t('home.open')}
                                  </Link>
                              </div>
                          ))
                      )}
                  </div>
              )}
          </div>

          <div className="home-mobile-view">
              <div className="search-container mobile-home-search">
                  <div className="search-box">
                      <Search size={18} className="text-muted" />
                      <input 
                          type="text" 
                          placeholder={t('sidebar.search_placeholder')} 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>

              <div className="add-friend-container-mobile">
                  <button 
                      className="add-friend-btn" 
                      onClick={() => setIsAddingFriend(!isAddingFriend)}
                  >
                      <UserPlus size={16} /> {t('sidebar.add_friend')}
                  </button>
                  
                  {isAddingFriend && (
                      <form className="add-friend-form" onSubmit={handleAddFriend}>
                          <input 
                              type="text" 
                              placeholder={t('sidebar.friend_id_placeholder')} 
                              value={friendId}
                              onChange={(e) => setFriendId(e.target.value)}
                              disabled={actionLoading}
                              autoFocus
                          />
                          <button type="submit" disabled={actionLoading || !friendId.trim()}>
                              {t('sidebar.add')}
                          </button>
                      </form>
                  )}
              </div>
              
              <div className="sidebar-list mobile-home-list">
                  {filteredItems.map((item) => (
                      <div 
                          key={`${item.type}-${item.id}`} 
                          className="list-item"
                          onClick={() => navigate(item.type === 'workspace' ? `/workspace/${item.id}` : `/dm/${item.id}`)}
                          style={{ cursor: 'pointer' }}
                      >
                          <div className="item-avatar">
                              {item.type === 'workspace' ? <Hash size={16} /> : <User size={16} />}
                          </div>
                          <span className="item-name">{item.name}</span>
                      </div>
                  ))}
                  {!loading && filteredItems.length === 0 && (
                      <div className="text-center p-4 text-muted">{t('sidebar.no_results')}</div>
                  )}
              </div>
          </div>
      </div>
  )
}

export default HomeScreen