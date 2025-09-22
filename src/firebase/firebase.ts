// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "notification-a27b4.firebaseapp.com",
    projectId: "notification-a27b4",
    storageBucket: "notification-a27b4.firebasestorage.app",
    messagingSenderId: "910376096021",
    appId: import.meta.env.VITE_APP_ID,
    measurementId: "G-NFZFL5VFSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Register service worker for Firebase messaging
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
}

const messaging = getMessaging(app);

export const generateToken = async () => {
    try {
        console.log('Starting token generation...');

        // Check if the browser supports notifications and service workers
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return;
        }

        if (!('serviceWorker' in navigator)) {
            console.log('This browser does not support service workers');
            return;
        }

        // Check if we're on localhost or HTTP (which might cause issues)
        if (location.protocol === 'http:' && location.hostname !== 'localhost') {
            console.warn('Push notifications require HTTPS in production');
        }

        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);

        if (permission === 'granted') {
            // Wait for service worker to be ready and ensure it's active
            console.log('Waiting for service worker to be ready...');
            const registration = await navigator.serviceWorker.ready;
            console.log('Service worker ready:', registration);

            // Ensure the service worker is active
            if (!registration.active) {
                console.log('Service worker is not active yet, waiting...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            console.log('Attempting to get FCM token...');

            // Try to get token without VAPID key first (for testing)
            const token = await getToken(messaging);

            if (token) {
                console.log('Successfully got FCM token:', token);
                return token;
            } else {
                console.log('No registration token available without VAPID key.');
                console.log('Note: You may need to configure VAPID keys in Firebase Console');
                console.log('Go to: Firebase Console > Project Settings > Cloud Messaging > Web configuration');
            }
        } else {
            console.log('Notification permission denied or dismissed');
        }
    } catch (error) {
        console.error('Error in generateToken:', error);

        // Provide more specific error information
        if (error instanceof Error) {
            if (error.message.includes('Registration failed')) {
                console.error('This error usually means:');
                console.error('1. VAPID key is incorrect or not set in Firebase Console');
                console.error('2. Service worker registration issues');
                console.error('3. Browser/environment doesn\'t support push notifications');
            }
        }
    }
}

// Test function to check if Firebase is properly initialized
export const testFirebaseConnection = () => {
    console.log('Firebase app initialized:', app);
    console.log('Firebase messaging instance:', messaging);
    console.log('Browser supports:', {
        notifications: 'Notification' in window,
        serviceWorker: 'serviceWorker' in navigator,
        pushManager: 'PushManager' in window
    });
}

export { app, analytics, messaging };