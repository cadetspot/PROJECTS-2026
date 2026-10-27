import { useState } from "react";
import {
  Search,
  MapPin,
  BedDouble,
  Users,
  CalendarDays,
} from "lucide-react";

const hostels = [
  {
    id: 1,
    name: "Sunrise Student Hostel",
    location: "Nairobi",
    price: 800,
    rooms: 5,
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
  },
  {
    id: 2,
    name: "Green View Hostel",
    location: "Kutus",
    price: 600,
    rooms: 3,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
  },
  {
    id: 3,
    name: "Campus Comfort Hostel",
    location: "Nairobi",
    price: 1000,
    rooms: 0,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
  },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [booking, setBooking] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [message, setMessage] = useState("");

  const filteredHostels = hostels.filter((hostel) =>
    `${hostel.name} ${hostel.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function submitBooking(event) {
    event.preventDefault();

    setMessage(
      `Demo booking for ${studentName} at ${booking.name}. Connect a backend to save this booking.`
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-700 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <BedDouble />
            HostelFinder
          </h1>
          <span className="hidden sm:block">
            Student Accommodation
          </span>
        </div>
      </header>

      <section className="bg-blue-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-extrabold sm:text-5xl">
            Find your perfect hostel
          </h2>
          <p className="mt-3 text-gray-600">
            Discover accommodation that suits your budget.
          </p>

          <label className="mt-7 flex max-w-2xl items-center gap-3 rounded-xl border bg-white px-4">
            <Search className="text-gray-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search hostel or location..."
              className="w-full py-4 outline-none"
            />
          </label>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold">
          Available hostels
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHostels.map((hostel) => (
            <article
              key={hostel.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <img
                src={hostel.image}
                alt={hostel.name}
                className="h-48 w-full object-cover"
              />

              <div className="space-y-4 p-5">
                <h3 className="text-xl font-bold">
                  {hostel.name}
                </h3>

                <p className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  {hostel.location}
                </p>

                <p className="flex items-center gap-2 text-gray-600">
                  <Users size={18} />
                  {hostel.rooms} rooms available
                </p>

                <div className="flex items-center justify-between border-t pt-4">
                  <p className="font-bold text-blue-700">
                    KSh {hostel.price}
                    <span className="font-normal text-gray-500">
                      {" "}/ night
                    </span>
                  </p>

                  <button
                    disabled={hostel.rooms === 0}
                    onClick={() => {
                      setBooking(hostel);
                      setMessage("");
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Book now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredHostels.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            No hostels found. Try another search.
          </p>
        )}
      </main>

      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={submitBooking}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6"
          >
            <h2 className="text-2xl font-bold">
              Book {booking.name}
            </h2>

            <label className="block">
              Student name
              <input
                required
                value={studentName}
                onChange={(event) =>
                  setStudentName(event.target.value)
                }
                className="mt-1 w-full rounded-lg border p-3"
                placeholder="Enter your name"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2">
                <CalendarDays size={18} />
                Check-in date
              </span>
              <input
                required
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={checkIn}
                onChange={(event) =>
                  setCheckIn(event.target.value)
                }
                className="mt-1 w-full rounded-lg border p-3"
              />
            </label>

            <p className="font-semibold">
              Price: KSh {booking.price} per night
            </p>

            {message && (
              <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm">
                {message}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setBooking(null)}
                className="flex-1 rounded-lg border p-3"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 p-3 text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}