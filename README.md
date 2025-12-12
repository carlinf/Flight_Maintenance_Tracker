# Ethiopian Airlines Maintenance Dashboard

A modern, responsive flight maintenance dashboard built with React.js and Vite, specifically designed for Ethiopian Airlines. This dashboard provides comprehensive tools for managing flight operations, maintenance schedules, and aircraft status for Ethiopian Airlines fleet.

## Features

- **Dashboard Overview**: Key metrics and statistics for Ethiopian Airlines operations
- **Flight Management**: View and filter Ethiopian Airlines flights (ET-XXX) with maintenance status
- **Maintenance Schedule**: Track scheduled maintenance activities for Ethiopian Airlines fleet
- **Aircraft Status**: Monitor aircraft health and availability for all Ethiopian Airlines aircraft

## Ethiopian Airlines Fleet

The dashboard supports Ethiopian Airlines' current fleet:
- **Wide-Body**: Airbus A350-900, Boeing 787-8, Boeing 777-300ER
- **Narrow-Body**: Boeing 737-800, Boeing 737 MAX 8
- **Regional**: Bombardier Q400, De Havilland Dash 8
- **Cargo**: Boeing 777F, Boeing 737-800F

## Routes

Sample routes include Ethiopian Airlines destinations:
- Addis Ababa (ADD) hub connections
- International: Dubai (DXB), London (LHR), Brussels (BRU), Paris (CDG), Cairo (CAI)
- Regional: Nairobi (NBO), Johannesburg (JNB), Entebbe (EBB), Khartoum (KRT)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard overview
│   ├── FlightList.jsx         # Flight management table
│   ├── MaintenanceSchedule.jsx # Maintenance scheduling
│   ├── AircraftStatus.jsx     # Aircraft status cards
│   └── RwandAirLogo.jsx       # RwandAir logo component
├── firebase/
│   ├── config.js              # Firebase configuration
│   └── services/
│       ├── flightsService.js      # Flight data operations
│       ├── maintenanceService.js # Maintenance data operations
│       ├── aircraftService.js    # Aircraft data operations
│       └── statsService.js       # Dashboard statistics
├── utils/
│   └── seedData.js            # Sample data seeding utility
├── App.jsx                     # Main app component with navigation
├── App.css                     # Global app styles
└── main.jsx                    # Entry point
```

## Firebase Integration

This dashboard is integrated with Firebase Firestore for data storage. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions.

### Quick Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy `.env.example` to `.env` and add your Firebase configuration
4. The dashboard will automatically connect to Firebase and display data in real-time

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Firebase Firestore** - Real-time database
- **CSS3** - Styling with modern features

## Features Overview

### Dashboard
- Real-time statistics cards (powered by Firebase)
- Recent maintenance activities
- Quick action buttons
- Live data updates from Firestore

### Flight List
- Filterable flight table (real-time Firebase data)
- Maintenance status indicators
- Flight hours tracking
- Next service dates
- Live updates when data changes

### Maintenance Schedule
- Filter by maintenance type (real-time Firebase data)
- Priority indicators
- Technician assignments
- Status tracking
- Live updates when schedules change

### Aircraft Status
- Health score visualization (real-time Firebase data)
- Location tracking
- Maintenance history
- Quick actions
- Live updates when aircraft status changes

## Customization

The dashboard uses a modern color scheme with a purple gradient theme. You can customize colors by modifying the CSS variables and gradient values in the component CSS files.

## License

MIT
# Flight_Maintenance_Tracker
