// Faculty Module Data Models & Mock Data Services

export const INITIAL_FACULTY_PROFILE = {
  id: 'fac_101',
  faculty_id: 'FAC-9402',
  name: 'Dr. K. Arunkumar',
  department: 'Department of Computer Science & Engineering',
  designation: 'Associate Professor',
  email: 'arunkumar@campus.edu',
  phone: '+91 98450 23456',
  specialization: 'Database Systems & Operating Systems',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  office_location: 'Mechanical Block, Room MB-204',
  building: 'Mechanical Block',
  floor: 2,
  room: 'MB-204',
  coordinates: { lat: 12.9718, lng: 77.5950 }
};

export const FACULTY_EVENTS = [
  {
    id: 'evt_1',
    title: 'CSE Department Faculty Meeting',
    event_type: 'Department Meeting',
    date: '2026-07-31',
    start_time: '03:00 PM',
    end_time: '04:30 PM',
    venue: 'AS Block Auditorium',
    building: 'AS Block',
    floor: 2,
    room: 'AS-202',
    organizer: 'HOD Computer Science',
    description: 'Quarterly review of syllabus progress, accreditation documents, and lab infrastructure.',
    lat: 12.9720,
    lng: 77.5962
  },
  {
    id: 'evt_2',
    title: 'National AI & Cloud Computing Workshop',
    event_type: 'Workshop',
    date: '2026-08-05',
    start_time: '09:30 AM',
    end_time: '04:00 PM',
    venue: 'IB Block Seminar Hall',
    building: 'IB Block',
    floor: 1,
    room: 'IB-Auditorium',
    organizer: 'Research & Development Cell',
    description: 'Hands-on faculty development workshop on distributed computing and cloud virtualization.',
    lat: 12.9716,
    lng: 77.5946
  },
  {
    id: 'evt_3',
    title: 'Academic Committee Curriculum Review',
    event_type: 'Faculty Meeting',
    date: '2026-08-08',
    start_time: '11:00 AM',
    end_time: '01:00 PM',
    venue: 'Mechanical Block Conference Room',
    building: 'Mechanical Block',
    floor: 3,
    room: 'MB-301',
    organizer: 'Dean of Academic Affairs',
    description: 'Reviewing 2026-2027 curriculum changes and elective offerings.',
    lat: 12.9720,
    lng: 77.5962
  }
];

export const FACULTY_NOTICES = [
  {
    id: 'not_1',
    title: 'URGENT: Mid-Semester Exam Question Paper Submission Deadline',
    category: 'Academic',
    priority: 'High',
    posted_by: 'Office of Controller of Examinations',
    date: '2026-07-30',
    time: '04:00 PM',
    description: 'CRITICAL NOTICE: All faculty members must submit encrypted question paper sets to the exam cell by August 5th without delay.'
  },
  {
    id: 'not_2',
    title: 'Department Research Grant Applications Open',
    category: 'Department',
    priority: 'Normal',
    posted_by: 'Dean R&D',
    date: '2026-07-28',
    time: '11:30 AM',
    description: 'Proposals for internal campus research seed grants up to $10,000 are now open for faculty submission.'
  },
  {
    id: 'not_3',
    title: 'HIGH PRIORITY: Emergency CSE Faculty Meeting at AS Block',
    category: 'Meeting',
    priority: 'High',
    posted_by: 'HOD Computer Science',
    date: '2026-07-31',
    time: '09:00 AM',
    description: 'MANDATORY ATTENDANCE: All CSE faculty members must attend the emergency department meeting at AS Block Hall 2 today.'
  }
];

export const FACULTY_NOTIFICATIONS = [
  {
    id: 'n_1',
    title: 'Campus facility maintenance update',
    message: 'The campus operations team is reviewing facility maintenance requests submitted this week.',
    type: 'facility',
    read_status: false,
    created_at: '10 mins ago'
  },
  {
    id: 'n_2',
    title: 'Campus event reminder',
    message: 'A new campus event has been added. Visit Events & Meetings for details.',
    type: 'event',
    read_status: false,
    created_at: '1 hour ago'
  },
  {
    id: 'n_3',
    title: 'Notice published',
    message: 'A new campus notice is available in the faculty notices feed.',
    type: 'event',
    read_status: true,
    created_at: 'Yesterday'
  }
];

export const ALL_FACULTY_MEMBERS = [
  {
    id: 'FAC-9402',
    name: 'Dr. Hariharan',
    designation: 'Associate Professor',
    department: 'Computer Science & Eng',
    office_location: 'Sunflower Block, Room SF-303',
    specialization: 'Database Systems & OS',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['11:00 AM - 12:00 PM', '01:00 PM - 02:00 PM'],
    busySlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '02:00 PM - 04:00 PM']
  },
  {
    id: 'FAC-8120',
    name: 'Dr. Rishitha',
    designation: 'Assistant Professor',
    department: 'Computer Science & Eng',
    office_location: 'AS Block, Room AS-204',
    specialization: 'Cybersecurity & Networks',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['09:00 AM - 10:00 AM', '02:00 PM - 04:00 PM'],
    busySlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM']
  },
  {
    id: 'FAC-7491',
    name: 'Prof. Akalya',
    designation: 'Professor',
    department: 'Computer Science & Eng',
    office_location: 'Sunflower Block, Room SF-401',
    specialization: 'Artificial Intelligence & ML',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'],
    busySlots: ['11:00 AM - 12:00 PM']
  },
  {
    id: 'FAC-6302',
    name: 'Dr. Jeswin',
    designation: 'Associate Professor',
    department: 'Information Technology',
    office_location: 'Research Park, Room RP-302',
    specialization: 'Data Mining & Big Data',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'],
    busySlots: ['02:00 PM - 04:00 PM']
  },
  {
    id: 'FAC-5219',
    name: 'Prof. Sai Prasath',
    designation: 'Assistant Professor',
    department: 'Software Engineering',
    office_location: 'Mechanical Block, Room MB-102',
    specialization: 'Cloud Computing & DevOps',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['09:00 AM - 10:00 AM', '02:00 PM - 04:00 PM'],
    busySlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM']
  },
  {
    id: 'FAC-4105',
    name: 'Dr. Rohit',
    designation: 'Professor',
    department: 'Electronics & Communication Eng',
    office_location: 'AS Block, Room AS-301',
    specialization: 'VLSI & Embedded Systems',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM'],
    busySlots: ['09:00 AM - 10:00 AM', '11:00 AM - 12:00 PM']
  },
  {
    id: 'FAC-3098',
    name: 'Dr. Sanjana',
    designation: 'Associate Professor',
    department: 'Artificial Intelligence & Data Science',
    office_location: 'Research Park, Room RP-405',
    specialization: 'Neural Networks & Deep Learning',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['09:00 AM - 11:00 AM'],
    busySlots: ['02:00 PM - 04:00 PM']
  },
  {
    id: 'FAC-2081',
    name: 'Prof. Kishore',
    designation: 'Assistant Professor',
    department: 'Mechanical Engineering',
    office_location: 'Mechanical Block, Room MB-205',
    specialization: 'Thermodynamics & CAD/CAM',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['11:00 AM - 12:00 PM', '03:00 PM - 04:00 PM'],
    busySlots: ['09:00 AM - 11:00 AM']
  },
  {
    id: 'FAC-1077',
    name: 'Dr. Akilesh',
    designation: 'Associate Professor',
    department: 'Civil Engineering',
    office_location: 'IB Block, Room IB-201',
    specialization: 'Structural Engineering',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['09:00 AM - 10:00 AM', '01:00 PM - 02:00 PM'],
    busySlots: ['10:00 AM - 12:00 PM']
  },
  {
    id: 'FAC-0954',
    name: 'Dr. Arjun',
    designation: 'Professor',
    department: 'Electrical & Electronics Eng',
    office_location: 'AS Block, Room AS-102',
    specialization: 'Power Systems & Renewable Energy',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
    freeSlots: ['10:00 AM - 12:00 PM'],
    busySlots: ['02:00 PM - 04:00 PM']
  }
];
