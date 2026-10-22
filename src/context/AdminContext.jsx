import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_STUDENTS,
  INITIAL_BUILDINGS,
  INITIAL_EVENTS,
  INITIAL_NOTICES,
  INITIAL_BROADCASTS,
  INITIAL_FACILITIES,
  INITIAL_CAMPUS_ROUTES,
  INITIAL_VISITOR_REQUESTS,
  INITIAL_COMPLAINTS_MONITORING,
} from '../services/adminData';
import { ALL_FACULTY_MEMBERS } from '../services/facultyData';

const AdminContext = createContext();

const getInitialState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`admin_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (err) {
    return fallback;
  }
};

const sanitizeStudents = (rawStudents) => {
  const oldNames = ['Alex Vance', 'Samantha Reed', 'David Miller', 'Priya Sharma', 'Rohan Gupta', 'Gajal'];
  const cleaned = (rawStudents || [])
    .filter(s => s && s.name && !oldNames.includes(s.name) && s.name.toLowerCase() !== 'jsdbk')
    .map(s => ({
      ...s,
      name: s.name.replace(/\.$/, '').trim()
    }));
  if (cleaned.length === 0) {
    return INITIAL_STUDENTS;
  }
  return cleaned;
};

const sanitizeFaculty = (rawFaculty) => {
  const cleaned = (rawFaculty || []).filter(f => f && f.name && f.name.toLowerCase() !== 'jsdbk');
  if (cleaned.length === 0) return ALL_FACULTY_MEMBERS;
  return cleaned.map(f => ({
    ...f,
    office_location: (!f.office_location || f.office_location.toLowerCase().includes('jsdbk'))
      ? 'Sunflower Block, Room SF-303'
      : f.office_location
  }));
};

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('admin_users');
    if (saved) return JSON.parse(saved);
    return INITIAL_ADMIN_USERS.map((user) => ({
      ...user,
      status: user.status === 'Active' ? 'approved' : 'pending',
      approved_by: 'system',
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    }));
  });
  const [students, setStudents] = useState(() => sanitizeStudents(getInitialState('students', INITIAL_STUDENTS)));
  const [faculty, setFaculty] = useState(() => sanitizeFaculty(getInitialState('faculty', ALL_FACULTY_MEMBERS)));
  const [buildings, setBuildings] = useState(() => getInitialState('buildings', INITIAL_BUILDINGS));
  const [events, setEvents] = useState(() => getInitialState('events', INITIAL_EVENTS));
  const [notices, setNotices] = useState(() => getInitialState('notices', INITIAL_NOTICES));
  const [broadcasts, setBroadcasts] = useState(() => getInitialState('broadcasts', INITIAL_BROADCASTS));
  const [facilities, setFacilities] = useState(() => getInitialState('facilities', INITIAL_FACILITIES));
  const [routes, setRoutes] = useState(() => getInitialState('routes', INITIAL_CAMPUS_ROUTES));
  const [visitors, setVisitors] = useState(() => getInitialState('visitors', INITIAL_VISITOR_REQUESTS));
  const [complaints, setComplaints] = useState(() => getInitialState('complaints', INITIAL_COMPLAINTS_MONITORING));

  // Sync state to LocalStorage
  useEffect(() => { localStorage.setItem('admin_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('admin_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('admin_faculty', JSON.stringify(faculty)); }, [faculty]);
  useEffect(() => { localStorage.setItem('admin_buildings', JSON.stringify(buildings)); }, [buildings]);
  useEffect(() => { localStorage.setItem('admin_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('admin_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('admin_broadcasts', JSON.stringify(broadcasts)); }, [broadcasts]);
  useEffect(() => { localStorage.setItem('admin_facilities', JSON.stringify(facilities)); }, [facilities]);
  useEffect(() => { localStorage.setItem('admin_routes', JSON.stringify(routes)); }, [routes]);
  useEffect(() => { localStorage.setItem('admin_visitors', JSON.stringify(visitors)); }, [visitors]);
  useEffect(() => { localStorage.setItem('admin_complaints', JSON.stringify(complaints)); }, [complaints]);

  // Hook up mock db initialization and storage change listener
  useEffect(() => {
    const initDb = async () => {
      const { initializeMockDatabase } = await import('../services/authService');
      const initialized = await initializeMockDatabase();
      setUsers(initialized);
    };
    initDb();

    const handleStorageChange = () => {
      const latestUsers = localStorage.getItem('admin_users');
      if (latestUsers) {
        setUsers(JSON.parse(latestUsers));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // User Management
  const addUser = (userData, creatorAdminId = 'usr_adm_1') => {
    const newUser = {
      id: `usr_${userData.role.substring(0, 3)}_${Math.floor(Math.random() * 900 + 100)}`,
      ...userData,
      status: 'approved',
      approved_by: creatorAdminId,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
      created_at: new Date().toISOString().split('T')[0]
    };
    setUsers((prev) => [newUser, ...prev]);

    if (userData.role === 'faculty') {
      const newFaculty = {
        id: `FAC-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: userData.name,
        email: userData.email,
        department: userData.department,
        designation: userData.designation || 'Assistant Professor',
        office_location: userData.office || 'Sunflower Block SF-201',
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
        busySlots: ['09:00 AM - 10:00 AM'],
        freeSlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM']
      };
      setFaculty((prev) => [newFaculty, ...prev]);
    } else if (userData.role === 'student') {
      const newStudent = {
        id: `ST-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: userData.name,
        email: userData.email,
        department: userData.department,
        year: userData.year || 'III',
        section: userData.section || 'A',
        phone: userData.phone || '+91 99001 98765',
        status: 'Active'
      };
      setStudents((prev) => [newStudent, ...prev]);
    }

    return newUser;
  };

  const approveUser = (userId, adminId = 'usr_adm_1') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'approved',
            approved_by: adminId,
            approved_at: new Date().toISOString(),
            rejection_reason: null
          };
        }
        return u;
      })
    );
  };

  const rejectUser = (userId, reason = '') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'rejected',
            rejection_reason: reason,
            approved_by: null,
            approved_at: null
          };
        }
        return u;
      })
    );
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' || u.status === 'approved' ? 'Deactivated' : 'Active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Operations: Events, Notices & Broadcast Notifications
  const addEvent = (eventData) => {
    const newEvt = {
      id: Date.now(),
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      venue: eventData.venue,
      audience: eventData.audience
    };
    setEvents((prev) => [newEvt, ...prev]);
  };

  const addNotice = (noticeData) => {
    const newNotice = {
      id: Date.now(),
      title: noticeData.title,
      priority: noticeData.priority,
      target: noticeData.target,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const addBroadcastNotification = (broadcastData) => {
    const newBcast = {
      id: Date.now(),
      role: broadcastData.role,
      title: broadcastData.title,
      message: broadcastData.message,
      timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    setBroadcasts((prev) => [newBcast, ...prev]);
  };

  // Route Management & Path Blocking
  const toggleRouteBlockedStatus = (routeId, blockReason = '') => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const isCurrentlyBlocked = r.status === 'BLOCKED';
          const nextStatus = isCurrentlyBlocked ? 'Active' : 'BLOCKED';
          return {
            ...r,
            status: nextStatus,
            blockReason: nextStatus === 'BLOCKED' ? blockReason || 'Maintenance in progress. Follow detour.' : ''
          };
        }
        return r;
      })
    );
  };

  // Visitor Request Approval / Rejection
  const updateVisitorStatus = (visitorId, newStatus) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === visitorId) {
          return { ...v, approvalStatus: newStatus };
        }
        return v;
      })
    );
  };

  // Complaint & Issue Status Monitoring
  const updateComplaintStatus = (complaintId, newStatus, assignedTech = '') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: newStatus,
            assignedTo: assignedTech || c.assignedTo
          };
        }
        return c;
      })
    );
  };

  // Facility Management
  const addFacility = (facilData) => {
    const newFacil = {
      id: `FACIL-${Math.floor(Math.random() * 900 + 100)}`,
      availability: 'Available',
      ...facilData
    };
    setFacilities((prev) => [newFacil, ...prev]);
  };

  // Operational metrics
  const metrics = {
    totalStudents: 4250 + (students.length - INITIAL_STUDENTS.length),
    totalFaculty: faculty.length,
    totalBuildings: buildings.length,
    totalFacilities: facilities.length,
    pendingVisitors: visitors.filter((v) => v.approvalStatus === 'Pending').length,
    activeComplaints: complaints.filter((c) => c.status !== 'Completed').length
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        students,
        faculty,
        buildings,
        events,
        notices,
        broadcasts,
        facilities,
        routes,
        visitors,
        complaints,
        metrics,
        addUser,
        approveUser,
        rejectUser,
        toggleUserStatus,
        addEvent,
        addNotice,
        addBroadcastNotification,
        toggleRouteBlockedStatus,
        updateVisitorStatus,
        updateComplaintStatus,
        addFacility,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
