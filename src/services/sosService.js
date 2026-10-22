// src/services/sosService.js
// Persistent Storage & Event Dispatcher for Emergency SOS Alerts and Video Clips

const SOS_STORAGE_KEY = 'wayfindyou_emergency_sos_alerts';
const SOS_MEDIA_DB_NAME = 'wayfindyou_sos_media_db';
const SOS_MEDIA_STORE_NAME = 'sos_media_blobs';
export const SOS_EVENT_NAME = 'wayfindyou_sos_event';

// IndexedDB Helper for SOS Media Blobs (video & voice clips)
function openSOSMediaDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(SOS_MEDIA_DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(SOS_MEDIA_STORE_NAME)) {
        db.createObjectStore(SOS_MEDIA_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSOSMediaBlob(id, blob) {
  try {
    const db = await openSOSMediaDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SOS_MEDIA_STORE_NAME, 'readwrite');
      const store = tx.objectStore(SOS_MEDIA_STORE_NAME);
      store.put({ id, blob, createdAt: new Date().toISOString() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Unable to store SOS media blob in IndexedDB:', err);
    return false;
  }
}

export async function getSOSMediaBlob(id) {
  try {
    const db = await openSOSMediaDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SOS_MEDIA_STORE_NAME, 'readonly');
      const store = tx.objectStore(SOS_MEDIA_STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Unable to read SOS media blob from IndexedDB:', err);
    return null;
  }
}

function getInitialDemoSOSAlerts() {
  return [];
}

// Clear all SOS Alerts
export function clearAllSOSAlerts() {
  localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent(SOS_EVENT_NAME, { detail: { action: 'clear' } }));
  window.dispatchEvent(new Event('storage'));
  return [];
}

// Get all SOS Alerts
export function getAllSOSAlerts() {
  try {
    const saved = localStorage.getItem(SOS_STORAGE_KEY);
    if (!saved) {
      const defaults = getInitialDemoSOSAlerts();
      localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(saved);
  } catch (err) {
    return getInitialDemoSOSAlerts();
  }
}

// Get Unacknowledged / Active SOS Alerts
export function getActiveUnacknowledgedSOSAlerts() {
  const all = getAllSOSAlerts();
  return all.filter((alert) => !alert.acknowledged && alert.status === 'Active Emergency Alert');
}

// Broadcast a new SOS Alert
export function broadcastSOSAlert(alertData) {
  const all = getAllSOSAlerts();
  const newRecord = {
    id: alertData.id || `SOS-${Date.now()}`,
    studentId: alertData.studentId || 'STU-88392',
    studentName: alertData.studentName || 'Sanjana P',
    department: alertData.department || 'Computer Science & Engineering',
    phone: alertData.phone || '+91 99001 98765',
    location: alertData.location || 'Academic Block B - Floor 3 (Near AI Lab)',
    time: alertData.time || new Date().toLocaleTimeString(),
    date: alertData.date || new Date().toLocaleDateString(),
    createdAt: new Date().toISOString(),
    videoUrl: alertData.videoUrl || null,
    mediaId: alertData.mediaId || null,
    alertMessage: alertData.alertMessage || '🚨 EMERGENCY PANIC TRIGGER: Immediate security squad dispatch required!',
    acknowledged: false,
    status: 'Active Emergency Alert'
  };

  const updated = [newRecord, ...all];
  localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));

  // Dispatch events to wake up open windows & tabs
  window.dispatchEvent(new CustomEvent(SOS_EVENT_NAME, { detail: newRecord }));
  window.dispatchEvent(new Event('storage'));

  return newRecord;
}

// Acknowledge SOS Alert & silence alarm
export function acknowledgeSOSAlert(alertId, adminNotes = 'Security Squad Dispatched') {
  const all = getAllSOSAlerts();
  const updated = all.map((alert) => {
    if (!alertId || alertId === 'all_active' || alert.id === alertId) {
      return {
        ...alert,
        acknowledged: true,
        acknowledgedAt: new Date().toISOString(),
        status: 'Acknowledged - Security Dispatched',
        adminNotes
      };
    }
    return alert;
  });

  localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(SOS_EVENT_NAME, { detail: { alertId, action: 'acknowledge' } }));
  window.dispatchEvent(new Event('storage'));
  return updated;
}

// Clear demo SOS alerts
export function resetDemoSOSAlerts() {
  localStorage.removeItem(SOS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(SOS_EVENT_NAME, { detail: { action: 'reset' } }));
  window.dispatchEvent(new Event('storage'));
}
