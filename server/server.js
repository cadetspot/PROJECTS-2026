import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "hostel_booking",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
});

app.get("/", (req, res) => {
  res.json({ message: "Hostel Booking API is running!" });
});

app.get("/api/hostels", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM hostels ORDER BY hostel_id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch hostels:", error.message);
    res.status(500).json({
      error: "Failed to fetch hostels",
    });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "OK",
      database: "Connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      status: "ERROR",
      database: "Not connected",
    });
  }
});
app.post("/api/bookings", async (req, res) => {
  console.log("POST /api/bookings route reached");
const { name, email, phone, hostelId, checkIn, nights } = req.body;

if (
!name?.trim() ||
!email?.trim() ||
!hostelId ||
!checkIn ||
!Number.isInteger(Number(nights)) ||
Number(nights) < 1
) {
return res.status(400).json({
error: "Please provide a name, email, hostel, check-in date, and valid number of nights.",
});
}

const client = await pool.connect();

try {
await client.query("BEGIN");

const roomResult = await client.query(
  `UPDATE hostels
   SET available_rooms = available_rooms - 1
   WHERE hostel_id = $1 AND available_rooms > 0
   RETURNING hostel_id`,
  [hostelId]
);

if (roomResult.rowCount === 0) {
  await client.query("ROLLBACK");
  return res.status(409).json({
    error: "This hostel has no available rooms.",
  });
}

const studentResult = await client.query(
  `INSERT INTO students (full_name, email, phone)
   VALUES ($1, $2, $3)
   ON CONFLICT (email)
   DO UPDATE SET
     full_name = EXCLUDED.full_name,
     phone = EXCLUDED.phone
   RETURNING student_id`,
  [name.trim(), email.trim().toLowerCase(), phone?.trim() || null]
);

const studentId = studentResult.rows[0].student_id;

const bookingResult = await client.query(
"INSERT INTO bookings (student_id, hostel_id, check_in, nights, total_price) SELECT $1, h.hostel_id, $3,$4::INTEGER,h.price_per_night * $4::INTEGER FROM hostels h WHERE h.hostel_id = $2 RETURNING booking_id, student_id, hostel_id, check_in, nights, total_price, status",
[studentId, hostelId, checkIn, Number(nights)]
);

await client.query("COMMIT");

res.status(201).json({
  message: "Booking saved successfully!",
  booking: bookingResult.rows[0],
});

} catch (error) {
await client.query("ROLLBACK");
console.error("Booking failed:", error.message);

if (error.code === "23514" || error.code === "23503") {
  return res.status(400).json({
    error: "Invalid booking details or check-in date.",
  });
}

res.status(500).json({
  error: "Could not save the booking. Please try again.",
});

} finally {
client.release();
}
});

app.get("/api/test-booking-route", (req, res) => {
  res.json({ message: "Booking routes are registered!" });
});
app.get("/api/bookings", async (req, res) => {
try {
const result = await pool.query("SELECT b.booking_id, s.full_name, s.email, h.name AS hostel_name, h.location, b.check_in, b.nights, b.total_price, b.status, b.created_at FROM bookings b JOIN students s ON b.student_id = s.student_id JOIN hostels h ON b.hostel_id = h.hostel_id ORDER BY b.created_at DESC");

res.json(result.rows);

} catch (error) {
console.error("Failed to fetch bookings:", error.message);

res.status(500).json({
  error: "Failed to fetch bookings",
});

}
});

app.patch("/api/bookings/:id/cancel", async (req, res) => {
const bookingId = Number(req.params.id);

if (!Number.isInteger(bookingId) || bookingId < 1) {
return res.status(400).json({
error: "Invalid booking ID.",
});
}

const client = await pool.connect();

try {
await client.query("BEGIN");

const bookingResult = await client.query(
  `SELECT booking_id, hostel_id, status
   FROM bookings
   WHERE booking_id = $1
   FOR UPDATE`,
  [bookingId]
);

if (bookingResult.rowCount === 0) {
  await client.query("ROLLBACK");

  return res.status(404).json({
    error: "Booking not found.",
  });
}

const booking = bookingResult.rows[0];

if (booking.status === "cancelled") {
  await client.query("ROLLBACK");

  return res.status(409).json({
    error: "This booking has already been cancelled.",
  });
}

await client.query(
  `UPDATE bookings
   SET status = 'cancelled'
   WHERE booking_id = $1`,
  [bookingId]
);

await client.query(
  `UPDATE hostels
   SET available_rooms = LEAST(total_rooms, available_rooms + 1)
   WHERE hostel_id = $1`,
  [booking.hostel_id]
);

await client.query("COMMIT");

res.json({
  message: "Booking cancelled successfully. One room has been restored.",
  bookingId,
  status: "cancelled",
});

} catch (error) {
await client.query("ROLLBACK");

console.error("Cancellation failed:", error.message);

res.status(500).json({
  error: "Could not cancel the booking.",
});

} finally {s
client.release();
}
});

app.listen(PORT, () => {
  console.log(`Hostel Booking API running at http://localhost:${PORT}`);
});