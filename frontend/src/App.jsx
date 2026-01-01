import React, { useState, useEffect } from 'react';
import AuctionDashboard from './AuctionDashboard';
import LoginPage from './LoginPage';
import UserProfile from './UserProfile'; // <--- Import new component

function App() {
    const savedUser = JSON.parse(localStorage.getItem('auction_user'));
    const [user, setUser] = useState(savedUser || null);

    // New State for Navigation
    const [currentView, setCurrentView] = useState('dashboard');

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('auction_user', JSON.stringify(userData));
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('auction_user');
        setCurrentView('dashboard');
    };



    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (currentView === 'profile') {
        return <UserProfile currentUser={user} onBack={() => setCurrentView('dashboard')} />;
    }

    return (
        <AuctionDashboard
            currentUser={user}
            onLogout={handleLogout}
            onGoToProfile={() => setCurrentView('profile')} // Pass navigation prop
        />
    );
}

export default App;