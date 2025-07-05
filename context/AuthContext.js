import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState(null);

    // Check if user is already signed in when app loads
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                // Verify token with your API
                const response = await fetch(`${API_URL}/verify-token`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setIsSignedIn(true);
                } else {
                    // Token is invalid, remove it
                    await AsyncStorage.removeItem('authToken');
                    setIsSignedIn(false);
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsSignedIn(false);
        } finally {
            setIsLoaded(true);
        }
    };

    const signIn = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('authToken', data.token);
                setUser(data.user);
                setIsSignedIn(true);
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Sign in failed' };
            }
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const signUp = async (name, email, password) => {
        try {
            const response = await fetch(`${API_URL}/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.message || 'Sign up failed' };
            }
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            setUser(null);
            setIsSignedIn(false);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const value = {
        isSignedIn,
        isLoaded,
        user,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};