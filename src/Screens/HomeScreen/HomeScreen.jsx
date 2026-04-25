import { Link, useNavigate, useOutletContext } from 'react-router'
import { useState } from 'react'
import useWorkspaces from '../../hooks/useWorkspaces'
import { useLanguage } from '../../Context/LanguageContext'
import { useAuth } from '../../hooks/useAuth'
import ENVIRONMENT from '../../config/environment'
import { getToken } from '../../Context/AuthContext'

const HomeScreen = () => {
  const { t } = useLanguage();
  const { response, loading, error, workspaces } = useWorkspaces()
  const { user, refreshUser } = useAuth();
  const { currentFilter } = useOutletContext();
  const token = getToken();

  return (
      <div className="dashboard-container dashboard-card home-screen-container">
          {/* Desktop: full workspace list */}
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

          {/* Mobile: ambient prompt — the sidebar drawer handles navigation */}
          <div className="home-mobile-view">
              <div className="home-mobile-empty-state">
                  <div className="home-mobile-empty-glyph">◈</div>
                  <p className="home-mobile-empty-text">
                      Start a conversation,<br />or do something productive.
                  </p>
              </div>
          </div>
      </div>
  )
}

export default HomeScreen