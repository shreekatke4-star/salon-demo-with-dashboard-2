/**
 * Glamour Studio — Firebase Configuration & Firestore Manager
 * Handles real-time appointments, services management, gallery images, and authentication.
 * Falls back to LocalStorage demo store if Firebase credentials are not yet configured.
 */

// ============================================================
// 🔥 PASTE YOUR FIREBASE PROJECT KEYS HERE
// Get them from: Firebase Console → Project Settings → Your Apps → Web App
// ============================================================
window.DEFAULT_FIREBASE_CONFIG = {
    apiKey:            "AIzaSyCKfg8CvDaAz8awwxonKlIhMLestOZ4Rnc",
    authDomain:        "glamour-studio-80faa.firebaseapp.com",
    projectId:         "glamour-studio-80faa",
    storageBucket:     "glamour-studio-80faa.firebasestorage.app",
    messagingSenderId: "363777346781",
    appId:             "1:363777346781:web:e7dc8a980a31cf6d541f34"
};
// ============================================================


// Keys for stored custom credentials & demo data
const STORAGE_CONFIG_KEY = 'glamour_salon_firebase_config';
const STORAGE_DEMO_APPOINTMENTS_KEY = 'glamour_salon_appointments_demo';
const STORAGE_DEMO_SERVICES_KEY = 'glamour_salon_services_demo';
const STORAGE_DEMO_GALLERY_KEY = 'glamour_salon_gallery_demo';

// Default initial services with prices & images
const DEFAULT_SERVICES = [
    { id: 'haircut', title: 'Haircut & Styling', price: 499, category: 'Hair', duration: '30-60 min', img: 'haircut.jpg', active: true },
    { id: 'hairspa', title: 'Hair Spa & Treatment', price: 999, category: 'Hair', duration: '45-90 min', img: 'hair-spa.jpg', active: true },
    { id: 'haircolor', title: 'Hair Color & Highlights', price: 2499, category: 'Hair', duration: '2-4 hrs', img: 'hair-color.jpg', active: true },
    { id: 'facial', title: 'Facial & Skin Care', price: 599, category: 'Skin', duration: '45-75 min', img: 'facial.jpg', active: true },
    { id: 'makeup', title: 'Party & Event Makeup', price: 2999, category: 'Makeup', duration: '60 min', img: 'makeup.jpg', active: true },
    { id: 'bridal', title: 'Bridal Makeup Package', price: 9999, category: 'Makeup', duration: '3-4 hrs', img: 'bridal-makeup.jpg', active: true },
    { id: 'manicure', title: 'Manicure & Pedicure', price: 899, category: 'Nails', duration: '45-90 min', img: 'manicure-pedicure.jpg', active: true },
    { id: 'waxing', title: 'Waxing & Threading', price: 499, category: 'Body', duration: '30-60 min', img: 'waxing-threading.jpg', active: true }
];

// Default initial gallery images
const DEFAULT_GALLERY = [
    { id: 'gal-1', title: 'Luxury Salon Interior', category: 'Interior', url: 'interior-gallery.jpg', createdAt: new Date().toISOString() },
    { id: 'gal-2', title: 'Precision Haircuts', category: 'Hair', url: 'haircut-gallery.jpg', createdAt: new Date().toISOString() },
    { id: 'gal-3', title: 'Flawless Party Makeup', category: 'Makeup', url: 'makeup-gallery.jpg', createdAt: new Date().toISOString() },
    { id: 'gal-4', title: 'Global Hair Color & Balayage', category: 'Hair', url: 'hair-color-gallery.jpg', createdAt: new Date().toISOString() },
    { id: 'gal-5', title: 'Bridal Makeup Transformation', category: 'Bridal', url: 'bridal-makeup.jpg', createdAt: new Date().toISOString() },
    { id: 'gal-6', title: 'Relaxing Facial Session', category: 'Skin', url: 'facial.jpg', createdAt: new Date().toISOString() }
];

// Initial demo appointments
const DEFAULT_APPOINTMENTS = [
    {
        id: 'apt-101',
        from_name: 'Ananya Sharma',
        from_phone: '+91 98765 43210',
        reply_to: 'ananya@example.com',
        service: 'Bridal Makeup Package',
        datetime: '2026-08-05T14:00',
        message: 'Need trial session included for wedding reception.',
        status: 'Pending',
        price: 9999,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
        id: 'apt-102',
        from_name: 'Priya Verma',
        from_phone: '+91 91234 56789',
        reply_to: 'priya@example.com',
        service: 'Hair Color & Highlights',
        datetime: '2026-08-02T11:30',
        message: 'Looking for subtle balayage highlights.',
        status: 'Confirmed',
        price: 2499,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
        id: 'apt-103',
        from_name: 'Sneha Patel',
        from_phone: '+91 99887 76655',
        reply_to: 'sneha@example.com',
        service: 'Facial & Skin Care',
        datetime: '2026-08-01T16:00',
        message: 'Gold facial preferred.',
        status: 'Completed',
        price: 1299,
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
    }
];

class SalonFirebaseManager {
    constructor() {
        this.db = null;
        this.auth = null;
        this.isFirebaseReady = false;
        this.listeners = [];
        this.init();
    }

    // Initialize Firebase SDK or load fallback config
    init() {
        const customConfig = this.getStoredConfig();
        const configToUse = customConfig || window.DEFAULT_FIREBASE_CONFIG || null;

        // Skip if keys are still the placeholder values
        const isPlaceholder = configToUse && (
            configToUse.apiKey === 'YOUR_API_KEY' ||
            configToUse.apiKey === '' ||
            !configToUse.projectId ||
            configToUse.projectId === 'YOUR_PROJECT_ID'
        );

        if (configToUse && !isPlaceholder && window.firebase && window.firebase.initializeApp) {
            try {
                if (!window.firebase.apps.length) {
                    window.firebase.initializeApp(configToUse);
                }
                this.db = window.firebase.firestore();
                this.auth = window.firebase.auth();
                this.isFirebaseReady = true;
                console.log('🔥 Firebase initialized successfully!');
            } catch (err) {
                console.warn('⚠️ Firebase init failed, falling back to LocalStorage demo mode:', err.message);
                this.isFirebaseReady = false;
                this.seedDemoData();
            }
        } else {
            if (isPlaceholder) {
                console.warn('⚠️ Firebase keys are still placeholders. Please update firebase-config.js with your real project keys.');
            } else {
                console.log('ℹ️ Running in Demo / LocalStorage Mode (No Firebase keys set yet).');
            }
            this.isFirebaseReady = false;
            this.seedDemoData();
        }
    }

    // Retrieve saved Firebase configuration
    getStoredConfig() {
        try {
            const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }

    // Save custom Firebase config
    saveConfig(config) {
        localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
        this.init();
    }

    // Clear custom config
    clearConfig() {
        localStorage.removeItem(STORAGE_CONFIG_KEY);
        location.reload();
    }

    // Seed LocalStorage demo data if empty
    seedDemoData() {
        if (!localStorage.getItem(STORAGE_DEMO_APPOINTMENTS_KEY)) {
            localStorage.setItem(STORAGE_DEMO_APPOINTMENTS_KEY, JSON.stringify(DEFAULT_APPOINTMENTS));
        }
        if (!localStorage.getItem(STORAGE_DEMO_SERVICES_KEY)) {
            localStorage.setItem(STORAGE_DEMO_SERVICES_KEY, JSON.stringify(DEFAULT_SERVICES));
        }
        if (!localStorage.getItem(STORAGE_DEMO_GALLERY_KEY)) {
            localStorage.setItem(STORAGE_DEMO_GALLERY_KEY, JSON.stringify(DEFAULT_GALLERY));
        }
    }

    // -------------------------------------------------------------
    // APPOINTMENTS API
    // -------------------------------------------------------------

    async addAppointment(appointmentData) {
        const payload = {
            from_name: appointmentData.from_name || 'Guest',
            from_phone: appointmentData.from_phone || '',
            reply_to: appointmentData.reply_to || '',
            service: appointmentData.service || 'General Consultation',
            datetime: appointmentData.datetime || new Date().toISOString(),
            message: appointmentData.message || '',
            status: appointmentData.status || 'Pending',
            price: Number(appointmentData.price) || 499,
            source: appointmentData.source || 'Website Booking',
            createdAt: new Date().toISOString()
        };

        if (this.isFirebaseReady && this.db) {
            try {
                const docRef = await this.db.collection('appointments').add(payload);
                return { id: docRef.id, ...payload };
            } catch (err) {
                console.error('Error writing to Firestore:', err);
                return this.addAppointmentDemo(payload);
            }
        } else {
            return this.addAppointmentDemo(payload);
        }
    }

    addAppointmentDemo(payload) {
        const list = JSON.parse(localStorage.getItem(STORAGE_DEMO_APPOINTMENTS_KEY) || '[]');
        const newApt = { id: 'apt-' + Date.now().toString().slice(-5), ...payload };
        list.unshift(newApt);
        localStorage.setItem(STORAGE_DEMO_APPOINTMENTS_KEY, JSON.stringify(list));
        this.notifyListeners();
        return newApt;
    }

    subscribeAppointments(callback) {
        if (this.isFirebaseReady && this.db) {
            try {
                return this.db.collection('appointments')
                    .orderBy('createdAt', 'desc')
                    .onSnapshot((snapshot) => {
                        const appointments = [];
                        snapshot.forEach((doc) => {
                            appointments.push({ id: doc.id, ...doc.data() });
                        });
                        callback(appointments);
                    }, (error) => {
                        console.warn('Firestore snapshot error, switching to demo store:', error);
                        callback(this.getDemoAppointments());
                    });
            } catch (e) {
                callback(this.getDemoAppointments());
            }
        } else {
            const handler = () => callback(this.getDemoAppointments());
            this.listeners.push(handler);
            handler();
            return () => {
                this.listeners = this.listeners.filter(l => l !== handler);
            };
        }
    }

    getDemoAppointments() {
        return JSON.parse(localStorage.getItem(STORAGE_DEMO_APPOINTMENTS_KEY) || '[]');
    }

    notifyListeners() {
        const current = this.getDemoAppointments();
        this.listeners.forEach(fn => fn(current));
    }

    async updateAppointmentStatus(id, newStatus) {
        if (this.isFirebaseReady && this.db) {
            try {
                await this.db.collection('appointments').doc(id).update({
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                });
                return true;
            } catch (err) {
                console.error('Firestore update error:', err);
                return this.updateAppointmentStatusDemo(id, newStatus);
            }
        } else {
            return this.updateAppointmentStatusDemo(id, newStatus);
        }
    }

    updateAppointmentStatusDemo(id, newStatus) {
        let list = this.getDemoAppointments();
        list = list.map(item => item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item);
        localStorage.setItem(STORAGE_DEMO_APPOINTMENTS_KEY, JSON.stringify(list));
        this.notifyListeners();
        return true;
    }

    async deleteAppointment(id) {
        if (this.isFirebaseReady && this.db) {
            try {
                await this.db.collection('appointments').doc(id).delete();
                return true;
            } catch (err) {
                return this.deleteAppointmentDemo(id);
            }
        } else {
            return this.deleteAppointmentDemo(id);
        }
    }

    deleteAppointmentDemo(id) {
        let list = this.getDemoAppointments();
        list = list.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_DEMO_APPOINTMENTS_KEY, JSON.stringify(list));
        this.notifyListeners();
        return true;
    }

    // -------------------------------------------------------------
    // SERVICES & PRICING API
    // -------------------------------------------------------------

    async getServices() {
        if (this.isFirebaseReady && this.db) {
            try {
                const snapshot = await this.db.collection('services').get();
                if (!snapshot.empty) {
                    const services = [];
                    snapshot.forEach(doc => services.push({ id: doc.id, ...doc.data() }));
                    return services;
                }
            } catch (e) {
                console.warn('Could not fetch services from Firestore, loading defaults:', e);
            }
        }
        return JSON.parse(localStorage.getItem(STORAGE_DEMO_SERVICES_KEY) || JSON.stringify(DEFAULT_SERVICES));
    }

    async saveService(serviceObj) {
        const services = await this.getServices();
        const existingIdx = services.findIndex(s => s.id === serviceObj.id);
        if (existingIdx >= 0) {
            services[existingIdx] = { ...services[existingIdx], ...serviceObj };
        } else {
            services.push(serviceObj);
        }

        localStorage.setItem(STORAGE_DEMO_SERVICES_KEY, JSON.stringify(services));

        if (this.isFirebaseReady && this.db) {
            try {
                await this.db.collection('services').doc(serviceObj.id).set(serviceObj, { merge: true });
            } catch (err) {
                console.warn('Firestore service update warning:', err);
            }
        }
        return true;
    }

    // -------------------------------------------------------------
    // GALLERY & WEBSITE MEDIA API
    // -------------------------------------------------------------

    async getGalleryImages() {
        if (this.isFirebaseReady && this.db) {
            try {
                const snapshot = await this.db.collection('gallery').orderBy('createdAt', 'desc').get();
                if (!snapshot.empty) {
                    const images = [];
                    snapshot.forEach(doc => images.push({ id: doc.id, ...doc.data() }));
                    return images;
                }
            } catch (e) {
                console.warn('Could not fetch gallery from Firestore, using local defaults:', e);
            }
        }
        return JSON.parse(localStorage.getItem(STORAGE_DEMO_GALLERY_KEY) || JSON.stringify(DEFAULT_GALLERY));
    }

    async saveGalleryImage(imageObj) {
        const images = await this.getGalleryImages();
        const existingIdx = images.findIndex(img => img.id === imageObj.id);
        if (existingIdx >= 0) {
            images[existingIdx] = { ...images[existingIdx], ...imageObj };
        } else {
            images.unshift(imageObj);
        }

        localStorage.setItem(STORAGE_DEMO_GALLERY_KEY, JSON.stringify(images));

        if (this.isFirebaseReady && this.db) {
            try {
                await this.db.collection('gallery').doc(imageObj.id).set(imageObj, { merge: true });
            } catch (err) {
                console.warn('Firestore gallery update warning:', err);
            }
        }
        return true;
    }

    async deleteGalleryImage(id) {
        let images = await this.getGalleryImages();
        images = images.filter(img => img.id !== id);
        localStorage.setItem(STORAGE_DEMO_GALLERY_KEY, JSON.stringify(images));

        if (this.isFirebaseReady && this.db) {
            try {
                await this.db.collection('gallery').doc(id).delete();
            } catch (err) {
                console.warn('Firestore gallery delete warning:', err);
            }
        }
        return true;
    }

    // -------------------------------------------------------------
    // AUTHENTICATION API
    // -------------------------------------------------------------

    async loginAdmin(email, password) {
        if (this.isFirebaseReady && this.auth) {
            try {
                const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
                return { success: true, user: userCredential.user };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            if ((email === 'admin@glamourstudio.com' && password === 'admin123') || (email && password.length >= 4)) {
                const demoUser = { email: email, uid: 'demo-admin-uid', displayName: 'Salon Manager' };
                localStorage.setItem('glamour_admin_logged_in', 'true');
                localStorage.setItem('glamour_admin_user', JSON.stringify(demoUser));
                return { success: true, user: demoUser, isDemo: true };
            } else {
                return { success: false, error: 'Invalid email or password.' };
            }
        }
    }

    async logoutAdmin() {
        localStorage.removeItem('glamour_admin_logged_in');
        localStorage.removeItem('glamour_admin_user');
        if (this.isFirebaseReady && this.auth) {
            try {
                await this.auth.signOut();
            } catch (e) {}
        }
        return true;
    }

    getCurrentUser() {
        if (this.isFirebaseReady && this.auth && this.auth.currentUser) {
            return this.auth.currentUser;
        }
        const loggedIn = localStorage.getItem('glamour_admin_logged_in') === 'true';
        if (loggedIn) {
            return JSON.parse(localStorage.getItem('glamour_admin_user') || '{"email":"admin@glamourstudio.com"}');
        }
        return null;
    }
}

// Global instance
window.SalonFirebase = new SalonFirebaseManager();
