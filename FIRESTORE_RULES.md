# Firestore Security Rules Setup

## Quick Fix for Development

To allow adding flights, you need to update your Firestore security rules. Here's how:

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **aircraft-maintenance-bc999**
3. Click **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

### Step 2: Update Security Rules

Copy and paste these rules into the Rules editor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Flights collection
    match /flights/{flightId} {
      allow read: if true;
      allow write: if true; // Allow all writes for development
    }
    
    // Maintenance collection
    match /maintenance/{maintenanceId} {
      allow read: if true;
      allow write: if true; // Allow all writes for development
    }
    
    // Aircraft collection
    match /aircraft/{aircraftId} {
      allow read: if true;
      allow write: if true; // Allow all writes for development
    }
  }
}
```

### Step 3: Publish Rules
1. Click **Publish** button
2. Wait for confirmation that rules are published

### Step 4: Test Again
Try adding a flight record again. It should work now!

## Important Notes

⚠️ **Security Warning**: These rules allow anyone to read and write to your database. This is fine for development, but for production you should:

1. Implement Firebase Authentication
2. Add proper user-based rules
3. Validate data structure
4. Add rate limiting

### Production-Ready Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Flights collection
    match /flights/{flightId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                       request.resource.data.keys().hasAll(['flightNumber', 'aircraft', 'route']);
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // Maintenance collection
    match /maintenance/{maintenanceId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Aircraft collection
    match /aircraft/{aircraftId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}
```


