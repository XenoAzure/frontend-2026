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
    const { postLoginLoading, finishPostLoginLoading } = useAuth();

    return (
        <div className="main-layout">
            {postLoginLoading && <PostLoginLoadingScreen onFinished={finishPostLoginLoading} />}
            <Header />
            <div className="layout-body">
                <PrimarySidebar 
                    currentFilter={currentFilter} 
                    onFilterChange={setCurrentFilter} 
                />
                
                <SecondarySidebar 
                    currentFilter={currentFilter} 
                />

                <main className="main-content">
                    <div className="content-body">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
