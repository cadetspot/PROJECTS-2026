import { useEffect, useState } from "react";
import { Users, Building2, ClipboardList, BedDouble, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
const [stats, setStats] = useState({
hostels: 0,
students: 0,
bookings: 0,
availableRooms: 0,
});

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
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={23} />
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold text-slate-900">
                {card.value}
              </p>
            </article>
          );
        })}
      </div>
    )}

    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">
        Welcome, Administrator
      </h2>
      <p className="mt-2 text-slate-600">
        Use this dashboard to monitor hostels, students, bookings, and room
        availability. Management tools will be added in the next steps.
      </p>
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
  </div>
</section>
  );
}