// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "notification-a27b4.firebaseapp.com",
    projectId: "notification-a27b4",
    storageBucket: "notification-a27b4.firebasestorage.app",
    messagingSenderId: "910376096021",
    appId: import.meta.env.VITE_APP_ID,
    measurementId: "G-NFZFL5VFSQ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'Default Title';
    const notificationOptions = {
        body: payload.notification?.body || 'Default body',
        icon: payload.notification?.icon || '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});