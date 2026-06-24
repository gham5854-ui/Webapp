import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "giftpin-super-secret-key-12345";

// ─── POSTGRES POOL ────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

// ─── TYPES ────────────────────────────────────────────
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

// ─── DB INIT & SEED ───────────────────────────────────
async function initDB() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id           VARCHAR(20)  PRIMARY KEY,
        name         VARCHAR(255) NOT NULL,
        email        VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar       VARCHAR(10),
        role         VARCHAR(20)  DEFAULT 'sender',
        joined_at    VARCHAR(20)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS shipments (
        id          VARCHAR(20)  PRIMARY KEY,
        pin         VARCHAR(30)  UNIQUE NOT NULL,
        sender      VARCHAR(255),
        recipient   VARCHAR(255),
        origin      VARCHAR(255),
        destination VARCHAR(255),
        status      VARCHAR(50),
        courier     VARCHAR(100),
        date        VARCHAR(20),
        eta         VARCHAR(20),
        value       NUMERIC,
        insured     BOOLEAN DEFAULT false,
        item        VARCHAR(255)
      )
    `);

    // Seed users if empty
    const { rows: userRows } = await client.query("SELECT COUNT(*) FROM users");
    if (parseInt(userRows[0].count) === 0) {
      await client.query(`
        INSERT INTO users (id, name, email, password_hash, avatar, role, joined_at) VALUES
        ('USR-001', 'Admin User',  'admin@giftpin.com', '$2a$10$3zZ2h9QJ9Z8O8K8H8S8H8u8e2c2H0.2nU19f8qTj1o3x9c8C/C4/S', 'AU', 'admin',  '2024-01-15'),
        ('USR-002', 'John Doe',   'john@example.com',  '$2a$10$6zZ2h9QJ9Z8O8K8H8S8H8u8e2c2H0.2nU19f8qTj1o3x9c8C/C4/S', 'JD', 'sender', '2024-03-20'),
        ('USR-003', 'Jane Smith', 'jane@example.com',  '$2a$10$6zZ2h9QJ9Z8O8K8H8S8H8u8e2c2H0.2nU19f8qTj1o3x9c8C/C4/S', 'JS', 'sender', '2024-06-10')
        ON CONFLICT (id) DO NOTHING
      `);
    }

    // Seed shipments if empty
    const { rows: shipRows } = await client.query("SELECT COUNT(*) FROM shipments");
    if (parseInt(shipRows[0].count) === 0) {
      await client.query(`
        INSERT INTO shipments (id, pin, sender, recipient, origin, destination, status, courier, date, eta, value, insured, item) VALUES
        ('SHP-302', 'GP-5636-7103', 'John Doe',    'Sarah',       'London, UK',     'United States',    'Out For Delivery', 'DHL',    '2026-06-22', '2026-06-26', 45,  true,  'Premium Roses Bouquet'),
        ('SHP-001', 'GP-8472-9184', 'Alice M.',    'Bob K.',      'London, UK',     'Lagos, NG',        'In Transit',       'DHL',    '2025-03-15', '2025-03-18', 149, true,  'Premium Roses Bouquet'),
        ('SHP-002', 'GP-1293-7645', 'John D.',     'Maria S.',    'New York, US',   'Madrid, ES',       'Delivered',        'FedEx',  '2025-03-10', '2025-03-14', 89,  false, 'Belgian Chocolate Box'),
        ('SHP-003', 'GP-5512-3389', 'Jane S.',     'Takashi H.', 'Sydney, AU',     'Tokyo, JP',        'Customs',          'EMS',    '2025-03-14', '2025-03-20', 299, true,  'Smart Watch Pro'),
        ('SHP-004', 'GP-7783-2210', 'David L.',    'Sarah W.',    'Berlin, DE',     'Dubai, AE',        'Picked Up',        'UPS',    '2025-03-16', '2025-03-19', 199, true,  'Designer Perfume'),
        ('SHP-005', 'GP-3344-5566', 'Emily R.',    'Carlos M.',   'Paris, FR',      'Buenos Aires, AR', 'Out For Delivery', 'DHL',    '2025-03-12', '2025-03-17', 59,  false, 'Luxury Gift Card'),
        ('SHP-006', 'GP-9988-7766', 'Michael C.',  'Aisha K.',    'Toronto, CA',    'Nairobi, KE',      'Delayed',          'Aramex', '2025-03-08', '2025-03-16', 449, true,  'Smart Watch Pro'),
        ('SHP-007', 'GP-4455-3322', 'Sarah J.',    'Liam N.',     'Dublin, IE',     'Mumbai, IN',       'Packed',           'FedEx',  '2025-03-17', '2025-03-22', 79,  false, 'Personalized Photo Frame'),
        ('SHP-008', 'GP-1122-3344', 'Robert P.',   'Yuki T.',     'Singapore, SG',  'Seoul, KR',        'In Transit',       'UPS',    '2025-03-13', '2025-03-16', 189, true,  'Premium Roses Bouquet')
        ON CONFLICT (id) DO NOTHING
      `);
    }

    console.log("✅ Database initialized and ready.");
  } finally {
    client.release();
  }
}

// ─── ROW MAPPERS ─────────────────────────────────────
function rowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    avatar: row.avatar,
    role: row.role,
    joinedAt: row.joined_at,
  };
}

function rowToShipment(row: any): Shipment {
  return {
    id: row.id,
    pin: row.pin,
    sender: row.sender,
    recipient: row.recipient,
    origin: row.origin,
    destination: row.destination,
    status: row.status,
    courier: row.courier,
    date: row.date,
    eta: row.eta,
    value: parseFloat(row.value),
    insured: row.insured,
    item: row.item,
  };
}

// ─── MIDDLEWARE ──────────────────────────────────────
app.use(cors({
  origin: "*", // Update to your Vercel URL for production, e.g. "https://your-app.vercel.app"
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

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

    const emailLower = email.toLowerCase();

    // Check existing email
    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [emailLower]
    );
    if (existing.length > 0) {
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

    // Generate next user ID
    const { rows: countRows } = await pool.query("SELECT COUNT(*) FROM users");
    const nextId = `USR-${String(parseInt(countRows[0].count) + 1).padStart(3, "0")}`;

    const joinedAt = new Date().toISOString().split("T")[0];

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, avatar, role, joined_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nextId, name, emailLower, passwordHash, initials || "U", "sender", joinedAt]
    );

    const newUser: Omit<User, "passwordHash"> = {
      id: nextId, name, email: emailLower,
      avatar: initials || "U", role: "sender", joinedAt,
    };

    const token = jwt.sign({ id: nextId, role: "sender" }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: newUser });
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

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = $1",
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "No account found with this email address." });
    }

    const user = rowToUser(rows[0]);

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } catch {
      isMatch = user.passwordHash === password;
    }

    // Demo fallback
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

// GET CURRENT USER
app.get("/api/auth/me", authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const user = rowToUser(rows[0]);
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ─── SHIPMENTS ENDPOINTS ──────────────────────────────

// PUBLIC TRACKING (no auth)
app.get("/api/shipments/track/:pin", async (req: Request, res: Response) => {
  const { pin } = req.params;
  if (!pin) {
    return res.status(400).json({ error: "Tracking PIN is required." });
  }
  try {
    const { rows } = await pool.query(
      "SELECT * FROM shipments WHERE LOWER(pin) = $1",
      [pin.trim().toLowerCase()]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "No shipment found with this tracking PIN." });
    }
    res.json(rowToShipment(rows[0]));
  } catch (error) {
    console.error("Track error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET ALL OR USER-SPECIFIC SHIPMENTS
app.get("/api/shipments", authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    if (req.userRole === "admin") {
      const { rows } = await pool.query("SELECT * FROM shipments ORDER BY date DESC");
      return res.json(rows.map(rowToShipment));
    }

    const { rows: userRows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = rowToUser(userRows[0]);
    const firstName = user.name.split(" ")[0].toLowerCase();
    const lastInitial = user.name.split(" ")[1]?.charAt(0).toLowerCase() || "";
    const shortName = `${firstName} ${lastInitial}`.trim();

    const { rows } = await pool.query(
      `SELECT * FROM shipments
       WHERE LOWER(sender)    LIKE $1
          OR LOWER(recipient) LIKE $1
          OR LOWER(sender)    LIKE $2
          OR LOWER(recipient) LIKE $2
       ORDER BY date DESC`,
      [`%${firstName}%`, `%${shortName}%`]
    );

    res.json(rows.map(rowToShipment));
  } catch (error) {
    console.error("Get shipments error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// CREATE SHIPMENT
app.post("/api/shipments", authenticateToken, async (req: CustomRequest, res: Response) => {
  const {
    recipient, origin, destination, courier, eta, value, insured, item,
    pin: customPin, id: customId, sender: customSender,
    status: customStatus, date: customDate,
  } = req.body;

  if (!recipient || !origin || !destination || !courier || !eta || value === undefined) {
    return res.status(400).json({ error: "Missing required shipment fields." });
  }

  try {
    const { rows: userRows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const user = rowToUser(userRows[0]);

    // PIN generation
    let pin = customPin;
    if (!pin) {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      pin = `GP-${p1}-${p2}`;
    }

    // Sender name
    let sender = customSender;
    if (!sender) {
      const parts = user.name.split(" ");
      sender = parts.length > 1 ? `${parts[0]} ${parts[1].charAt(0)}.` : user.name;
    }

    // Generate ID
    let id = customId;
    if (!id) {
      const { rows: countRows } = await pool.query("SELECT COUNT(*) FROM shipments");
      id = `SHP-${String(parseInt(countRows[0].count) + 1).padStart(3, "0")}`;
    }

    const date = customDate || new Date().toISOString().split("T")[0];
    const status = customStatus || "Picked Up";

    await pool.query(
      `INSERT INTO shipments (id, pin, sender, recipient, origin, destination, status, courier, date, eta, value, insured, item)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [id, pin, sender, recipient, origin, destination, status, courier, date, eta, Number(value), !!insured, item]
    );

    const newShipment: Shipment = {
      id, pin, sender, recipient, origin, destination,
      status, courier, date, eta,
      value: Number(value), insured: !!insured, item,
    };

    res.status(201).json(newShipment);
  } catch (error) {
    console.error("Create shipment error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// UPDATE SHIPMENT STATUS (Admin only)
app.patch("/api/shipments/:id", authenticateToken, async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status field is required." });
  }

  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Only admins can update shipment status." });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE shipments SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Shipment not found." });
    }
    res.json(rowToShipment(rows[0]));
  } catch (error) {
    console.error("Update shipment error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ─── HEALTH CHECK ─────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ─── START ────────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
