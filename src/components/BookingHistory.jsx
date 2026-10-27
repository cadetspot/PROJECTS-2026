import { useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";

export default function BookingHistory() {
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

async function cancelBooking(bookingId) {
const confirmed = window.confirm(
"Are you sure you want to cancel this booking?"
);

if (!confirmed) return;

try {
  const response = await fetch(
    `http://localhost:5000/api/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to cancel booking.");
  }

  await fetchBookings();

  window.alert("Booking cancelled successfully!");
} catch (err) {
  window.alert(err.message || "Could not cancel booking.");
  console.error("Cancellation error:", err);
}

}

async function fetchBookings() {
setLoading(true);
setError("");

try {
  const response = await fetch("http://localhost:5000/api/bookings");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load bookings.");
  }

  setBookings(data);
} catch (err) {
  setError("Could not load booking history. Check that the backend is running.");
  console.error("Booking history error:", err);
} finally {
  setLoading(false);
}

}

useEffect(() => {
fetchBookings();
}, []);

return (
<section className="mt-12 rounded-2xl bg-white p-6 shadow-sm">
<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
<div>
<h2 className="text-2xl font-bold text-gray-900">
Booking History
</h2>
<p className="mt-1 text-gray-600">
View bookings saved in the database.
</p>
</div>

    <button
      type="button"
      onClick={fetchBookings}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border px-4 py-2 disabled:opacity-50"
    >
      <RefreshCw size={18} />
      Refresh
    </button>
  </div>

  {loading && <p className="text-gray-600">Loading bookings...</p>}

  {error && (
    <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
      {error}
    </p>
  )}

  {!loading && !error && bookings.length === 0 && (
    <p className="rounded-lg bg-gray-50 p-4 text-gray-600">
      No bookings have been made yet.
    </p>
  )}

  {!loading && !error && bookings.length > 0 && (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <article
          key={booking.booking_id}
          className="rounded-xl border p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.hostel_name}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.location}
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm capitalize text-blue-700">
              {booking.status}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              <strong>Booking ID:</strong> {booking.booking_id}
            </p>

            <p>
              <strong>Student:</strong> {booking.full_name}
            </p>

            <p>
              <strong>Email:</strong> {booking.email}
            </p>

            <p className="flex items-center gap-2">
              <CalendarDays size={16} />
              <strong>Check-in:</strong>{" "}
              {new Date(`${String(booking.check_in).slice(0, 10)}T00:00:00`).toLocaleDateString()}
            </p>

            <p>
              <strong>Length of stay:</strong> {booking.nights}{" "}
              {booking.nights === 1 ? "night" : "nights"}
            </p>
            <p>
            Total Price: KSh {Number(booking.total_price ?? 0).toLocaleString()}
            </p>
          </div>
          {booking.status !== "cancelled" && (
            <button
            type="button"
            onClick={() => cancelBooking(booking.booking_id)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
            Cancel Booking
            </button>
            )}
        </article>
      ))}
    </div>
  )}
</section>

);
}