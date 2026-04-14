import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import LoginScreen from './Screens/LoginScreen/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen'
import ResetPasswordRequestScreen from './Screens/ResetPasswordRequestScreen/ResetPasswordRequestScreen'
import AuthMiddleware from './Middlewares/AuthMiddleware'
import LandingScreen from './Screens/LandingScreen/LandingScreen'
import HomeScreen from './Screens/HomeScreen/HomeScreen'
import WorkspaceNewScreen from './Screens/WorkspaceScreen/WorkspaceNewScreen'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen'
import MainLayout from './Components/MainLayout/MainLayout'
import { LanguageProvider } from './Context/LanguageContext'


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Remove loading screen
    const finishTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <LanguageProvider>
      {isLoading ? (
        <LoadingScreen isExiting={isExiting} />
      ) : (
        <Routes>
          <Route path='/login' element={<LoginScreen />} />
          <Route path='/register' element={<RegisterScreen />} />
          <Route path='/' element={<LandingScreen />} />
          <Route
            path="/reset-password-request"
            element={<ResetPasswordRequestScreen />}
          />
          <Route element={<AuthMiddleware />}>
            <Route element={<MainLayout />}>
              <Route
                path='/home'
                element={<HomeScreen />}
              />
              <Route
                path='/workspace/new'
                element={<WorkspaceNewScreen />}
              />
            </Route>
          </Route>
        </Routes>
      )}
    </LanguageProvider>
  )
}

export default App