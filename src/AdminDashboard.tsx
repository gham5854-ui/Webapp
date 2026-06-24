import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { cn } from "./utils/cn";
import { useRouter } from "./RouterContext";
import { useShipments } from "./ShipmentsContext";

// ─── Icons ───────────────────────────────────────────
const I = {
  dashboard: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  shipment: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  courier: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v6a3 3 0 0 0 3 3h3" />
      <path d="M18 15V9a3 3 0 0 0-3-3h-3" />
    </svg>
  ),
  revenue: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  gift: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  arrowUp: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  globe: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  filter: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  marketplace: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  tag: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  alertTriangle: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  wallet: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  ),
  trendingUp: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  package: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  more: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

// ─── Types ───────────────────────────────────────────
interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  totalGifts: number;
  joined: string;
  status: "active" | "suspended" | "pending";
}

// Seed data is now managed by ShipmentsContext (loaded from localStorage).
// The static array below is kept only as a type reference — not used at runtime.

// ─── Status Badge ────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    "Processing": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "In Transit": "bg-blue-100 text-blue-700 border-blue-200",
    "Delivered": "bg-green-100 text-green-700 border-green-200",
    "Customs": "bg-amber-100 text-amber-700 border-amber-200",
    "Picked Up": "bg-purple-100 text-purple-700 border-purple-200",
    "Out For Delivery": "bg-gift-100 text-gift-700 border-gift-200",
    "Delayed": "bg-red-100 text-red-700 border-red-200",
    "Packed": "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
      colorMap[status] || "bg-gray-100 text-gray-700 border-gray-200"
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "Processing" ? "bg-yellow-500 animate-pulse" :
        status === "In Transit" ? "bg-blue-500 animate-pulse" :
        status === "Delivered" ? "bg-green-500" :
        status === "Customs" ? "bg-amber-500 animate-pulse" :
        status === "Delayed" ? "bg-red-500 animate-pulse" :
        status === "Out For Delivery" ? "bg-gift-500 animate-pulse" :
        "bg-gray-400"
      )} />
      {status}
    </span>
  );
}

function UserStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", colorMap[status] || "bg-gray-100")}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────
function StatCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}) {
  const isPositive = change.startsWith("+");
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
          {icon}
        </span>
        <span className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        )}>
          {isPositive ? I.arrowUp : I.arrowDown}
          {change}
        </span>
      </div>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────
const navItems = [
  { id: "overview", label: "Overview", icon: I.dashboard },
  { id: "shipments", label: "Shipments", icon: I.shipment },
  { id: "users", label: "Users", icon: I.users },
  { id: "couriers", label: "Couriers", icon: I.courier },
  { id: "revenue", label: "Revenue", icon: I.revenue },
  { id: "marketplace", label: "Marketplace", icon: I.marketplace },
  { id: "settings", label: "Settings", icon: I.settings },
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const { shipments, updateStatus } = useShipments();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Stateful users
  const [usersState, setUsersState] = useState<UserRecord[]>(() => {
    try {
      const saved = localStorage.getItem("giftpin_users");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: "USR-001", name: "Alice Mitchell", email: "alice@example.com", role: "Sender", totalGifts: 23, joined: "2024-01-15", status: "active" },
      { id: "USR-002", name: "John Doe", email: "john@example.com", role: "Sender", totalGifts: 12, joined: "2024-03-20", status: "active" },
      { id: "USR-003", name: "Jane Smith", email: "jane@example.com", role: "Sender", totalGifts: 8, joined: "2024-06-10", status: "active" },
      { id: "USR-004", name: "David Lee", email: "david@example.com", role: "Business", totalGifts: 45, joined: "2024-02-01", status: "active" },
      { id: "USR-005", name: "Emily Rodriguez", email: "emily@example.com", role: "Sender", totalGifts: 5, joined: "2024-08-15", status: "suspended" },
      { id: "USR-006", name: "Michael Chen", email: "michael@example.com", role: "Plus Member", totalGifts: 31, joined: "2024-04-10", status: "active" },
      { id: "USR-007", name: "Sarah Johnson", email: "sarah@example.com", role: "Sender", totalGifts: 7, joined: "2024-09-22", status: "pending" },
      { id: "USR-008", name: "Robert Park", email: "robert@example.com", role: "Business", totalGifts: 67, joined: "2023-11-05", status: "active" },
    ];
  });

  const [userStatusFilter, setUserStatusFilter] = useState("All");

  // Modal states for Users
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  // Form states for Add/Edit User
  const [uName, setUName] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uRole, setURole] = useState("Sender");
  const [uStatus, setUStatus] = useState<"active" | "suspended" | "pending">("active");

  useEffect(() => {
    localStorage.setItem("giftpin_users", JSON.stringify(usersState));
  }, [usersState]);

  // Metrics
  const metrics = {
    activeShipments: shipments.filter((s) => !["Delivered"].includes(s.status)).length,
    totalShipments: shipments.length,
    totalUsers: usersState.length,
    revenue: "$12,847",
    successRate: "96.3%",
    avgDelivery: "3.2 days",
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.pin.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
      s.sender.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
      s.recipient.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(shipmentSearch.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = usersState.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);
    const matchesStatus = userStatusFilter === "All" || u.status === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddUser = () => {
    setUName("");
    setUEmail("");
    setURole("Sender");
    setUStatus("active");
    setShowAddUserModal(true);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uName || !uEmail) return;
    const newId = `USR-${String(usersState.length + 1).padStart(3, "0")}`;
    const newUser: UserRecord = {
      id: newId,
      name: uName,
      email: uEmail,
      role: uRole,
      totalGifts: 0,
      joined: new Date().toISOString().split("T")[0],
      status: uStatus,
    };
    setUsersState([...usersState, newUser]);
    setShowAddUserModal(false);
  };

  const handleOpenEditUser = (u: UserRecord) => {
    setEditingUser(u);
    setUName(u.name);
    setUEmail(u.email);
    setURole(u.role);
    setUStatus(u.status);
    setShowEditUserModal(true);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !uName || !uEmail) return;
    setUsersState(prev =>
      prev.map(u =>
        u.id === editingUser.id
          ? { ...u, name: uName, email: uEmail, role: uRole, status: uStatus }
          : u
      )
    );
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsersState(prev => prev.filter(u => u.id !== userId));
      setShowEditUserModal(false);
      setEditingUser(null);
    }
  };

  const ALL_STATUSES = ["Processing", "Packed", "Picked Up", "In Transit", "Customs", "Out For Delivery", "Delayed", "Delivered"];
  const statuses = ["All", ...ALL_STATUSES];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-gift-600 to-pin-600 bg-clip-text text-transparent">
              GiftPin
            </span>
            <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider ml-1">
              Admin
            </span>
          </a>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-gradient-to-r from-gift-50 to-pin-50 text-gift-700 shadow-sm border border-gift-100/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className={activeTab === item.id ? "text-gift-600" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.avatar || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || "admin@giftpin.com"}</p>
            </div>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              {I.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            {I.menu}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 relative">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gift-500" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.avatar || "A"}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* ─── OVERVIEW ─────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Real-time metrics for your gifting platform.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard title="Active Shipments" value={String(metrics.activeShipments)} change="+12%" icon={I.shipment} color="bg-blue-50 text-blue-600" />
                <StatCard title="Total Shipments" value={String(metrics.totalShipments)} change="+8.3%" icon={I.package} color="bg-purple-50 text-purple-600" />
                <StatCard title="Total Users" value={String(metrics.totalUsers)} change="+5.2%" icon={I.users} color="bg-gift-50 text-gift-600" />
                <StatCard title="Revenue" value={metrics.revenue} change="+15.7%" icon={I.revenue} color="bg-green-50 text-green-600" />
                <StatCard title="Success Rate" value={metrics.successRate} change="+1.2%" icon={I.globe} color="bg-cyan-50 text-cyan-600" />
                <StatCard title="Avg Delivery" value={metrics.avgDelivery} change="-0.5%" icon={I.clock} color="bg-amber-50 text-amber-600" />
              </div>

              {/* Recent Shipments */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
                  <button
                    onClick={() => setActiveTab("shipments")}
                    className="text-sm font-medium text-gift-600 hover:text-gift-700"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50">
                        <th className="px-6 py-3">PIN</th>
                        <th className="px-6 py-3">Sender</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Courier</th>
                        <th className="px-6 py-3">ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipments.slice(0, 5).map((s) => (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-gray-800">{s.pin}</td>
                          <td className="px-6 py-4 text-gray-700">{s.sender}</td>
                          <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                          <td className="px-6 py-4 text-gray-500">{s.courier}</td>
                          <td className="px-6 py-4 text-gray-500">{s.eta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── SHIPMENTS ────────────────────────── */}
          {activeTab === "shipments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage all gift shipments across the platform.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-gift-500 to-pin-600 text-white text-sm font-semibold rounded-xl px-5 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  {I.gift}
                  New Shipment
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{I.search}</span>
                  <input
                    type="text"
                    placeholder="Search by PIN, sender, or recipient..."
                    value={shipmentSearch}
                    onChange={(e) => setShipmentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{I.filter}</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm bg-white appearance-none cursor-pointer"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                        <th className="px-6 py-3">ID / PIN</th>
                        <th className="px-6 py-3">Sender</th>
                        <th className="px-6 py-3">Recipient</th>
                        <th className="px-6 py-3">Route</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Courier</th>
                        <th className="px-6 py-3">Value</th>
                        <th className="px-6 py-3">ETA</th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShipments.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-gray-400 text-sm">
                            No shipments found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredShipments.map((s) => (
                          <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-mono text-xs font-bold text-gray-800">{s.pin}</p>
                              <p className="text-[10px] text-gray-400">{s.id}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{s.sender}</td>
                            <td className="px-6 py-4 text-gray-700">{s.recipient}</td>
                            <td className="px-6 py-4">
                              <p className="text-xs text-gray-700">{s.origin}</p>
                              <p className="text-xs text-gray-400">→ {s.destination}</p>
                            </td>
                            <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                            <td className="px-6 py-4 text-gray-500">{s.courier}</td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-gray-800">${s.value}</span>
                              {s.insured && <span className="ml-1 text-[10px] text-gift-500">🛡️</span>}
                            </td>
                            <td className="px-6 py-4 text-gray-500">{s.eta}</td>
                            <td className="px-6 py-4">
                              <select
                                value={s.status}
                                onChange={(e) => updateStatus(s.id, e.target.value)}
                                className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-gift-400 focus:ring-2 focus:ring-gift-100 cursor-pointer hover:border-gift-300 transition-colors"
                                title="Update shipment status"
                              >
                                {ALL_STATUSES.map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>Showing {filteredShipments.length} of {shipments.length} shipments</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 bg-gray-50 text-gray-800 font-medium">1</button>
                    <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── USERS ────────────────────────────── */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage platform users and their accounts.</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2 hover:bg-gray-50 transition-all duration-200 outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button
                    onClick={handleOpenAddUser}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gift-500 to-pin-600 text-white text-sm font-semibold rounded-xl px-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {I.users}
                    Add User
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{I.search}</span>
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm"
                />
              </div>

              {/* Users Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.length === 0 ? (
                  <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 py-12 text-center text-gray-400 text-sm">
                    No users found matching your search.
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gift-400 to-pin-500 flex items-center justify-center text-white text-sm font-bold">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <UserStatusBadge status={u.status} />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">{u.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{u.role}</p>
                          <p className="text-[10px] text-gray-400">{u.totalGifts} gifts sent</p>
                        </div>
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="text-xs font-semibold text-gift-600 hover:text-gift-700 px-3 py-1.5 rounded-lg hover:bg-gift-50 transition-colors"
                        >
                          View / Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ─── COURIERS ─────────────────────────── */}
          {activeTab === "couriers" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Courier Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage courier partners, performance, and SLA tracking.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {["DHL", "FedEx", "UPS", "Aramex", "EMS"].map((name) => {
                  const performance = Math.floor(85 + Math.random() * 15);
                  return (
                    <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 mb-4">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">SLA Performance</span>
                          <span className="font-semibold text-gray-700">{performance}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className={cn(
                            "h-full rounded-full",
                            performance >= 95 ? "bg-green-500" : performance >= 85 ? "bg-amber-500" : "bg-red-500"
                          )} style={{ width: `${performance}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Avg delivery: {Math.floor(2 + Math.random() * 4)} days</span>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Courier</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Courier name" className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm" />
                  <input type="text" placeholder="API endpoint" className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm" />
                  <button className="bg-gradient-to-r from-gift-500 to-pin-600 text-white text-sm font-semibold rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300">
                    Connect Courier
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── REVENUE ──────────────────────────── */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Track revenue, growth, and financial metrics.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$12,847</p>
                  <p className="text-xs text-green-600 mt-2">↑ 15.7% from last month</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500 mb-1">Shipping Volume</p>
                  <p className="text-3xl font-bold text-gray-900">847</p>
                  <p className="text-xs text-green-600 mt-2">↑ 8.3% from last month</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500 mb-1">Subscription Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$3,240</p>
                  <p className="text-xs text-green-600 mt-2">↑ 22.1% from last month</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">$89</p>
                  <p className="text-xs text-green-600 mt-2">↑ 3.2% from last month</p>
                </div>
              </div>

              {/* Revenue breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { source: "Shipping Fees", amount: "$7,245", percentage: 56, color: "from-gift-500 to-pin-500" },
                    { source: "Subscriptions (GiftPin Plus)", amount: "$3,240", percentage: 25, color: "from-pin-400 to-gift-500" },
                    { source: "Insurance", amount: "$1,234", percentage: 10, color: "from-amber-400 to-orange-500" },
                    { source: "Marketplace Commission", amount: "$1,128", percentage: 9, color: "from-emerald-400 to-teal-500" },
                  ].map((item) => (
                    <div key={item.source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.source}</span>
                        <span className="font-semibold text-gray-900">{item.amount}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={cn("h-full rounded-full bg-gradient-to-r", item.color)} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
                <div className="flex items-end gap-2 h-32">
                  {[40, 55, 48, 70, 65, 85, 90, 110, 95, 120, 130, 145].map((val, i) => {
                    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-gift-500 to-pin-500 hover:from-gift-400 hover:to-pin-400 transition-all cursor-pointer"
                          style={{ height: `${(val / 145) * 100}%` }}
                        />
                        <span className="text-[9px] text-gray-400">{months[i]}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">New customers per month (2025)</p>
              </div>
            </div>
          )}

          {/* ─── MARKETPLACE ──────────────────────── */}
          {activeTab === "marketplace" && (() => {
            const vendors = [
              { id: "VND-001", name: "Bloom & Co.", category: "Flowers", emoji: "🌹", rating: 4.9, orders: 1284, fulfillmentTime: "1.2 days", refundRate: 0.8, revenue: 38420, commissionRate: 12, status: "active", stock: 94 },
              { id: "VND-002", name: "Choco Royale", category: "Chocolates", emoji: "🍫", rating: 4.7, orders: 956, fulfillmentTime: "1.5 days", refundRate: 1.2, revenue: 21870, commissionRate: 10, status: "active", stock: 67 },
              { id: "VND-003", name: "TechGift Hub", category: "Electronics", emoji: "⌚", rating: 4.5, orders: 312, fulfillmentTime: "2.8 days", refundRate: 3.4, revenue: 62400, commissionRate: 8, status: "active", stock: 18 },
              { id: "VND-004", name: "Scent Luxe", category: "Perfumes", emoji: "🧴", rating: 4.8, orders: 721, fulfillmentTime: "1.1 days", refundRate: 0.6, revenue: 64890, commissionRate: 11, status: "active", stock: 42 },
              { id: "VND-005", name: "FrameCraft", category: "Photo Frames", emoji: "🖼️", rating: 4.3, orders: 198, fulfillmentTime: "3.5 days", refundRate: 5.1, revenue: 7722, commissionRate: 14, status: "suspended", stock: 5 },
              { id: "VND-006", name: "SilkWear Studio", category: "Apparel", emoji: "🧣", rating: 4.6, orders: 540, fulfillmentTime: "2.0 days", refundRate: 2.2, revenue: 42660, commissionRate: 12, status: "active", stock: 31 },
              { id: "VND-007", name: "SoundSphere", category: "Electronics", emoji: "🎧", rating: 4.4, orders: 289, fulfillmentTime: "2.4 days", refundRate: 2.8, revenue: 43050, commissionRate: 9, status: "pending", stock: 0 },
            ];

            const payouts = [
              { id: "PAY-2891", vendor: "Scent Luxe", emoji: "🧴", period: "May 2026", grossSales: 64890, commissionRate: 11, commission: 7138, netPayout: 57752, status: "paid", date: "2026-06-01" },
              { id: "PAY-2890", vendor: "Bloom & Co.", emoji: "🌹", period: "May 2026", grossSales: 38420, commissionRate: 12, commission: 4610, netPayout: 33810, status: "paid", date: "2026-06-01" },
              { id: "PAY-2889", vendor: "TechGift Hub", emoji: "⌚", period: "May 2026", grossSales: 62400, commissionRate: 8, commission: 4992, netPayout: 57408, status: "processing", date: "2026-06-02" },
              { id: "PAY-2888", vendor: "SilkWear Studio", emoji: "🧣", period: "May 2026", grossSales: 42660, commissionRate: 12, commission: 5119, netPayout: 37541, status: "processing", date: "2026-06-02" },
              { id: "PAY-2887", vendor: "Choco Royale", emoji: "🍫", period: "May 2026", grossSales: 21870, commissionRate: 10, commission: 2187, netPayout: 19683, status: "pending", date: "2026-06-05" },
              { id: "PAY-2886", vendor: "SoundSphere", emoji: "🎧", period: "May 2026", grossSales: 43050, commissionRate: 9, commission: 3875, netPayout: 39175, status: "pending", date: "2026-06-05" },
              { id: "PAY-2885", vendor: "FrameCraft", emoji: "🖼️", period: "Apr 2026", grossSales: 7722, commissionRate: 14, commission: 1081, netPayout: 6641, status: "failed", date: "2026-05-01" },
            ];

            const inventoryAlerts = [
              { id: "INV-001", vendor: "SoundSphere", emoji: "🎧", product: "Wireless Earbuds Pro", category: "Electronics", stock: 0, threshold: 10, region: "Global", severity: "critical" as const },
              { id: "INV-002", vendor: "FrameCraft", emoji: "🖼️", product: "Personalised Oak Frame", category: "Photo Frames", stock: 5, threshold: 15, region: "EU", severity: "critical" as const },
              { id: "INV-003", vendor: "TechGift Hub", emoji: "⌚", product: "Smart Watch Pro", category: "Electronics", stock: 18, threshold: 25, region: "US & CA", severity: "low" as const },
              { id: "INV-004", vendor: "SilkWear Studio", emoji: "🧣", product: "Cashmere Scarf (Red)", category: "Apparel", stock: 31, threshold: 40, region: "UK & EU", severity: "low" as const },
              { id: "INV-005", vendor: "Choco Royale", emoji: "🍫", product: "Premium Dark Chocolate Box", category: "Chocolates", stock: 67, threshold: 50, region: "Global", severity: "ok" as const },
            ];

            const [mpTab, setMpTab] = useState<"vendors" | "payouts" | "inventory">("vendors");
            const [vendorSearch, setVendorSearch] = useState("");
            const [selectedVendor, setSelectedVendor] = useState(vendors[0]);

            const filteredVendors = vendors.filter(v =>
              v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
              v.category.toLowerCase().includes(vendorSearch.toLowerCase())
            );

            const totalCommission = payouts.reduce((acc, p) => acc + p.commission, 0);
            const totalGross = payouts.reduce((acc, p) => acc + p.grossSales, 0);
            const criticalAlerts = inventoryAlerts.filter(a => a.severity === "critical").length;

            const payoutStatusStyle = (s: string) => ({
              paid: "bg-green-100 text-green-700 border-green-200",
              processing: "bg-blue-100 text-blue-700 border-blue-200",
              pending: "bg-amber-100 text-amber-700 border-amber-200",
              failed: "bg-red-100 text-red-700 border-red-200",
            }[s] ?? "bg-gray-100 text-gray-600 border-gray-200");

            const vendorStatusStyle = (s: string) => ({
              active: "bg-green-100 text-green-700",
              suspended: "bg-red-100 text-red-700",
              pending: "bg-amber-100 text-amber-700",
            }[s] ?? "bg-gray-100 text-gray-600");

            const severityBar = (s: "critical" | "low" | "ok") => ({
              critical: "bg-red-500",
              low: "bg-amber-400",
              ok: "bg-green-500",
            }[s]);

            return (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marketplace & Vendors</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage vendors, track commissions, and monitor inventory levels.</p>
                  </div>
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-gift-500 to-pin-600 text-white text-sm font-semibold rounded-xl px-5 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    {I.marketplace}
                    Add Vendor
                  </button>
                </div>

                {/* Summary KPIs */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gift-100 to-gift-200 flex items-center justify-center text-gift-600">{I.marketplace}</div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">{vendors.length}</p>
                      <p className="text-xs text-gray-500 font-medium">Active Vendors</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-600">{I.wallet}</div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">${totalCommission.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 font-medium">Commissions (May)</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pin-100 to-pin-200 flex items-center justify-center text-pin-600">{I.trendingUp}</div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">${totalGross.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 font-medium">Gross Sales (May)</p>
                    </div>
                  </div>
                  <div className={cn("rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-all", criticalAlerts > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-100")}>
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", criticalAlerts > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>{I.alertTriangle}</div>
                    <div>
                      <p className={cn("text-2xl font-black", criticalAlerts > 0 ? "text-red-700" : "text-gray-900")}>{criticalAlerts}</p>
                      <p className="text-xs text-gray-500 font-medium">Critical Stock Alerts</p>
                    </div>
                  </div>
                </div>

                {/* Sub-tab navigation */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
                  {(["vendors", "payouts", "inventory"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setMpTab(tab)}
                      className={cn(
                        "px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200",
                        mpTab === tab
                          ? "bg-white shadow text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab === "vendors" && "Vendor Performance"}
                      {tab === "payouts" && "Payout Ledger"}
                      {tab === "inventory" && `Inventory Alerts ${criticalAlerts > 0 ? `(${criticalAlerts} 🔴)` : ""}`}
                    </button>
                  ))}
                </div>

                {/* ── VENDOR PERFORMANCE ── */}
                {mpTab === "vendors" && (
                  <div className="grid lg:grid-cols-5 gap-6">
                    {/* Vendor List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-50">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{I.search}</span>
                          <input
                            type="text"
                            placeholder="Search vendors..."
                            value={vendorSearch}
                            onChange={e => setVendorSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {filteredVendors.map(v => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVendor(v)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50/80 transition-colors",
                              selectedVendor.id === v.id ? "bg-gift-50/40 border-l-2 border-gift-400" : ""
                            )}
                          >
                            <span className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl">{v.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">{v.name}</p>
                              <p className="text-xs text-gray-400">{v.category}</p>
                            </div>
                            <div className="text-right">
                              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", vendorStatusStyle(v.status))}>{v.status}</span>
                              <p className="text-xs text-gray-400 mt-0.5">{v.orders} orders</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vendor Detail Panel */}
                    <div className="lg:col-span-3 space-y-4">
                      {/* Headline card */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <span className="text-4xl w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-sm">{selectedVendor.emoji}</span>
                            <div>
                              <h3 className="text-xl font-black text-gray-900">{selectedVendor.name}</h3>
                              <p className="text-sm text-gray-400 mt-0.5">{selectedVendor.category} · {selectedVendor.id}</p>
                              <span className={cn("inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize", vendorStatusStyle(selectedVendor.status))}>{selectedVendor.status}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {selectedVendor.status === "suspended" ? (
                              <button className="text-xs font-semibold text-green-600 border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">Reinstate</button>
                            ) : (
                              <button className="text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Suspend</button>
                            )}
                            <button className="text-xs font-semibold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-black text-gray-900">{selectedVendor.orders.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Total Orders</p>
                          </div>
                          <div className="bg-yellow-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-black text-yellow-700 flex items-center justify-center gap-1">
                              <span className="text-yellow-400">{I.star}</span>{selectedVendor.rating}
                            </p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Rating</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-black text-blue-700">{selectedVendor.fulfillmentTime}</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Avg Fulfillment</p>
                          </div>
                          <div className={cn("rounded-xl p-3 text-center", selectedVendor.refundRate > 3 ? "bg-red-50" : "bg-green-50")}>
                            <p className={cn("text-lg font-black", selectedVendor.refundRate > 3 ? "text-red-600" : "text-green-600")}>{selectedVendor.refundRate}%</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Refund Rate</p>
                          </div>
                        </div>
                      </div>

                      {/* Revenue & Commission */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">Revenue & Commission Breakdown</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Gross Revenue (May)</span>
                            <span className="text-sm font-bold text-gray-900">${selectedVendor.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Commission Rate</span>
                            <span className="text-sm font-bold text-gift-600">{selectedVendor.commissionRate}%</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                            <span className="text-sm text-gray-500">GiftPin Commission</span>
                            <span className="text-sm font-bold text-green-600">+${Math.round(selectedVendor.revenue * selectedVendor.commissionRate / 100).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5">
                            <span className="text-sm font-semibold text-gray-700">Net Payout to Vendor</span>
                            <span className="text-base font-black text-gray-900">${(selectedVendor.revenue - Math.round(selectedVendor.revenue * selectedVendor.commissionRate / 100)).toLocaleString()}</span>
                          </div>
                        </div>
                        {/* Revenue bar visual */}
                        <div className="mt-4">
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-gift-500 to-pin-600 rounded-full transition-all duration-700"
                              style={{ width: `${100 - selectedVendor.commissionRate}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                            <span>Vendor Payout ({100 - selectedVendor.commissionRate}%)</span>
                            <span>Commission ({selectedVendor.commissionRate}%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className={cn("rounded-2xl border p-4 flex items-center gap-4", selectedVendor.stock === 0 ? "bg-red-50 border-red-200" : selectedVendor.stock < 20 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200")}>
                        <span className="text-2xl">{selectedVendor.stock === 0 ? "🚫" : selectedVendor.stock < 20 ? "⚠️" : "✅"}</span>
                        <div>
                          <p className={cn("text-sm font-bold", selectedVendor.stock === 0 ? "text-red-700" : selectedVendor.stock < 20 ? "text-amber-700" : "text-green-700")}>
                            {selectedVendor.stock === 0 ? "Out of Stock – Listings Paused" : selectedVendor.stock < 20 ? `Low Stock Warning – ${selectedVendor.stock} units remaining` : `Healthy Stock – ${selectedVendor.stock} units available`}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Inventory is monitored globally across distribution hubs.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PAYOUT LEDGER ── */}
                {mpTab === "payouts" && (
                  <div className="space-y-4">
                    {/* Ledger summary */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                        <span className="text-2xl">💸</span>
                        <div>
                          <p className="text-sm font-bold text-green-800">Total Disbursed</p>
                          <p className="text-xl font-black text-green-700">${payouts.filter(p => p.status === "paid").reduce((a, p) => a + p.netPayout, 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                        <span className="text-2xl">⏳</span>
                        <div>
                          <p className="text-sm font-bold text-amber-800">Pending Disbursement</p>
                          <p className="text-xl font-black text-amber-700">${payouts.filter(p => p.status === "pending" || p.status === "processing").reduce((a, p) => a + p.netPayout, 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-gift-50 border border-gift-100 rounded-2xl p-4 flex items-center gap-3">
                        <span className="text-2xl">💰</span>
                        <div>
                          <p className="text-sm font-bold text-gift-800">Platform Commission Earned</p>
                          <p className="text-xl font-black text-gift-700">${totalCommission.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Payout & Commission Ledger</h3>
                        <button className="text-xs font-semibold text-gift-600 border border-gift-200 bg-gift-50 px-3 py-1.5 rounded-lg hover:bg-gift-100 transition-colors">Export CSV</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
                              <th className="px-6 py-3">Invoice ID</th>
                              <th className="px-6 py-3">Vendor</th>
                              <th className="px-6 py-3">Period</th>
                              <th className="px-6 py-3">Gross Sales</th>
                              <th className="px-6 py-3">Commission</th>
                              <th className="px-6 py-3">Net Payout</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {payouts.map(p => (
                              <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{p.id}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{p.emoji}</span>
                                    <span className="font-semibold text-gray-800">{p.vendor}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{p.period}</td>
                                <td className="px-6 py-4 font-semibold text-gray-700">${p.grossSales.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gift-600 font-bold">${p.commission.toLocaleString()} <span className="text-[10px] text-gray-400">({p.commissionRate}%)</span></td>
                                <td className="px-6 py-4 font-black text-gray-900">${p.netPayout.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border", payoutStatusStyle(p.status))}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", p.status === "paid" ? "bg-green-500" : p.status === "processing" ? "bg-blue-500 animate-pulse" : p.status === "pending" ? "bg-amber-400" : "bg-red-500")} />
                                    {p.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-xs">{p.date}</td>
                                <td className="px-6 py-4">
                                  {p.status === "pending" && (
                                    <button className="text-xs font-semibold text-green-600 border border-green-200 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors">Approve</button>
                                  )}
                                  {p.status === "failed" && (
                                    <button className="text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors">Retry</button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── INVENTORY ALERTS ── */}
                {mpTab === "inventory" && (
                  <div className="space-y-4">
                    {/* Alert summary bar */}
                    {criticalAlerts > 0 && (
                      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 animate-fade-in">
                        <span className="text-xl">🚨</span>
                        <div>
                          <p className="text-sm font-bold text-red-700">{criticalAlerts} Critical Out-of-Stock Alert{criticalAlerts > 1 ? "s" : ""} Detected</p>
                          <p className="text-xs text-red-500 mt-0.5">Products below the minimum threshold are automatically hidden from the marketplace to prevent failed orders.</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Inventory Monitoring — All Products</h3>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Out of Stock</span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Low Stock</span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Healthy</span>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-50">
                        {inventoryAlerts.map(item => {
                          const pct = Math.min(100, Math.round((item.stock / (item.threshold * 2)) * 100));
                          return (
                            <div key={item.id} className={cn("px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors", item.severity === "critical" ? "bg-red-50/40" : "hover:bg-gray-50/50")}>
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">{item.emoji}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-800">{item.product}</p>
                                    {item.severity === "critical" && <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase">Critical</span>}
                                    {item.severity === "low" && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase">Low Stock</span>}
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">{item.vendor} · {item.category} · {item.region}</p>
                                </div>
                              </div>

                              <div className="sm:w-48 space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">{item.stock} / {item.threshold * 2} units</span>
                                  <span className={cn("font-bold", item.severity === "critical" ? "text-red-600" : item.severity === "low" ? "text-amber-600" : "text-green-600")}>
                                    {item.stock === 0 ? "Empty" : `${pct}%`}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div className={cn("h-full rounded-full transition-all duration-700", severityBar(item.severity))} style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-400">Min threshold: {item.threshold} units</p>
                              </div>

                              <div className="flex gap-2">
                                {item.severity === "critical" && (
                                  <button className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">Alert Vendor</button>
                                )}
                                <button className="text-xs font-semibold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">Restock</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ─── SETTINGS ─────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage platform configuration and preferences.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Maintenance Mode</p>
                        <p className="text-xs text-gray-400">Disable platform access for maintenance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gift-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gift-500 peer-checked:to-pin-600" />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Auto Insurance</p>
                        <p className="text-xs text-gray-400">Enable automatic insurance for all shipments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gift-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gift-500 peer-checked:to-pin-600" />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Surprise Mode Default</p>
                        <p className="text-xs text-gray-400">Enable surprise mode by default for new shipments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gift-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gift-500 peer-checked:to-pin-600" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                  <div className="space-y-4">
                    {["Email Notifications", "SMS Notifications", "WhatsApp Notifications", "Push Notifications"].map((name) => (
                      <div key={name} className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">{name}</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gift-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gift-500 peer-checked:to-pin-600" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900">Courier API Configuration</h3>
                  <div className="space-y-3">
                    {["DHL API Key", "FedEx API Key", "UPS API Key", "Aramex API Key"].map((name) => (
                      <div key={name}>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{name}</label>
                        <input type="password" placeholder="Enter API key..." className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-gift-400 focus:ring-2 focus:ring-gift-100 outline-none text-sm" />
                      </div>
                    ))}
                  </div>
                  <button className="bg-gradient-to-r from-gift-500 to-pin-600 text-white text-sm font-semibold rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300">
                    Save API Keys
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
                  <p className="text-xs text-gray-400">Irreversible actions. Proceed with caution.</p>
                  <div className="space-y-3">
                    <button className="w-full text-sm font-medium text-red-600 border-2 border-red-200 rounded-xl px-6 py-3 hover:bg-red-50 transition-colors">
                      Clear All Shipment Data
                    </button>
                    <button className="w-full text-sm font-medium text-red-600 bg-red-50 border-2 border-red-200 rounded-xl px-6 py-3 hover:bg-red-100 transition-colors">
                      Delete Platform Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      {/* ─── ADD USER MODAL ───────────────────────── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h3 className="text-xl font-black text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Liam Neeson"
                  value={uName}
                  onChange={(e) => setUName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. liam@example.com"
                  value={uEmail}
                  onChange={(e) => setUEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Role</label>
                  <select
                    value={uRole}
                    onChange={(e) => setURole(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400"
                  >
                    <option value="Sender">Sender</option>
                    <option value="Business">Business</option>
                    <option value="Plus Member">Plus Member</option>
                    <option value="Recipient">Recipient</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Status</label>
                  <select
                    value={uStatus}
                    onChange={(e) => setUStatus(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-gift-500 to-pin-600 text-white font-bold rounded-xl py-3 text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 border border-gray-200 text-gray-500 font-semibold rounded-xl py-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT USER MODAL ──────────────────────── */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">User Details & Action</h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {editingUser.id} • Joined: {editingUser.joined}</p>
              </div>
              <button
                onClick={() => { setShowEditUserModal(false); setEditingUser(null); }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Full Name</label>
                <input
                  type="text"
                  value={uName}
                  onChange={(e) => setUName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
                <input
                  type="email"
                  value={uEmail}
                  onChange={(e) => setUEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Role</label>
                  <select
                    value={uRole}
                    onChange={(e) => setURole(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400"
                  >
                    <option value="Sender">Sender</option>
                    <option value="Business">Business</option>
                    <option value="Plus Member">Plus Member</option>
                    <option value="Recipient">Recipient</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Status</label>
                  <select
                    value={uStatus}
                    onChange={(e) => setUStatus(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500">
                🎁 Total gifts sent: <span className="font-semibold text-gray-800">{editingUser.totalGifts} gifts</span>
              </div>

              <div className="flex flex-col gap-2.5 pt-4">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-gift-500 to-pin-600 text-white font-bold rounded-xl py-3 text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEditUserModal(false); setEditingUser(null); }}
                    className="flex-1 border border-gray-200 text-gray-500 font-semibold rounded-xl py-3 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleDeleteUser(editingUser.id)}
                  className="w-full text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 font-bold rounded-xl py-2.5 text-xs transition-colors mt-2"
                >
                  🗑️ Delete User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
