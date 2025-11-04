// FIX: Implementing the main App component to handle application state and view routing.
import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Attraction, Hotel, TripResult, Waypoint, Deal, User, ActionLink, Trip } from './types';
import { UserContext } from './contexts/UserContext';

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
import { UPCOMING_TRIPS } from './constants';

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
    // FIX: Add 'login' to the View type to allow setting the view state to 'login' upon logout.
    | { name: 'login' }
    | { name: 'tripDetail'; trip: Trip };

const App: React.FC = () => {
    const [viewStack, setViewStack] = useState<View[]>([{ name: 'home' }]);
    const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>(UPCOMING_TRIPS);
    const { user, login, logout } = useContext(UserContext);

    const currentView = viewStack[viewStack.length - 1];

    const navigate = (newView: View) => {
        setViewStack(prev => [...prev, newView]);
    };

    const goBack = () => {
        setViewStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
    };

    const handleLogin = (mockUser: User) => {
        login(mockUser);
        setViewStack([{ name: 'home' }]);
    };
    
    const handleLogout = () => {
        logout();
        setViewStack([{ name: 'login' }]);
    };
    
    const handleSkillTrigger = (action: ActionLink) => {
        console.log(`Skill triggered: ${action.target}`);
        alert(`Demo skill triggered: ${action.target}`);
    };
    
    const handleSaveTrip = (tripResult: TripResult) => {
        const newTrip: Trip = {
            id: uuidv4(),
            name: `${tripResult.origin} to ${tripResult.destination}`,
            dates: 'Dates TBD',
            plannedProgress: 1.0,
            iconName: 'map',
        };
        setUpcomingTrips(prev => [newTrip, ...prev]);
        navigate({ name: 'tripDetail', trip: newTrip });
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
                />;
            case 'newTrip':
                return <NewTripPlanningView onTripGenerated={(trip) => navigate({ name: 'tripResults', tripResult: trip })} onBack={goBack} />;
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