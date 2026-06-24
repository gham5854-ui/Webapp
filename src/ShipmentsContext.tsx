import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Shipment {
  id: string;
  pin: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  status: string;
  courier: string;
  date: string;
  eta: string;
  value: number;
  insured: boolean;
  item?: string;
}

const API_BASE = "http://localhost:5000/api";

interface ShipmentsContextType {
  shipments: Shipment[];
  addShipment: (s: Shipment) => void;
  updateStatus: (id: string, status: string) => void;
}

const ShipmentsContext = createContext<ShipmentsContextType | null>(null);

export function ShipmentsProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const { isAuthenticated } = useAuth();

  const fetchShipments = useCallback(async () => {
    const token = localStorage.getItem("giftpin_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/shipments`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setShipments(data);
      }
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchShipments();
    } else {
      setShipments([]);
    }
  }, [isAuthenticated, fetchShipments]);

  const addShipment = useCallback(async (s: Shipment) => {
    const token = localStorage.getItem("giftpin_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(s)
      });
      if (res.ok) {
        const saved = await res.json();
        // Use server-returned shipment or client-generated fallback
        setShipments(prev => [saved || s, ...prev]);
      } else {
        // Fallback for safety in case of validation errors
        setShipments(prev => [s, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add shipment:", err);
      // Local fallback for offline mode
      setShipments(prev => [s, ...prev]);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: string) => {
    const token = localStorage.getItem("giftpin_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/shipments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setShipments(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }, []);

  return (
    <ShipmentsContext.Provider value={{ shipments, addShipment, updateStatus }}>
      {children}
    </ShipmentsContext.Provider>
  );
}

export function useShipments() {
  const ctx = useContext(ShipmentsContext);
  if (!ctx) throw new Error("useShipments must be used within ShipmentsProvider");
  return ctx;
}
