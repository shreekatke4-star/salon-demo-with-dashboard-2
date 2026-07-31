# Glamour Studio — Salon Website & Admin Dashboard 💇‍♀️

A premium, responsive salon website & real-time **Admin Dashboard** powered by **HTML**, **Tailwind CSS**, **Vanilla JavaScript**, and **Firebase (Firestore & Auth)**.

---

## ✨ Main Features

### 🌐 Client Website (`index.html`)
- Responsive premium design (mobile & desktop)
- Live online booking form connected directly to **Firebase Firestore**
- Service pricing modals & WhatsApp instant contact buttons
- Before & After hair and makeup comparison sliders
- Lightbox gallery, FAQ accordion, and Google Maps embed

### 📊 Admin Dashboard (`admin.html`)
- **Admin Authentication**: Firebase Auth or 1-Click Demo Login (`admin@glamourstudio.com` / `admin123`)
- **Live Real-time Appointments**: `onSnapshot` Firestore live stream for incoming customer bookings
- **Appointment Lifecycle**: Change status (`Pending` ➔ `Confirmed` ➔ `Completed` ➔ `Cancelled`)
- **Instant WhatsApp Dispatcher**: Pre-formatted booking confirmation text directly sent to clients
- **Walk-in Booking Modal**: Quickly record offline or phone appointments
- **Services & Price Manager**: Update service prices, duration, and categories on the fly
- **Client CRM Directory**: Central contact list with visit counters and history
- **Revenue Analytics**: Interactive Chart.js graphs tracking revenue & service popularities
- **Built-in Firebase Config Tool**: Input custom Firebase keys directly inside the Admin interface without modifying code!

---

## 📁 Project Structure

```
salon-website/
├── index.html          ← Client-facing main website
├── admin.html          ← Salon Admin Dashboard
├── firebase-config.js  ← Firebase SDK & LocalStorage fallback manager
└── README.md
```

---

## 🚀 How to Run & Access

1. Open `index.html` in any modern web browser to view the client website and submit bookings.
2. Click **Admin Portal** in the top navigation bar or navigate directly to `admin.html`.
3. Login using Demo Credentials:
   - **Email**: `admin@glamourstudio.com`
   - **Password**: `admin123`

---

## 🔥 Setting Up Live Firebase Firestore

To connect your own live Firebase database:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a free project.
2. Enable **Firestore Database** in test mode or production mode.
3. Enable **Authentication** (Email/Password sign-in provider).
4. Register a Web App in Firebase Console and copy your web app config object:
   ```json
   {
     "apiKey": "AIzaSy...",
     "authDomain": "your-project.firebaseapp.com",
     "projectId": "your-project-id",
     "storageBucket": "your-project.appspot.com",
     "appId": "1:123456789:web:..."
   }
   ```
5. Open `admin.html` ➔ Click **Firebase Settings** in the sidebar ➔ Paste your API keys and click **Save & Connect Firebase**.

Your salon website and Admin Dashboard will now sync live across all devices! 🚀
