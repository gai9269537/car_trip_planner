// Main App component - handles application state and view routing
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Attraction, Hotel, TripResult, Waypoint, Deal, User, ActionLink, Trip } from './types';
import { useContext } from './contexts/UserContext';
import { apiService } from './services/api';

import { HomeView } from './views/HomeView';
import { NewTripPlanningView } from './components/NewTripPlanningView';
import { TripResultsView } from './views/TripResultsView';
import { AttractionsView } from './views/AttractionsView';
import { WarningsView } from './views/WarningsView';
import { DealsView } from './views/DealsView';
import { HotelsView } from './views/HotelsView';
import { ExpertHelpView } from './views/ExpertHelpView';
import { LoginView } from './views/LoginView';
import { SettingsView } from './views/SettingsView';
import { Header } from './components/Header';
import { TripDetailView } from './views/TripDetailView';

type View =
    | { name: 'home' }
    | { name: 'newTrip' }
    | { name: 'tripResults'; tripResult: TripResult }
    | { name: 'attractions'; waypoint: Waypoint }
    | { name: 'warnings'; waypoint: Waypoint }
    | { name: 'deals'; deals: Deal[]; contextName: string }
    | { name: 'hotels'; waypoint: Waypoint }
    | { name: 'expertHelp'; hotel: Hotel }
    | { name: 'settings' }
    | { name: 'login' }
    | { name: 'tripDetail'; trip: Trip };

const App: React.FC = () => {
    const [viewStack, setViewStack] = useState<View[]>([{ name: 'home' }]);
    const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const { user, login, logout } = useContext();

    const currentView = viewStack[viewStack.length - 1];

    // Load trips when user is logged in
    useEffect(() => {
        if (user) {
            loadTrips();
        }
    }, [user]);

    const loadTrips = async () => {
        if (!user?.id) return;
        setLoadingTrips(true);
        try {
            const trips = await apiService.getTrips(user.id);
            setUpcomingTrips(trips);
        } catch (error) {
            console.error('Failed to load trips:', error);
        } finally {
            setLoadingTrips(false);
        }
    };

    const navigate = (newView: View) => {
        setViewStack(prev => [...prev, newView]);
    };

    const goBack = () => {
        setViewStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
    };

    const handleLogin = async (name: string, email: string) => {
        try {
            await login(name, email);
            setViewStack([{ name: 'home' }]);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Failed to login. Please try again.');
        }
    };
    
    const handleLogout = () => {
        logout();
        setViewStack([{ name: 'login' }]);
    };
    
    const handleSkillTrigger = (action: ActionLink) => {
        console.log(`Skill triggered: ${action.target}`);
        alert(`Demo skill triggered: ${action.target}`);
    };
    
    const handleSaveTrip = async (tripResult: TripResult) => {
        if (!user?.id) return;
        
        try {
            await apiService.saveTrip(user.id, tripResult);
            const newTrip: Trip = {
                id: tripResult.id || uuidv4(),
                name: `${tripResult.origin} to ${tripResult.destination}`,
                dates: 'Dates TBD',
                plannedProgress: 1.0,
                iconName: 'map',
            };
            setUpcomingTrips(prev => [newTrip, ...prev]);
            navigate({ name: 'tripDetail', trip: newTrip });
        } catch (error) {
            console.error('Failed to save trip:', error);
            alert('Failed to save trip. Please try again.');
        }
    };

    if (!user) {
        return <LoginView onLogin={handleLogin} />;
    }

    const renderContent = () => {
        switch (currentView.name) {
            case 'home':
                return <HomeView 
                    onNewTripClick={() => navigate({ name: 'newTrip' })}
                    onTripClick={(trip) => navigate({ name: 'tripDetail', trip })}
                    upcomingTrips={upcomingTrips}
                    loading={loadingTrips}
                />;
            case 'newTrip':
                return <NewTripPlanningView 
                    userId={user.id} 
                    onTripGenerated={(trip) => {
                        loadTrips(); // Refresh trips list
                        navigate({ name: 'tripResults', tripResult: trip });
                    }} 
                    onBack={goBack} 
                />;
            case 'tripResults':
                return <TripResultsView
                    tripResult={currentView.tripResult}
                    onBack={goBack}
                    onShowAttractions={(waypoint) => navigate({ name: 'attractions', waypoint })}
                    onShowWarnings={(waypoint) => navigate({ name: 'warnings', waypoint })}
                    onShowDeals={(waypoint) => navigate({ name: 'deals', deals: waypoint.deals, contextName: waypoint.name })}
                    onShowHotels={(waypoint) => navigate({ name: 'hotels', waypoint })}
                    onTripResultChange={(newTripResult) => {
                        setViewStack(prev => {
                            const newStack = [...prev];
                            const current = newStack[newStack.length - 1];
                            if (current.name === 'tripResults') {
                                newStack[newStack.length - 1] = { ...current, tripResult: newTripResult };
                            }
                            return newStack;
                        });
                    }}
                    onSaveTrip={handleSaveTrip}
                />;
            case 'attractions':
                return <AttractionsView
                    waypoint={currentView.waypoint}
                    onBack={goBack}
                    onShowDeals={(attraction) => navigate({ name: 'deals', deals: attraction.deals || [], contextName: attraction.name })}
                />;
            case 'warnings':
                return <WarningsView waypoint={currentView.waypoint} onBack={goBack} />;
            case 'deals':
                return <DealsView deals={currentView.deals} contextName={currentView.contextName} onBack={goBack} onSkillTrigger={handleSkillTrigger} />;
            case 'hotels':
                return <HotelsView waypoint={currentView.waypoint} onBack={goBack} onSkillTrigger={handleSkillTrigger} onExpertHelp={(hotel) => navigate({ name: 'expertHelp', hotel })}/>;
            case 'expertHelp':
                return <ExpertHelpView hotel={currentView.hotel} onBack={goBack} />;
            case 'settings':
                return <SettingsView onBack={goBack} />;
            case 'tripDetail':
                return <TripDetailView trip={currentView.trip} onBack={goBack} />;
            default:
                return <HomeView 
                    onNewTripClick={() => navigate({ name: 'newTrip' })} 
                    onTripClick={(trip) => navigate({ name: 'tripDetail', trip })}
                    upcomingTrips={upcomingTrips}
                />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Header
                user={user}
                onLogout={handleLogout}
                onSettingsClick={() => navigate({ name: 'settings' })}
                onLogoClick={() => setViewStack([{ name: 'home' }])}
            />
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default App;