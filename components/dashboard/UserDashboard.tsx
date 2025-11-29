
import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle, Info, Globe, ExternalLink, Smartphone, User, LogOut, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { ChatbotView } from './ChatbotView';
import { getHealthNews } from '../../services/geminiService';
import { Spinner } from '../ui/Spinner';
import { auth, signInWithGoogle, logoutUser } from '../../services/firebase';

interface UserDashboardProps {
  activePage: string;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onMockLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, user, onMockLogin }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            onClose();
        } catch (err: any) {
            // Log only the message to prevent circular JSON error with Firebase Error objects
            console.error("Login failed:", err.message);
            
            const errorCode = err.code || '';
            const errorMessage = err.message || '';

            // Specific handling for common Preview Environment Auth errors
            if (
                errorCode === 'auth/unauthorized-domain' || 
                errorCode === 'auth/popup-blocked' ||
                errorCode === 'auth/operation-not-allowed' ||
                errorMessage.includes('unauthorized-domain') ||
                errorMessage.includes('popup-blocked')
            ) {
                console.warn("Auth failed due to environment restrictions. Falling back to Demo Login.");
                onMockLogin();
                onClose();
            } else {
                setError("Login failed. " + (errorMessage || "Check console."));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            onClose();
        } catch (err: any) {
            console.error("Logout failed:", err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {user ? (
                     <div className="flex flex-col items-center p-4">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full mb-4 border-4 border-primary/20" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                                <User size={40} />
                            </div>
                        )}
                        <h3 className="font-bold text-xl text-gray-800">{user.displayName || 'User'}</h3>
                        <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                        
                        <div className="w-full space-y-3">
                             <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                                <p className="text-sm text-green-800 font-medium">✅ Health Preferences Synced</p>
                             </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 font-medium px-4 py-3 rounded-lg border border-red-100 hover:border-red-200 transition-all"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-2">
                        <div className="text-center mb-6">
                             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                                <User size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Quick Login</h3>
                            <p className="text-sm text-gray-500 mt-1">Sign in to sync your health data and receive personalized alerts.</p>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                {loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Sign in with Google
                            </button>
                            <button className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white hover:bg-gray-800 font-medium py-3 px-4 rounded-lg shadow-sm transition-all">
                                <Smartphone size={20} />
                                Sign in with Mobile
                            </button>
                            {error && <p className="text-xs text-red-500 text-center mt-2 bg-red-50 p-2 rounded">{error}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const LiveAdvisoryCard = () => (
    <Card title="Live Advisory Feed" icon={<AlertCircle size={20} className="text-primary"/>}>
        <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                         <p className="font-bold text-yellow-800 text-lg">High Patient Volume [City Center]</p>
                         <p className="text-sm text-yellow-700 mt-1">Hospitals in the City Center are currently experiencing high wait times. Please use local clinics for non-emergencies.</p>
                    </div>
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Medium Severity</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                    <span>Updated 5 mins ago</span>
                </p>
            </div>
            
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded shadow-sm">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-green-800 text-lg">Normal Operations [North Suburbs]</p>
                        <p className="text-sm text-green-700 mt-1">Services are operating normally. Thank you for your cooperation.</p>
                    </div>
                    <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Low Severity</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">Updated 30 mins ago</p>
            </div>

             <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded shadow-sm">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-blue-800 text-lg">Vaccination Drive [West District]</p>
                        <p className="text-sm text-blue-700 mt-1">Flu vaccination drive available at West Community Center this weekend.</p>
                    </div>
                    <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Info</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">Updated 2 hours ago</p>
            </div>
        </div>
    </Card>
);

const HealthNewsCard = () => {
    const [news, setNews] = useState<{ content: string; sources: { title: string; uri: string }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const result = await getHealthNews();
            setNews(result);
            setIsLoading(false);
        };
        fetchNews();
    }, []);

    return (
        <Card title="Real-Time Health News" icon={<Globe size={20} className="text-blue-500"/>}>
            {isLoading ? (
                <div className="flex justify-center p-4">
                    <Spinner size="md" />
                </div>
            ) : (
                <div className="space-y-4">
                     <div className="prose prose-sm max-w-none text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: news?.content.replace(/\n/g, '<br/>') || '' }} />
                     </div>
                     {news?.sources && news.sources.length > 0 && (
                        <div className="pt-3 border-t">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Sources (Google Search):</p>
                            <ul className="space-y-1">
                                {news.sources.map((source, idx) => (
                                    <li key={idx}>
                                        <a 
                                            href={source.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                            <ExternalLink size={10} /> {source.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ activePage }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
         const unsubscribe = auth.onAuthStateChanged((u) => {
             // If real auth happens, use it. Otherwise retain mock user if set.
             if (u) {
                setUser(u);
             } else {
                setUser((prev: any) => (prev?.isMock ? prev : null));
             }
         });
         return () => unsubscribe();
    }, []);
    
    const handleMockLogin = () => {
        setUser({
            displayName: "Guest User (Demo)",
            email: "guest@demo.com",
            photoURL: null,
            uid: "mock-guest-123",
            isMock: true
        });
        // Short delay to allow modal to close smoothly
        setTimeout(() => {
            alert("Notice: Access limited in preview environment.\n\nYou have been logged in as a 'Guest User (Demo)' to test the dashboard functionality.");
        }, 300);
    };

    if (activePage === 'AI Chatbot') {
        return <ChatbotView />;
    }

    if (activePage === 'Health Tips') {
         return (
            <div className="max-w-4xl mx-auto space-y-6">
                 <Card title="General Awareness & Tips" icon={<PlusCircle size={20} />}>
                    <div className="prose prose-sm max-w-none text-gray-600">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span><strong>Stay Hydrated:</strong> Drink at least 8 glasses of water a day to maintain optimal health.</span>
                            </li>
                             <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span><strong>Hygiene:</strong> Wash hands frequently with soap and water for at least 20 seconds, especially after being in public places.</span>
                            </li>
                             <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span><strong>Rest:</strong> Get adequate rest (7-9 hours of sleep) to support your immune system.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold text-on-surface mb-2 flex items-center gap-2"><Info size={16}/> Downloads</h4>
                        <button className="text-primary hover:underline text-sm font-medium">Download WHO Health Bulletin PDF</button>
                    </div>
                </Card>
                
                 <Card title="Emergency Contacts">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-red-50 rounded border border-red-100">
                            <p className="text-xs font-bold text-red-600 uppercase">Emergency Ambulance</p>
                            <p className="text-lg font-bold text-gray-800">108</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded border border-blue-100">
                            <p className="text-xs font-bold text-blue-600 uppercase">Health Helpline</p>
                            <p className="text-lg font-bold text-gray-800">104</p>
                        </div>
                    </div>
                </Card>
            </div>
         );
    }

    // Default view (Live Advisories)
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full shadow-sm hover:shadow hover:bg-gray-50 transition-all font-medium text-sm"
                >
                    {user ? (
                        <>
                             {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full border border-gray-200" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User size={14} />
                                </div>
                            )}
                            <span>{user.displayName?.split(' ')[0] || 'My Account'}</span>
                        </>
                    ) : (
                        <>
                            <User size={16} />
                            <span>Login / Sign Up</span>
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <LiveAdvisoryCard />
                    <HealthNewsCard />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Quick Tips" icon={<PlusCircle size={20} />}>
                         <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Wear masks in crowded areas.</li>
                            <li>• Sanitize hands regularly.</li>
                            <li>• Avoid self-medication.</li>
                        </ul>
                        <div className="mt-4 pt-4 border-t">
                             <p className="text-xs text-gray-500">For detailed health tips, visit the "Health Tips" page.</p>
                        </div>
                    </Card>
                </div>
            </div>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
                user={user} 
                onMockLogin={handleMockLogin}
            />
        </div>
    );
};
