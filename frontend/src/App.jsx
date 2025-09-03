import './App.css'
import AppRoutes from './router/routes'
import { useEffect } from 'react';
import { initializeAccounts } from './utils/Accounts'
import SnackbarWrapper from './components/SnackbarWrapper'

function App() {
    useEffect(() => {
        initializeAccounts();
    }, [])

    return (
        <>
            <AppRoutes/>
            <SnackbarWrapper/>
        </>
    )
}

export default App
