import { useEffect } from 'react';
import { notificationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to handle FCM token registration.
 * This should be used at a high level in the component tree (e.g., in a layout or root component).
 * 
 * @param {string} token - The FCM token obtained from Firebase messaging
 * @param {string} platform - The platform (e.g., 'web', 'android', 'ios')
 */
export const useFcmToken = (token, platform = 'web') => {
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            registerToken();
        }
    }, [isAuthenticated, token]);

    const registerToken = async () => {
        try {
            await notificationsAPI.registerFcmToken({
                token: token,
                platform: platform
            });
            console.log('FCM Token registered successfully');
        } catch (error) {
            console.error('Failed to register FCM token:', error);
        }
    };
};
