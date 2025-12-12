# Firebase Setup Guide

This guide will help you set up Firebase for the RwandAir Maintenance Dashboard.

## Prerequisites

1. A Firebase account (sign up at https://firebase.google.com)
2. A Firebase project created in the Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Start in production mode** (for production)
4. Select a location for your database
5. Click **Enable**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "RwandAir Dashboard")
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Step 5: Set Up Firestore Collections

The dashboard uses the following Firestore collections:

- `flights` - Flight records
- `maintenance` - Maintenance schedules
- `aircraft` - Aircraft status information

### Collection Structure

#### `flights` Collection
```javascript
{
  flightNumber: "WB101",
  aircraft: "Boeing 737-800",
  route: "KGL → DXB",
  status: "On Time", // "On Time", "Delayed", "Cancelled"
  maintenanceStatus: "Good", // "Good", "Due Soon", "Maintenance Required"
  nextMaintenance: "2024-02-01",
  hours: 1250,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

#### `maintenance` Collection
```javascript
{
  aircraft: "Boeing 737-800",
  tailNumber: "9XR-WBA",
  type: "Routine Check", // "Routine Check", "Engine Inspection", "Annual Service", etc.
  scheduledDate: "2024-01-25",
  estimatedDuration: "4 hours",
  priority: "Medium", // "High", "Medium", "Low"
  status: "Scheduled", // "Scheduled", "In Progress", "Completed", "Pending"
  technician: "Jean Baptiste",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

#### `aircraft` Collection
```javascript
{
  tailNumber: "9XR-WBA",
  model: "Boeing 737-800",
  status: "In Service", // "In Service", "In Maintenance", "Available", "Out of Service"
  location: "Kigali International Airport",
  flightHours: 1250,
  lastMaintenance: "2024-01-10",
  nextMaintenance: "2024-02-01",
  healthScore: 95, // 0-100
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

## Step 6: Set Up Firestore Security Rules

Go to **Firestore Database** > **Rules** and update with appropriate rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Flights collection
    match /flights/{flightId} {
      allow read: if true; // Allow read for all (adjust based on your needs)
      allow write: if request.auth != null; // Require authentication for writes
    }
    
    // Maintenance collection
    match /maintenance/{maintenanceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Aircraft collection
    match /aircraft/{aircraftId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Note:** For production, implement proper authentication and more restrictive rules.

## Step 7: Add Sample Data (Optional)

You can manually add sample data through the Firebase Console, or use the sample data scripts provided in the project.

## Step 8: Run the Application

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The dashboard should now connect to Firebase and display data from your Firestore database.

## Troubleshooting

### Connection Issues
- Verify your `.env` file has the correct Firebase configuration
- Check that Firestore is enabled in your Firebase project
- Ensure your Firestore security rules allow read access

### Data Not Showing
- Check the browser console for errors
- Verify that collections exist in Firestore
- Ensure collection names match exactly: `flights`, `maintenance`, `aircraft`

### Real-time Updates Not Working
- Check that `onSnapshot` is properly set up in the service files
- Verify Firestore security rules allow read access
- Check browser console for permission errors

## Next Steps

- Set up Firebase Authentication for user management
- Implement proper security rules for production
- Add data validation and error handling
- Set up Firebase Cloud Functions for automated tasks


