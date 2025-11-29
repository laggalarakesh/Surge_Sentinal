
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, setDoc, doc, Timestamp } from 'firebase/firestore';

// --- Types ---
export interface SystemAlert {
  id?: string;
  title: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  sender: string;
  timestamp: any;
}

export interface HospitalStats {
  id?: string;
  name: string;
  op: number;
  ip: number;
  er: number;
  capacity: number;
  status: 'Normal' | 'Moderate' | 'High Surge' | 'Critical';
  lastUpdated: any;
}

// --- Alerts Logic ---

export const sendSystemAlert = async (alert: Omit<SystemAlert, 'id' | 'timestamp'>) => {
  try {
    const alertsRef = collection(db, 'alerts');
    await addDoc(alertsRef, {
      ...alert,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    // Log safe error message
    console.error("Error sending alert:", (error as Error).message);
    throw error;
  }
};

export const subscribeToAlerts = (callback: (alerts: SystemAlert[]) => void) => {
  const alertsRef = collection(db, 'alerts');
  const q = query(alertsRef, orderBy('timestamp', 'desc'), limit(10));

  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SystemAlert[];
    callback(alerts);
  }, (error) => {
    console.warn("Error subscribing to alerts (offline mode?):", error.message);
    // Don't crash, just return empty list or do nothing
    callback([]); 
  });
};

// --- Hospital Data Logic ---

export const updateHospitalData = async (hospitalId: string, data: Omit<HospitalStats, 'id' | 'lastUpdated'>) => {
  try {
    // Create a deterministic document ID based on hospital name or ID for simple updates
    // In a real app, use a proper Auth UID
    const safeId = hospitalId.replace(/[^a-zA-Z0-9]/g, '_'); 
    const docRef = doc(db, 'hospitals', safeId);
    
    await setDoc(docRef, {
      ...data,
      lastUpdated: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating hospital data:", (error as Error).message);
    // We swallow the error here so the UI doesn't break if Firestore is unreachable
  }
};

export const subscribeToHospitalData = (callback: (hospitals: HospitalStats[]) => void) => {
  const hospitalsRef = collection(db, 'hospitals');
  
  return onSnapshot(hospitalsRef, (snapshot) => {
    const hospitals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalStats[];
    callback(hospitals);
  }, (error) => {
    console.warn("Error subscribing to hospital data (offline mode?):", error.message);
    callback([]);
  });
};
