import './App.css'
import AppRoutes from './router/Routes'
import { useEffect } from 'react';
import { initializeAccounts } from './utils/Accounts'

function App() {
    useEffect(() => {
        initializeAccounts();
    }, [])
    return (
        <AppRoutes/>
    )
}

export default App
