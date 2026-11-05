import { useEffect, useState } from "react";
import { Users, Building2, ClipboardList, BedDouble, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
const [stats, setStats] = useState({
hostels: 0,
students: 0,
bookings: 0,
availableRooms: 0,
});

const [recentBookings, setRecentBookings] = useState([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [activeSection, setActiveSection] = useState("Dashboard");

async function loadDashboard() {
setLoading(true);
setError("");

try {
  const [hostelsResponse, bookingsResponse] = await Promise.all([
    fetch("http://localhost:5000/api/hostels"),
    fetch("http://localhost:5000/api/bookings"),
  ]);

  if (!hostelsResponse.ok || !bookingsResponse.ok) {
    throw new Error("Could not load dashboard information.");
  }

  const hostels = await hostelsResponse.json();
  const bookings = await bookingsResponse.json();
  
  setRecentBookings(
  [...bookings].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  ).slice(0, 5)
);

  const students = new Set(
    bookings.map((booking) => booking.email).filter(Boolean)
  );

  setStats({
    hostels: hostels.length,
    students: students.size,
    bookings: bookings.length,
    availableRooms: hostels.reduce(
      (total, hostel) =>
        total + Number(hostel.available_rooms ?? hostel.availableRooms ?? 0),
      0
    ),
  });
} catch (err) {
  setError(err.message || "Something went wrong.");
} finally {
  setLoading(false);
}

}

useEffect(() => {
loadDashboard();
}, []);

const cards = [
{
title: "Total Hostels",
value: stats.hostels,
icon: Building2,
},
{
title: "Registered Students",
value: stats.students,
icon: Users,
},
{
title: "Total Bookings",
value: stats.bookings,
icon: ClipboardList,
},
{
title: "Available Rooms",
value: stats.availableRooms,
icon: BedDouble,
},
];

return (
<section className="min-h-screen bg-slate-100">
  <div className="flex min-h-screen flex-col md:flex-row">
    <aside className="w-full bg-slate-900 p-6 text-white md:w-64">
      <h2 className="mb-8 text-xl font-bold">Hostel Admin</h2>

      <nav className="space-y-3">
        
      <button
        onClick={() => setActiveSection("Dashboard")}
        className={`block w-full rounded-lg px-4 py-3 text-left ${
                        activeSection === "Dashboard" ? "bg-blue-600" : "hover:bg-slate-700"
                        }`}
        >
        Dashboard
        </button>

            <button
        onClick={() => setActiveSection("Manage Hostels")}
        className={`block w-full rounded-lg px-4 py-3 text-left ${
            activeSection === "Manage Hostels"
            ? "bg-blue-600"
            : "hover:bg-slate-700"
        }`}
        >
        Manage Hostels
        </button>

       <button
            onClick={() => setActiveSection("Manage Bookings")}
            className={`block w-full rounded-lg px-4 py-3 text-left ${
              activeSection === "Manage Bookings"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            Manage Bookings
          </button>

       <button
        onClick={() => setActiveSection("Manage Students")}
        className={`block w-full rounded-lg px-4 py-3 text-left ${
            activeSection === "Manage Students"
            ? "bg-blue-600"
            : "hover:bg-slate-700"
        }`}
        >
        Manage Students
        </button>
      </nav>
    </aside>

    <div className="min-w-0 flex-1 p-6 md:p-10"></div>
<div className="mx-auto max-w-7xl">
<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
<div>
<p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
Hostel Booking System
</p>
<h1 className="mt-2 text-3xl font-bold text-slate-900">
  {activeSection === "Dashboard" ? "Admin Dashboard" : activeSection}
</h1>
<p className="mt-2 text-slate-600">
Overview of your hostel booking system.
</p>
</div>

      <button
        onClick={loadDashboard}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        <RefreshCw size={18} />
        Refresh
      </button>
    </div>

    {error && (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )}

    {loading ? (
      <p className="rounded-lg bg-white p-6 text-slate-600">
        Loading dashboard...
      </p>
    ) : (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="group rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={23} />
                </div>
              </div>

             <p className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
                {card.value}
              </p>
            </article>
          );
        })}
      </div>
    )}
     <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
  <div className="border-b border-slate-200 p-6">
    <h2 className="text-xl font-bold text-slate-900">
      Recent Bookings
    </h2>
    <p className="mt-1 text-sm text-slate-500">
      The five most recently created bookings.
    </p>
  </div>

  {recentBookings.length === 0 ? (
    <p className="p-6 text-slate-500">
      No bookings found yet.
    </p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 font-semibold">Booking ID</th>
            <th className="px-6 py-4 font-semibold">Student</th>
            <th className="px-6 py-4 font-semibold">Hostel</th>
            <th className="px-6 py-4 font-semibold">Check-in Date</th>
            <th className="px-6 py-4 font-semibold">Total Price</th>
            <th className="px-6 py-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {recentBookings.map((booking) => (
            <tr key={booking.booking_id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">
                #{booking.booking_id}
              </td>
              <td className="px-6 py-4 text-slate-700">
                {booking.full_name || booking.student_name || booking.email || "Student"}
              </td>
              <td className="px-6 py-4 text-slate-700">
                {booking.hostel_name || booking.name || "Hostel"}
              </td>
              <td className="px-6 py-4 text-slate-700">
              {booking.check_in
                ? new Date(booking.check_in).toLocaleDateString()
                : "Not set"}
              </td>
              <td className="px-6 py-4 font-semibold text-slate-900">
                {booking.total_price != null
                  ? `KSh ${Number(booking.total_price).toLocaleString()}`
                  : "Not available"}
              </td>
              <td className="px-6 py-4">
                <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                booking.status?.toLowerCase() === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : booking.status?.toLowerCase() === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : booking.status?.toLowerCase() === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-700"
              }`}
              > 
                {booking.status || "Unknown"}
              </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">
        Welcome, Administrator
      </h2>
      <p className="mt-2 text-slate-600">
        Use this dashboard to monitor hostels, students, bookings, and room
        availability. Management tools will be added in the next steps.
      </p>
      </div>
    </div>
  </div>
</section>
  );
}