import React, { useState } from 'react';
import { Search, Hash, User } from 'lucide-react';
import useWorkspaces from '../../hooks/useWorkspaces';

const SecondarySidebar = ({ currentFilter }) => {
    const { workspaces, loading } = useWorkspaces();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock users since we don't have a DM list yet
    const mockUsers = [
        { id: 1, name: 'John Doe', type: 'user' },
        { id: 2, name: 'Jane Smith', type: 'user' },
    ];

    const filteredItems = [
        ...(currentFilter === 'workspaces' || !currentFilter ? (workspaces || []).map(w => ({ ...w, type: 'workspace', id: w.workspace_id, name: w.workspace_title })) : []),
        ...(currentFilter === 'dms' || !currentFilter ? mockUsers : [])
    ].filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <aside className="secondary-sidebar">
            <div className="search-container">
                <div className="search-box">
                    <Search size={18} className="text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="sidebar-list">
                {loading ? (
                    <div className="text-center p-4 text-muted">Loading...</div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="list-item">
                            <div className="item-avatar">
                                {item.type === 'workspace' ? <Hash size={16} /> : <User size={16} />}
                            </div>
                            <span className="item-name">{item.name}</span>
                        </div>
                    ))
                )}
                {!loading && filteredItems.length === 0 && (
                    <div className="text-center p-4 text-muted">No results found</div>
                )}
            </div>
        </aside>
    );
};

export default SecondarySidebar;
