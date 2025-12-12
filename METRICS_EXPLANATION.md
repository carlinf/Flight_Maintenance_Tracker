# Dashboard Metrics Explanation

## How Dashboard Statistics Work

The dashboard calculates statistics in real-time from your Firebase Firestore database. Here's how each metric works:

### 1. **Total Flights**
- **Calculation**: Counts all flight records in the `flights` collection
- **Data Source**: `flights` collection in Firestore
- **Formula**: `flights.length`

### 2. **Active Flights**
- **Calculation**: Counts flights with status "On Time" or "In Service"
- **Data Source**: `flights` collection
- **Formula**: `flights.filter(f => f.status === 'On Time' || f.status === 'In Service').length`
- **Meaning**: Shows how many flights are currently operating normally

### 3. **Maintenance Due** ⚠️
- **Calculation**: Counts maintenance schedules with status:
  - "Scheduled" - Maintenance is planned but not started
  - "Pending" - Maintenance is waiting to be scheduled
  - "In Progress" - Maintenance is currently being performed
- **Data Source**: `maintenance` collection in Firestore
- **Formula**: `maintenance.filter(m => m.status === 'Scheduled' || m.status === 'Pending' || m.status === 'In Progress').length`
- **Meaning**: Shows how many maintenance tasks need attention or are currently being worked on
- **When it increases**: When you add new maintenance schedules or mark maintenance as "Pending"
- **When it decreases**: When maintenance is marked as "Completed"

### 4. **Aircraft Available** ✈️
- **Calculation**: Counts aircraft with status:
  - "Available" - Aircraft is ready and available for flights
  - "In Service" - Aircraft is currently being used for flights
- **Data Source**: `aircraft` collection in Firestore
- **Formula**: `aircraft.filter(a => a.status === 'Available' || a.status === 'In Service').length`
- **Meaning**: Shows how many aircraft are ready or currently in use
- **Excludes**: Aircraft with status "In Maintenance" or "Out of Service"

## Data Flow

```
Firebase Firestore
    ↓
statsService.js (getDashboardStats)
    ↓
Dashboard Component
    ↓
Display on Dashboard
```

## Real-Time Updates

All metrics update automatically when:
- New flights are added to Firestore
- Flight status changes
- Maintenance schedules are added or updated
- Aircraft status changes

The dashboard uses Firebase real-time listeners (`onSnapshot`) to automatically refresh when data changes.

## Example Scenarios

### Scenario 1: Adding a Flight
- **Total Flights**: Increases by 1
- **Active Flights**: Increases by 1 (if status is "On Time")
- **Aircraft Available**: No change (unless aircraft status changes)

### Scenario 2: Scheduling Maintenance
- **Maintenance Due**: Increases by 1
- **Aircraft Available**: May decrease if aircraft status changes to "In Maintenance"

### Scenario 3: Completing Maintenance
- **Maintenance Due**: Decreases by 1
- **Aircraft Available**: May increase if aircraft becomes "Available"

## Customization

You can modify the calculation logic in `src/firebase/services/statsService.js` to:
- Change which statuses count for each metric
- Add date-based filtering (e.g., maintenance due in next 7 days)
- Add additional filters or conditions

