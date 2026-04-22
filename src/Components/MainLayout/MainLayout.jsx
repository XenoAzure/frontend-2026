import React, { useState } from 'react';
import { Outlet } from 'react-router';
import PrimarySidebar from './PrimarySidebar';
import SecondarySidebar from './SecondarySidebar';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';
import PostLoginLoadingScreen from '../LoadingScreen/PostLoginLoadingScreen';
import './MainLayout.css';

const MainLayout = () => {
    const [currentFilter, setCurrentFilter] = useState(null);
    const [showSecondaryMobile, setShowSecondaryMobile] = useState(false);
    const { postLoginLoading, finishPostLoginLoading } = useAuth();

    const handleToggleSecondary = () => {
        setShowSecondaryMobile(prev => !prev);
    };

    const handleCloseSecondary = () => {
        setShowSecondaryMobile(false);
    };

    // When a filter button is tapped on mobile, open the drawer automatically
    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
        if (filter !== null) {
            setShowSecondaryMobile(true);
        }
    };

    return (
        <div className="main-layout">
            {postLoginLoading && <PostLoginLoadingScreen onFinished={finishPostLoginLoading} />}
            <Header onToggleSecondary={handleToggleSecondary} />
            <div className={`layout-body ${showSecondaryMobile ? 'secondary-open' : ''}`}>
                <PrimarySidebar 
                    currentFilter={currentFilter} 
                    onFilterChange={handleFilterChange} 
                />
                
                {showSecondaryMobile && (
                    <div className="mobile-overlay" onClick={handleCloseSecondary}></div>
                )}
                
                <SecondarySidebar 
                    currentFilter={currentFilter} 
                />

                <main className="main-content">
                    <div className="content-body">
                        <Outlet context={{ currentFilter }} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

