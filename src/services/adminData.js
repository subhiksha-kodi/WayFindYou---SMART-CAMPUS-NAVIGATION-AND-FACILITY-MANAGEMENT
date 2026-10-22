// Current admin portal data for users, campus operations, facilities, events, and notices.

export const INITIAL_ADMIN_USERS = [
  { id: 'usr_adm_1', name: 'Dean', email: 'dean@campus.edu', phone: '+91 98400 11223', role: 'admin', department: 'Office of the Dean', status: 'Active', created_at: '2025-01-10' },
  { id: 'usr_fac_1', name: 'Dr. Hariharan', email: 'hariharan@campus.edu', phone: '+91 98450 23456', role: 'faculty', department: 'Computer Science & Eng', status: 'Active', created_at: '2025-02-15' },
  { id: 'usr_fac_2', name: 'Dr. Rishitha', email: 'rishitha@campus.edu', phone: '+91 98450 34567', role: 'faculty', department: 'Computer Science & Eng', status: 'Active', created_at: '2025-03-01' },
  { id: 'usr_std_1', name: 'Hariharan S', email: 'hariharan.std@campus.edu', phone: '+91 99001 88901', role: 'student', department: 'Computer Science & Eng', status: 'Active', created_at: '2025-08-01' },
  { id: 'usr_vis_1', name: 'Sanjana P (Parent)', email: 'sanjana.parent@gmail.com', phone: '+91 99001 01928', role: 'visitor', department: 'Guest / Parent', status: 'Active', created_at: '2026-07-31' }
];

export const INITIAL_STUDENTS = [
  { id: 'CS-2024-089', name: 'Hariharan S', department: 'CSE', email: 'hariharan.std@campus.edu', phone: '+91 99001 88901', status: 'Active' },
  { id: 'IT-2024-042', name: 'Rishitha M', department: 'IT', email: 'rishitha.std@campus.edu', phone: '+91 99001 99012', status: 'Active' },
  { id: 'CS-2024-104', name: 'Akalya K', department: 'CSE', email: 'akalya.std@campus.edu', phone: '+91 99001 11223', status: 'Active' },
  { id: 'EC-2024-019', name: 'Jeswin R', department: 'ECE', email: 'jeswin.std@campus.edu', phone: '+91 99001 22334', status: 'Active' }
];

export const INITIAL_BUILDINGS = [
  { id: 'BLD-AS', name: 'AS Block', code: 'AS', description: 'Administrative offices and campus services', floors: 4, contact: 'Dean Office', openTime: '07:00 AM', closeTime: '10:00 PM', lat: 12.9725, lng: 77.5955, status: 'Active' },
  { id: 'BLD-IB', name: 'IB Block', code: 'IB', description: 'International services and auditorium', floors: 4, contact: 'International Cell', openTime: '08:00 AM', closeTime: '09:30 PM', lat: 12.9718, lng: 77.5950, status: 'Active' },
  { id: 'BLD-SF', name: 'Sunflower Block', code: 'SF', description: 'Campus services and facilities', floors: 4, contact: 'Campus Operations', openTime: '07:30 AM', closeTime: '09:00 PM', lat: 12.9716, lng: 77.5946, status: 'Active' },
  { id: 'BLD-MB', name: 'Mechanical Block', code: 'MB', description: 'Campus facilities and support services', floors: 3, contact: 'Campus Operations', openTime: '08:00 AM', closeTime: '08:00 PM', lat: 12.9720, lng: 77.5962, status: 'Active' },
  { id: 'BLD-RP', name: 'Research Park', code: 'RP', description: 'Research and innovation hub', floors: 5, contact: 'Research Cell', openTime: '07:00 AM', closeTime: '11:00 PM', lat: 12.9730, lng: 77.5970, status: 'Active' }
];

export const INITIAL_EVENTS = [
  { id: 1, title: 'Annual Campus Science & Tech Symposium', date: '2026-08-15', time: '09:30 AM', venue: 'IB Block Auditorium', audience: 'Everyone' },
  { id: 2, title: 'Campus Innovation Workshop', date: '2026-08-10', time: '02:00 PM', venue: 'AS Block Seminar Hall', audience: 'Everyone' },
  { id: 3, title: 'Student Community Meetup', date: '2026-08-05', time: '11:00 AM', venue: 'Sunflower Block', audience: 'Students' }
];

export const INITIAL_NOTICES = [
  { id: 1, title: 'Urgent Maintenance Shutdown Near Mechanical Block', priority: 'Urgent', target: 'Everyone', date: '2026-07-31' },
  { id: 2, title: 'Campus Operations Update', priority: 'Important', target: 'Everyone', date: '2026-07-30' },
  { id: 3, title: 'Library Extended Hours', priority: 'Normal', target: 'Everyone', date: '2026-07-28' }
];

export const INITIAL_BROADCASTS = [
  { id: 1, role: 'Everyone', title: 'Campus Security Alert', message: 'Roadwork underway near North Gate entrance.', timestamp: '2026-07-31 08:30 AM' }
];

export const INITIAL_FACILITIES = [
  { id: 'FACIL-101', name: 'Central Printer Station', category: 'Printer', building: 'Sunflower Block', floor: 2, room: 'SF-201', hours: '08:00 AM - 08:00 PM', availability: 'Available', lat: 12.9716, lng: 77.5946 },
  { id: 'FACIL-102', name: 'High-Speed Wi-Fi Hub', category: 'Wi-Fi', building: 'AS Block', floor: 3, room: 'AS-305', hours: '24 Hours', availability: 'Available', lat: 12.9725, lng: 77.5955 },
  { id: 'FACIL-103', name: 'Drinking Water Dispenser', category: 'Drinking Water', building: 'Mechanical Block', floor: 1, room: 'MB-102', hours: '24 Hours', availability: 'Available', lat: 12.9720, lng: 77.5962 },
  { id: 'FACIL-104', name: 'Campus ATM', category: 'ATM', building: 'AS Block', floor: 1, room: 'Main Foyer', hours: '24 Hours', availability: 'Available', lat: 12.9725, lng: 77.5955 },
  { id: 'FACIL-105', name: 'Passenger Lift', category: 'Lift', building: 'Sunflower Block', floor: 1, room: 'Elevator Shaft B', hours: '07:00 AM - 10:00 PM', availability: 'Available', lat: 12.9716, lng: 77.5946 },
  { id: 'FACIL-106', name: 'Main Campus Cafeteria', category: 'Cafeteria', building: 'IB Block', floor: 1, room: 'Ground Dining', hours: '07:30 AM - 09:00 PM', availability: 'Available', lat: 12.9718, lng: 77.5950 }
];

export const INITIAL_CAMPUS_ROUTES = [
  { id: 'RTE-101', startLocation: 'Main Gate Entrance', destination: 'Sunflower Block', distance: '180m', estTime: '2 min', pathType: 'Pedestrian Walkway', accessible: true, stairs: false, lift: true, status: 'Active' },
  { id: 'RTE-102', startLocation: 'Sunflower Block', destination: 'Mechanical Block', distance: '240m', estTime: '3 min', pathType: 'Covered Corridor', accessible: true, stairs: false, lift: true, status: 'Active' },
  { id: 'RTE-103', startLocation: 'AS Block Foyer', destination: 'IB Block Auditorium', distance: '310m', estTime: '4 min', pathType: 'Central Avenue', accessible: false, stairs: true, lift: false, status: 'BLOCKED', blockReason: 'Pavement resurfacing work in progress.' }
];

export const INITIAL_VISITOR_REQUESTS = [
  { id: 'VIS-88392', visitorName: 'Sarah Jenkins', contact: '+1 (555) 019-2831', host: 'Campus Operations', purpose: 'Campus visit', visitDate: '2026-07-31', entryStatus: 'Checked In', exitStatus: 'Pending', approvalStatus: 'Approved' },
  { id: 'VIS-91042', visitorName: 'Michael Chang', contact: '+1 (555) 443-1199', host: 'Campus Operations', purpose: 'Facility inspection', visitDate: '2026-08-01', entryStatus: 'Not Arrived', exitStatus: 'Pending', approvalStatus: 'Pending' },
  { id: 'VIS-77103', visitorName: 'Dr. Aris Thorne', contact: '+1 (555) 778-9900', host: 'Research Cell', purpose: 'Campus visit', visitDate: '2026-08-02', entryStatus: 'Not Arrived', exitStatus: 'Pending', approvalStatus: 'Approved' }
];

export const INITIAL_COMPLAINTS_MONITORING = [
  { id: 'CMP-409', title: 'Projector equipment issue', category: 'Equipment', department: 'IT Support', building: 'Sunflower Block', room: 'SF-303', reportedBy: 'Campus User', reportedDate: '2026-07-30', status: 'Working', assignedTo: 'Technician Rajesh', priority: 'Important' },
  { id: 'CMP-412', title: 'Water leakage near restroom', category: 'Water', department: 'Plumbing & Sanitation', building: 'Mechanical Block', room: 'MB-204 Restroom', reportedBy: 'Campus User', reportedDate: '2026-07-31', status: 'Assigned', assignedTo: 'Plumbing Ops', priority: 'Urgent' },
  { id: 'CMP-398', title: 'Wi-Fi coverage issue', category: 'Internet', department: 'Network Ops', building: 'AS Block', room: 'Floor 3 Corridor', reportedBy: 'Campus User', reportedDate: '2026-07-28', status: 'Completed', assignedTo: 'Network Engineer', priority: 'Normal' }
];
