import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "giftpin-super-secret-key-12345";
const DB_FILE = path.join(__dirname, "../data/db.json");

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions for JSON database operations
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  role: "admin" | "sender" | "recipient";
  joinedAt: string;
}

interface Shipment {
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

interface DatabaseSchema {
  users: User[];
  shipments: Shipment[];
}

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Create folder and write seed file if not exists
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], shipments: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { users: [], shipments: [] };
  }
}

function writeDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Authentication Middleware
interface CustomRequest extends Request {
  userId?: string;
  userRole?: string;
}

function authenticateToken(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token is missing." });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

// ─── AUTH ENDPOINTS ───────────────────────────────────

// SIGN UP
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const db = readDB();
    const emailLower = email.toLowerCase();
    
    if (db.users.find(u => u.email.toLowerCase() === emailLower)) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newUser: User = {
      id: `USR-${String(db.users.length + 1).padStart(3, "0")}`,
      name,
      email: emailLower,
      passwordHash,
      avatar: initials || "U",
      role: "sender",
      joinedAt: new Date().toISOString().split("T")[0]
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });
    
    // Omit password hash in response
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// SIGN IN
app.post("/api/auth/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(400).json({ error: "No account found with this email address." });
    }

    // Hash check with fallback for simple migrations
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } catch {
      // Fallback in case of invalid salt structure
      isMatch = user.passwordHash === password;
    }
    
    // Explicit demo fallback
    if (!isMatch) {
      if (email.toLowerCase() === "admin@giftpin.com" && password === "admin123") isMatch = true;
      if (email.toLowerCase() === "john@example.com" && password === "password123") isMatch = true;
      if (email.toLowerCase() === "jane@example.com" && password === "password123") isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password. Please try again." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET CURRENT USER PROFILE
app.get("/api/auth/me", authenticateToken, (req: CustomRequest, res: Response) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// ─── SHIPMENTS ENDPOINTS ─────────────────────────────
 
// PUBLIC TRACKING ENDPOINT (Unauthenticated)
app.get("/api/shipments/track/:pin", (req: Request, res: Response) => {
  const { pin } = req.params;
  if (!pin) {
    return res.status(400).json({ error: "Tracking PIN is required." });
  }

  const db = readDB();
  const shipment = db.shipments.find(
    s => s.pin.toLowerCase() === pin.trim().toLowerCase()
  );

  if (!shipment) {
    return res.status(404).json({ error: "No shipment found with this tracking PIN." });
  }

  res.json(shipment);
});

// GET ALL OR USER-SPECIFIC SHIPMENTS
app.get("/api/shipments", authenticateToken, (req: CustomRequest, res: Response) => {
  const db = readDB();
  
  if (req.userRole === "admin") {
    // Admins see all shipments
    return res.json(db.shipments);
  }

  // Get current user email to filter shipments where user is sender or recipient
  const user = db.users.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const userEmail = user.email.toLowerCase();
  const userName = user.name.toLowerCase();

  // Filter shipments where the user's name matches sender/recipient or email context matches
  const filtered = db.shipments.filter(s => {
    const sender = s.sender.toLowerCase();
    const recipient = s.recipient.toLowerCase();
    
    // Match common formats (e.g., "John D." matches "John Doe")
    const firstName = user.name.split(" ")[0].toLowerCase();
    const lastInitial = user.name.split(" ")[1]?.charAt(0).toLowerCase() || "";
    const shortName = `${firstName} ${lastInitial}`.trim();

    return (
      sender.includes(firstName) || 
      recipient.includes(firstName) ||
      sender.includes(userEmail) ||
      recipient.includes(userEmail) ||
      sender.includes(shortName) ||
      recipient.includes(shortName)
    );
  });

  res.json(filtered);
});

// CREATE SHIPMENT
app.post("/api/shipments", authenticateToken, (req: CustomRequest, res: Response) => {
  const { recipient, origin, destination, courier, eta, value, insured, item, pin: customPin, id: customId, sender: customSender, status: customStatus, date: customDate } = req.body;
  
  if (!recipient || !origin || !destination || !courier || !eta || value === undefined) {
    return res.status(400).json({ error: "Missing required shipment fields." });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  // Generate PIN format like GP-1234-5678 if not provided by client
  let pin = customPin;
  if (!pin) {
    const pinPart1 = Math.floor(1000 + Math.random() * 9000);
    const pinPart2 = Math.floor(1000 + Math.random() * 9000);
    pin = `GP-${pinPart1}-${pinPart2}`;
  }

  // Format sender name if not provided
  let sender = customSender;
  if (!sender) {
    const nameParts = user.name.split(" ");
    sender = nameParts.length > 1 
      ? `${nameParts[0]} ${nameParts[1].charAt(0)}.` 
      : user.name;
  }

  const newShipment: Shipment = {
    id: customId || `SHP-${String(db.shipments.length + 1).padStart(3, "0")}`,
    pin,
    sender,
    recipient,
    origin,
    destination,
    status: customStatus || "Picked Up", // default initial status
    courier,
    date: customDate || new Date().toISOString().split("T")[0],
    eta,
    value: Number(value),
    insured: !!insured,
    item
  };

  db.shipments.unshift(newShipment); // Add to beginning
  writeDB(db);

  res.status(201).json(newShipment);
});

// UPDATE SHIPMENT STATUS (Admin/Courier update)
app.patch("/api/shipments/:id", authenticateToken, (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status field is required." });
  }

  const db = readDB();
  const index = db.shipments.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Shipment not found." });
  }

  // Optional: Restrict this to admin roles
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Only admins can update shipment status." });
  }

  db.shipments[index].status = status;
  writeDB(db);

  res.json(db.shipments[index]);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
