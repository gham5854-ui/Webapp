import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useRouter } from "../RouterContext";
import { useShipments, type Shipment as SharedShipment } from "../ShipmentsContext";
import { cn } from "../utils/cn";

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
  sendGift: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
  gift: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
  arrowRight: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  box: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  plane: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  truck: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  map: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  smile: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
};

interface UserShipment extends SharedShipment {}

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
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
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

export default function UserDashboard() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { navigate } = useRouter();
  const { shipments: allShipments, addShipment } = useShipments();

  // Filter to only this user's shipments (by sender name)
  const shipments = user ? allShipments.filter(s => s.sender === user.name || s.sender === "John Doe") : [];

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<UserShipment | null>(null);

  // Form states
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [originCountry, setOriginCountry] = useState("London, UK");
  const [destCountry, setDestCountry] = useState("");
  const [giftItem, setGiftItem] = useState("Premium Roses Bouquet");
  const [courier, setCourier] = useState("DHL");
  const [insured, setInsured] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payProcessing, setPayProcessing] = useState(false);
  const [generatedPin, setGeneratedPin] = useState("");
  const [pinCopied, setPinCopied] = useState(false);

  // Pricing tables
  const giftPrices: Record<string, number> = {
    "Premium Roses Bouquet": 45,
    "Belgian Chocolate Box": 32,
    "Smart Watch Pro": 199,
    "Designer Perfume": 89,
    "Luxury Gift Card": 50,
    "Personalized Photo Frame": 28,
  };
  const courierRates: Record<string, number> = {
    DHL: 24,
    FedEx: 21,
    UPS: 19,
    EMS: 14,
  };
  const insuranceFee = 5;
  const giftPrice = giftPrices[giftItem] ?? 0;
  const shippingFee = courierRates[courier] ?? 0;
  const totalCost = giftPrice + shippingFee + (insured ? insuranceFee : 0);

  // Tracker state
  const [trackPin, setTrackPin] = useState("");
  const [trackError, setTrackError] = useState("");

  // Seed user shipments (handled by ShipmentsContext now)

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // Set default selected shipment
  useEffect(() => {
    if (shipments.length > 0 && !selectedShipment) {
      setSelectedShipment(shipments[0]);
    }
  }, [shipments, selectedShipment]);

  if (!isAuthenticated || !user) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    const found = shipments.find(s => s.pin === trackPin.trim().toUpperCase());
    if (found) {
      setSelectedShipment(found);
      setActiveTab("shipments");
    } else {
      setTrackError("No shipment found with this Gift PIN.");
    }
  };

  const handleReviewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientEmail || !destCountry) {
      alert("Please fill in all required fields.");
      return;
    }
    setShowPayment(true);
  };

  const handlePayAndSend = () => {
    setPayProcessing(true);
    setTimeout(() => {
      const pinNumber1 = Math.floor(1000 + Math.random() * 9000);
      const pinNumber2 = Math.floor(1000 + Math.random() * 9000);
      const newPin = `GP-${pinNumber1}-${pinNumber2}`;
      const newShipment: UserShipment = {
        id: `SHP-${300 + allShipments.length + 1}`,
        pin: newPin,
        sender: user!.name,
        recipient: recipientName,
        origin: originCountry,
        destination: destCountry,
        status: "Processing",
        courier: courier,
        date: new Date().toISOString().split("T")[0],
        eta: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        value: giftPrice,
        insured: insured,
        item: giftItem,
      };
      addShipment(newShipment);
      setSelectedShipment(newShipment);
      setGeneratedPin(newPin);
      setPayProcessing(false);
      setShowPayment(false);
      setFormSuccess(true);
      setRecipientName("");
      setRecipientEmail("");
      setDestCountry("");
      // No auto-redirect — user reads their PIN first
    }, 1600);
  };

  const getTimelineSteps = (shipment: UserShipment) => {
    const STATUS_ORDER = ["Processing", "Packed", "Picked Up", "In Transit", "Customs", "Out For Delivery", "Delivered"];
    const currentIndex = STATUS_ORDER.indexOf(shipment.status);

    const allSteps = [
      { status: "Processing",       desc: "Payment confirmed. Order is being reviewed by our team.",           emoji: "🔄" },
      { status: "Packed",           desc: `Package wrapped and ready to ship via ${shipment.courier}.`,        emoji: "📦" },
      { status: "Picked Up",        desc: `${shipment.courier} collected the package from sender hub.`,        emoji: "🏪" },
      { status: "In Transit",       desc: `Package is en route to destination via ${shipment.courier}.`,       emoji: "✈️" },
      { status: "Customs",          desc: "Customs inspection at international transit checkpoint.",            emoji: "🛡️" },
      { status: "Out For Delivery", desc: "Package is with the last-mile courier for final delivery.",         emoji: "🚚" },
      { status: "Delivered",        desc: "Delivered! Surprise verification OTP confirmed by recipient.",      emoji: "❤️" },
    ];

    const steps = allSteps.map((step, i) => ({
      ...step,
      done: shipment.status === "Delivered"
        ? true
        : currentIndex >= 0
          ? i <= currentIndex
          : false,
    }));

    // If delayed, inject a Delayed notice after the last completed step
    if (shipment.status === "Delayed") {
      const insertAfter = Math.max(currentIndex, 2); // at least after "Packed"
      steps.splice(insertAfter + 1, 0, {
        status: "Delayed",
        desc: "Shipment has been delayed. Our team is working to resolve this.",
        emoji: "⚠️",
        done: false,
      });
    }

    return steps;
  };

  const activeShipmentsCount = shipments.filter(s => s.status !== "Delivered").length;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center shadow-lg shadow-gift-200">
                <span className="text-white font-bold">{I.gift}</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gift-600 to-pin-600 bg-clip-text text-transparent">
                GiftPin
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === "overview"
                  ? "bg-gradient-to-r from-gift-50 to-pin-50 text-gift-700 shadow-sm border border-gift-100/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <span className={activeTab === "overview" ? "text-gift-600" : "text-gray-400"}>{I.dashboard}</span>
              Overview
            </button>

            <button
              onClick={() => { setActiveTab("shipments"); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === "shipments"
                  ? "bg-gradient-to-r from-gift-50 to-pin-50 text-gift-700 shadow-sm border border-gift-100/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <span className={activeTab === "shipments" ? "text-gift-600" : "text-gray-400"}>{I.shipment}</span>
              My Shipments
            </button>

            <button
              onClick={() => { setActiveTab("send"); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === "send"
                  ? "bg-gradient-to-r from-gift-50 to-pin-50 text-gift-700 shadow-sm border border-gift-100/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <span className={activeTab === "send" ? "text-gift-600" : "text-gray-400"}>{I.sendGift}</span>
              Send a Gift
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === "settings"
                  ? "bg-gradient-to-r from-gift-50 to-pin-50 text-gift-700 shadow-sm border border-gift-100/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <span className={activeTab === "settings" ? "text-gift-600" : "text-gray-400"}>{I.settings}</span>
              Settings
            </button>
          </nav>
        </div>

        {/* User profile card bottom */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-gray-50/50 border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white text-xs font-bold">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
            </div>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              {I.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            {I.menu}
          </button>

          <h2 className="text-xl font-bold text-gray-800 capitalize hidden sm:block">
            {activeTab === "overview" && `Welcome Back, ${user.name.split(" ")[0]}! 👋`}
            {activeTab === "shipments" && "My Sent & Received Gifts"}
            {activeTab === "send" && "Register a New Gift Shipment"}
            {activeTab === "settings" && "Account & Notification Settings"}
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold bg-gift-50 text-gift-600 px-3 py-1 rounded-full uppercase tracking-wider">
              {user.role} member
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
              {user.avatar}
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          
          {/* ─── OVERVIEW TAB ─────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Mini Stats Card Grid */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all">
                  <div>
                    <p className="text-sm text-gray-400 font-semibold">Active Gifts</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{activeShipmentsCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    ✈️
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all">
                  <div>
                    <p className="text-sm text-gray-400 font-semibold">Total Delivered</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{shipments.filter(s => s.status === "Delivered").length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                    🎁
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all">
                  <div>
                    <p className="text-sm text-gray-400 font-semibold">Total Sent Value</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">
                      ${shipments.reduce((acc, curr) => acc + curr.value, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gift-50 text-gift-600 flex items-center justify-center">
                    💰
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-5 gap-6">
                {/* Left Side: Recent Shipments list */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <h3 className="text-lg font-bold text-gray-900">Your Gifting Activity</h3>
                    <button
                      onClick={() => setActiveTab("shipments")}
                      className="text-xs font-bold text-gift-600 hover:text-gift-700"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {shipments.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => { setSelectedShipment(s); setActiveTab("shipments"); }}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gift-50/20 hover:border-gift-100 border border-transparent rounded-2xl cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                            📦
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{s.item}</p>
                            <p className="text-xs text-gray-400">To: <span className="font-semibold text-gray-600">{s.recipient}</span> | {s.destination}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={s.status} />
                          <p className="text-[10px] text-gray-400 font-mono mt-1">{s.pin}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Quick tracker widget */}
                <div className="lg:col-span-2 bg-gradient-to-br from-gift-500 via-gift-600 to-pin-600 rounded-3xl shadow-xl p-6 text-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Trace Your Gift</h3>
                    <p className="text-xs text-white/80 mt-1">Enter your tracking code to view details immediately.</p>
                    
                    <form onSubmit={handleTrackSubmit} className="mt-6 space-y-3">
                      <input
                        type="text"
                        placeholder="GP-XXXX-XXXX"
                        value={trackPin}
                        onChange={(e) => setTrackPin(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 placeholder-white/50 text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 uppercase tracking-widest text-center font-bold"
                      />
                      {trackError && <p className="text-xs text-pink-200 mt-1 font-semibold">{trackError}</p>}
                      <button
                        type="submit"
                        className="w-full bg-white text-gift-600 hover:bg-gray-50 font-bold rounded-2xl py-3 text-sm shadow-md transition-all hover:scale-102"
                      >
                        Find Package
                      </button>
                    </form>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                    <span className="text-xl">✨</span>
                    <p className="text-[11px] text-white/80 leading-normal">
                      Share the tracking code with your recipient so they can join the live surprise story.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ─── SHIPMENTS TAB ───────────────────── */}
          {activeTab === "shipments" && (
            <div className="grid lg:grid-cols-5 gap-6">
              
              {/* Shipments List */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col h-[calc(100vh-280px)] overflow-hidden">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">All Shipments</h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-4 scrollbar-hide">
                  {shipments.map((s) => {
                    const isSelected = selectedShipment?.id === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedShipment(s)}
                        className={cn(
                          "p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3",
                          isSelected
                            ? "border-gift-400 bg-gift-50/35 shadow-sm"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-bold font-mono">{s.pin}</span>
                          <StatusBadge status={s.status} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{s.item}</h4>
                          <p className="text-xs text-gray-500 mt-1">Recipient: <span className="font-semibold">{s.recipient}</span></p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{s.origin} &rarr; {s.destination}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipment Details & Timeline */}
              <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-y-auto h-[calc(100vh-280px)] scrollbar-hide">
                {selectedShipment ? (
                  <div className="space-y-6">
                    
                    {/* Header Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-50 pb-6 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-gift-600 bg-gift-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Active Timeline
                        </span>
                        <h3 className="text-xl font-black text-gray-900 mt-1.5">{selectedShipment.item}</h3>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">PIN: <span className="font-mono text-gray-600">{selectedShipment.pin}</span></p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col justify-center text-right self-start">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Estimated Delivery</span>
                        <span className="text-sm font-bold text-gray-700 mt-0.5">{selectedShipment.eta}</span>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-gray-800">Journey Story Status</h4>
                      
                      <div className="relative pl-8 space-y-8">
                        {/* Timeline vertical bar */}
                        <div className="absolute top-2.5 left-3.5 w-0.5 h-[calc(100%-25px)] bg-gray-200" />

                        {getTimelineSteps(selectedShipment).map((step, idx) => (
                          <div key={idx} className="relative flex gap-4">
                            
                            {/* Circle Indicator */}
                            <div className={cn(
                              "absolute -left-7.5 top-0.5 w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all z-10",
                              step.status === "Delayed"
                                ? "bg-red-100 border-red-300 text-red-600 animate-pulse"
                                : step.done
                                  ? "bg-gradient-to-br from-gift-500 to-pin-600 border-transparent text-white shadow"
                                  : "bg-white border-gray-200 text-gray-400"
                            )}>
                              {step.status === "Delayed" ? "!" : step.done ? "✓" : ""}
                            </div>

                            <div className={cn(
                              "flex-1",
                              step.status === "Delayed" ? "opacity-100" : step.done ? "opacity-100" : "opacity-40"
                            )}>
                              <h5 className={cn(
                                "text-sm font-bold flex items-center gap-1.5",
                                step.status === "Delayed" ? "text-red-600" : "text-gray-800"
                              )}>
                                <span>{step.emoji}</span>
                                {step.status}
                                {step.status === "Delayed" && (
                                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">Action Required</span>
                                )}
                              </h5>
                              <p className={cn(
                                "text-xs mt-1",
                                step.status === "Delayed" ? "text-red-400" : "text-gray-400"
                              )}>{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-8">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Courier</span>
                        <p className="text-sm font-bold text-gray-700 mt-0.5">{selectedShipment.courier}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Declared Value</span>
                        <p className="text-sm font-bold text-gray-700 mt-0.5">${selectedShipment.value}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Registered</span>
                        <p className="text-sm font-bold text-gray-700 mt-0.5">{selectedShipment.date}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Insurance</span>
                        <p className="text-sm font-bold text-gray-700 mt-0.5">{selectedShipment.insured ? "Insured (🛡️)" : "None"}</p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
                    <span className="text-4xl">📦</span>
                    <p className="text-sm mt-3">Select a shipment from the left list to view details.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ─── SEND A GIFT TAB ─────────────────── */}
          {activeTab === "send" && (
            <div className="max-w-2xl mx-auto space-y-5">

              {/* Payment Modal Overlay */}
              {showPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 space-y-6 animate-scale-up">
                    {payProcessing ? (
                      <div className="py-10 flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-full border-4 border-gift-200 border-t-gift-500 animate-spin" />
                        <p className="text-sm font-bold text-gray-700">Processing payment…</p>
                        <p className="text-xs text-gray-400">Please do not close this window.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-black text-gray-900">Confirm Payment</h3>
                          <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                        </div>

                        {/* Order summary */}
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100">
                          <div className="px-4 py-3 flex justify-between text-sm">
                            <span className="text-gray-500">Gift item</span>
                            <span className="font-semibold text-gray-800">{giftItem}</span>
                          </div>
                          <div className="px-4 py-3 flex justify-between text-sm">
                            <span className="text-gray-500">Gift price</span>
                            <span className="font-semibold text-gray-800">${giftPrice.toFixed(2)}</span>
                          </div>
                          <div className="px-4 py-3 flex justify-between text-sm">
                            <span className="text-gray-500">Shipping ({courier})</span>
                            <span className="font-semibold text-gray-800">${shippingFee.toFixed(2)}</span>
                          </div>
                          {insured && (
                            <div className="px-4 py-3 flex justify-between text-sm">
                              <span className="text-gray-500">Gifting Protection 🛡️</span>
                              <span className="font-semibold text-gray-800">${insuranceFee.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="px-4 py-3 flex justify-between">
                            <span className="text-sm font-bold text-gray-900">Total</span>
                            <span className="text-lg font-black bg-gradient-to-r from-gift-600 to-pin-600 bg-clip-text text-transparent">${totalCost.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-gray-400 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                          <p>📦 Shipping to: <span className="font-semibold text-gray-600">{destCountry || "—"}</span></p>
                          <p>👤 Recipient: <span className="font-semibold text-gray-600">{recipientName}</span></p>
                          <p>🚚 Packing begins only after payment is confirmed.</p>
                        </div>

                        <div className="space-y-2.5">
                          <button
                            onClick={handlePayAndSend}
                            className="w-full bg-gradient-to-r from-gift-500 to-pin-600 text-white font-bold rounded-xl py-4 text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all"
                          >
                            💳 Pay ${totalCost.toFixed(2)} & Send Gift
                          </button>
                          <button
                            onClick={() => setShowPayment(false)}
                            className="w-full border border-gray-200 text-gray-500 font-semibold rounded-xl py-3 text-sm hover:bg-gray-50 transition-colors"
                          >
                            Back to Edit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                {/* Header */}
                <div className="border-b border-gray-50 pb-4">
                  <h3 className="text-xl font-black text-gray-900">Send a Surprising Gift</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill in the details below. We generate a unique Gift PIN and link with couriers.
                  </p>
                </div>

                {formSuccess ? (
                  <div className="py-8 space-y-5">
                    {/* Success header */}
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">✓</div>
                      <h4 className="text-lg font-bold text-gray-900">Payment Confirmed! 🎉</h4>
                      <p className="text-sm text-gray-500">Your gift is now registered and awaiting processing.</p>
                    </div>

                    {/* PIN / Tracking number card */}
                    <div className="bg-gradient-to-br from-gift-50 to-pin-50 border-2 border-gift-200 rounded-2xl p-5 text-center space-y-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Gift Tracking PIN</p>
                      <p className="text-3xl font-black tracking-widest bg-gradient-to-r from-gift-600 to-pin-600 bg-clip-text text-transparent font-mono">
                        {generatedPin}
                      </p>
                      <p className="text-xs text-gray-400">Share this PIN with your recipient so they can track the surprise.</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPin).then(() => {
                            setPinCopied(true);
                            setTimeout(() => setPinCopied(false), 2000);
                          });
                        }}
                        className={cn(
                          "inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all",
                          pinCopied
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-white border border-gift-200 text-gift-700 hover:bg-gift-50 hover:shadow-sm"
                        )}
                      >
                        {pinCopied ? "✓ Copied!" : "📋 Copy PIN"}
                      </button>
                    </div>

                    {/* Info row */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 space-y-1 text-xs text-gray-500">
                      <p>🚚 Status: <span className="font-bold text-yellow-600">Processing — awaiting admin confirmation</span></p>
                      <p>📦 Packing will begin once our team reviews your order.</p>
                      <p>📧 A confirmation email has been sent with your tracking details.</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setFormSuccess(false); setActiveTab("shipments"); }}
                        className="flex-1 bg-gradient-to-r from-gift-500 to-pin-600 text-white font-bold rounded-xl py-3 text-sm shadow-lg hover:shadow-xl transition-all"
                      >
                        View My Shipment →
                      </button>
                      <button
                        onClick={() => setFormSuccess(false)}
                        className="flex-1 border border-gray-200 text-gray-600 font-semibold rounded-xl py-3 text-sm hover:bg-gray-50 transition-colors"
                      >
                        Send Another Gift
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReviewOrder} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Recipient Full Name *</label>
                        <input type="text" placeholder="Sarah Connor" value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Recipient Email *</label>
                        <input type="email" placeholder="sarah@example.com" value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100" required />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Origin Address</label>
                        <input type="text" placeholder="e.g. London, UK" value={originCountry}
                          onChange={(e) => setOriginCountry(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Destination Country *</label>
                        <input type="text" placeholder="Lagos, Nigeria" value={destCountry}
                          onChange={(e) => setDestCountry(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100" required />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Select Gift Item</label>
                        <select value={giftItem} onChange={(e) => setGiftItem(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100 bg-white">
                          <option>Premium Roses Bouquet</option>
                          <option>Belgian Chocolate Box</option>
                          <option>Smart Watch Pro</option>
                          <option>Designer Perfume</option>
                          <option>Luxury Gift Card</option>
                          <option>Personalized Photo Frame</option>
                        </select>
                        <p className="text-xs text-gift-600 font-semibold mt-1">Item price: <span className="font-black">${giftPrice.toFixed(2)}</span></p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Courier Service</label>
                        <select value={courier} onChange={(e) => setCourier(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gift-400 focus:ring-4 focus:ring-gift-100 bg-white">
                          <option>DHL</option>
                          <option>FedEx</option>
                          <option>UPS</option>
                          <option>EMS</option>
                        </select>
                        <p className="text-xs text-gray-400 font-semibold mt-1">Shipping fee: <span className="text-gray-600 font-bold">${shippingFee.toFixed(2)}</span></p>
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={insured} onChange={(e) => setInsured(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-gift-600 focus:ring-gift-500" />
                      <span className="text-xs font-semibold text-gray-600">Add Gifting Protection — insures item against loss or damage <span className="text-gift-600">(+$5.00)</span></span>
                    </label>

                    {/* Live Cost Breakdown */}
                    <div className="bg-gradient-to-br from-gift-50 to-pin-50 border border-gift-100 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Cost Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">🎁 Gift — {giftItem}</span>
                          <span className="font-semibold text-gray-800">${giftPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">🚚 Shipping — {courier}</span>
                          <span className="font-semibold text-gray-800">${shippingFee.toFixed(2)}</span>
                        </div>
                        {insured && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">🛡️ Gifting Protection</span>
                            <span className="font-semibold text-gray-800">${insuranceFee.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gift-100 pt-3 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Total Estimated Cost</span>
                        <span className="text-2xl font-black bg-gradient-to-r from-gift-600 to-pin-600 bg-clip-text text-transparent">${totalCost.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-gray-400">⚡ Packing only begins after payment is confirmed. No charges are made until you click Pay.</p>
                    </div>

                    <button type="submit"
                      className="w-full bg-gradient-to-r from-gift-500 to-pin-600 text-white font-bold rounded-xl py-4 text-sm shadow-lg shadow-gift-200 hover:shadow-xl hover:scale-[1.01] transition-all">
                      Review & Pay ${totalCost.toFixed(2)} →
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ─── SETTINGS TAB ────────────────────── */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-gray-50 pb-4">
                <h3 className="text-xl font-black text-gray-900">Profile & Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Manage notification channels and preferences.</p>
              </div>

              <div className="space-y-6">
                
                {/* Profile specs */}
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gift-500 to-pin-600 flex items-center justify-center text-white text-base font-bold shadow-md">
                    {user.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{user.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                </div>

                {/* Notifications setup */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Journey Update Notifications</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <h5 className="text-sm font-bold text-gray-800">Email Updates</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5">Receive delivery invoices and key checkpoints.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-gift-600 focus:ring-gift-500 border-gray-300" />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <h5 className="text-sm font-bold text-gray-800">WhatsApp Alert Messages</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5">Instant delivery milestones directly on WhatsApp.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-gift-600 focus:ring-gift-500 border-gray-300" />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <h5 className="text-sm font-bold text-gray-800">Surprise Mode Auto-Hide</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5">Hide gift item detail in recipient's tracking timeline.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-gift-600 focus:ring-gift-500 border-gray-300" />
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => alert("Settings updated.")}
                  className="w-full bg-gradient-to-r from-gift-500 to-pin-600 text-white font-bold rounded-xl py-3.5 text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Save Settings
                </button>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
