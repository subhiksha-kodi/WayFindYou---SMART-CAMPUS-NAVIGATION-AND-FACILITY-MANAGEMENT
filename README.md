# WayFindYou

**Smart Campus Navigation and Facility Locator**
**Bannari Amman Institute of Technology, Sathyamangalam**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)

> Developed by **Team Velmora**

## Overview

WayFindYou is a React-based campus navigation and facility-management application. It helps students, faculty, visitors, and administrators find campus locations, explore interactive building maps, discover facilities, share notices and events, manage complaints, and respond to emergencies.

The current application focuses on campus operations and navigation. Academic scheduling, classroom allocation, subject management, attendance, faculty substitution, room booking, analytics, reports, audit logs, and system settings are not part of the active application.

## Current Features

### Campus navigation

- Leaflet-based campus map with building markers
- Facility locator for campus services
- Route and campus map management for administrators
- Interactive 3D views for the AS, IB, and SF blocks
- Voice-assisted navigation and text-to-speech directions

### Student portal

- Student dashboard with campus-service shortcuts
- Combined notices, updates, and campus events page
- Combined complaint submission and complaint history page
- Cafeteria information and token-related services
- Feedback and notifications
- Student profile and preferences
- Emergency SOS with camera, microphone, recording, and location support

### Faculty portal

- Faculty dashboard
- Campus map and facility navigation
- Notices and campus events
- Facility and operational notifications
- Faculty profile

### Admin portal

- Operational dashboard
- User, student, and faculty management
- Facility management
- Campus map and route management
- Events and notices management
- Visitor management
- Notifications
- Complaint monitoring
- Feedback review
- SOS monitoring and emergency operations
- Administrator profile

### Visitor services

- Visitor registration
- Visit requests and digital pass support
- Campus navigation guidance
- Facility discovery
- Campus alerts

## Application Routes

| Area | Main routes |
|------|-------------|
| Public | `/`, `/login`, `/register`, `/forgot-password`, `/map`, `/facilities`, `/voice-navigation` |
| Student | `/student/dashboard`, `/student/notices`, `/student/complaints`, `/student/cafeteria`, `/student/feedback`, `/student/notifications`, `/student/emergency` |
| Faculty | `/faculty/dashboard`, `/faculty/map`, `/faculty/notices`, `/faculty/events`, `/faculty/notifications`, `/faculty/profile` |
| Admin | `/admin/dashboard`, `/admin/users`, `/admin/students`, `/admin/faculty`, `/admin/facilities`, `/admin/map`, `/admin/routes`, `/admin/events`, `/admin/notices`, `/admin/visitors`, `/admin/notifications`, `/admin/complaints`, `/admin/feedback`, `/admin/operations` |
| Visitor | `/visitors` |
| 3D building views | `/as`, `/ib`, `/sf` |

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 |
| Styling | Tailwind CSS |
| Maps | Leaflet, React-Leaflet, OpenStreetMap |
| Routing service | OSRM API |
| 3D navigation | Three.js, React Three Fiber, Drei |
| Voice navigation | Web Speech API |
| Emergency recording | MediaRecorder API |
| Icons | Lucide React |
| State management | React Context API |
| Local data | LocalStorage and JSON data stores |

## Project Structure

```text
.
├── public/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── faculty/
│   │   ├── layout/
│   │   └── navigation/
│   ├── context/
│   │   ├── AdminContext.jsx
│   │   ├── RoleContext.jsx
│   │   └── StudentContext.jsx
│   ├── data/
│   ├── pages/
│   │   ├── admin/
│   │   ├── faculty/
│   │   └── student/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── docs/
├── package.json
├── vite.config.js
└── README.md
```

## Setup and Installation

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- A modern browser such as Chrome or Edge

### Clone the repository

```bash
git clone https://github.com/subhiksha-kodi/WayFindYou---SMART-CAMPUS-NAVIGATION-AND-FACILITY-MANAGEMENT.git
cd WayFindYou---SMART-CAMPUS-NAVIGATION-AND-FACILITY-MANAGEMENT
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app is normally available at `http://127.0.0.1:3000/`.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Demo Accounts

All demo accounts use the password `password123`.

| Role | Email | Password |
|------|-------|----------|
| Student | `hariharan.std@campus.edu` | `password123` |
| Faculty | `hariharan@campus.edu` | `password123` |
| Admin | `dean@campus.edu` | `password123` |
| Visitor | `sanjana.parent@gmail.com` | `password123` |

Open `/login`, select the required portal role, and sign in. The demo credentials are populated automatically when a role is selected.

## Emergency SOS

The student emergency flow supports:

1. Starting an SOS request from the student portal.
2. Requesting browser camera and microphone access.
3. Recording an emergency video with the MediaRecorder API.
4. Capturing the available location and emergency details.
5. Sending the alert to the administrative emergency-monitoring view.

Browser permissions must be granted for camera, microphone, and location features to work.

## Documentation

| Document | Link |
|----------|------|
| App flowchart | [docs/flowchart.png](docs/flowchart.png) |
| Team details | [TEAM.md](TEAM.md) |
| Software requirements | [Software Requirements Specification (SRS).docx](Software%20Requirements%20Specification%20(SRS).docx) |

## Team Velmora

| Role | Name |
|------|------|
| Team Leader | **Sharmila M** |
| Member | **Tabitha Merin Clitus** |
| Member | **Subhiksha Kodibass** |

See [TEAM.md](TEAM.md) for the complete contribution details.

---

Made with care by **Team Velmora** at Bannari Amman Institute of Technology.
