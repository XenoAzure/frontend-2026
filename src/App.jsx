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


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Completely remove loading screen after 3 seconds
    const finishTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen isExiting={isExiting} />;
  }

  return (
    <Routes>
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/' element={<LandingScreen />} />
      <Route
        path="/reset-password-request"
        element={<ResetPasswordRequestScreen />}
      />
      <Route element={<AuthMiddleware />}>
        <Route
          path='/home'
          element={<HomeScreen />}
        />
        <Route
          path='/workspace/new'
          element={<WorkspaceNewScreen />}
        />
      </Route>
    </Routes>
  )
}

export default App