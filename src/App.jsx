import { useState, useEffect } from "react";
import { BedDouble } from "lucide-react";
import HostelCard from "./components/HostelCard";
import BookingForm from "./components/BookingForm";
import Header from "./components/Header";
import BookingHistory from "./components/BookingHistory";


export default function App() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
  async function fetchHostels() {
    try {
      const response = await fetch("http://localhost:5000/api/hostels");

      if (!response.ok) {
        throw new Error("Failed to load hostels.");
      }

      const data = await response.json();

      const formattedHostels = data.map((hostel) => ({
        id: hostel.hostel_id,
        name: hostel.name,
        location: hostel.location,
        price: Number(hostel.price_per_night),
        rooms: hostel.available_rooms,
        image: hostel.image_url,
      }));

      setHostels(formattedHostels);
    } catch (err) {
      setError("Could not load hostels. Check that the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchHostels();
}, []);
  const [search, setSearch] = useState("");
  const [booking, setBooking] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [nights, setNights] = useState(1);
  const [message, setMessage] = useState("");

  const filteredHostels = hostels.filter((hostel) =>
    `${hostel.name} ${hostel.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

 async function submitBooking(event) {
event.preventDefault();

if (!booking) {
  setMessage("Please select a hostel first.");
  return;
}

setMessage("Saving your booking...");

try {
  const response = await fetch("http://localhost:5000/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: studentName,
      email: studentEmail,
      phone: studentPhone,
      hostelId: booking.id,
      checkIn: checkIn,
      nights: Number(nights),
    }),
  });

  const responseText = await response.text();
console.log("Booking server response:", responseText);
const data = JSON.parse(responseText);

  if (!response.ok) {
    throw new Error(data.error || "Could not save your booking.");
  }

  setMessage(
    `Booking successful! Your booking ID is ${data.booking.booking_id}.`
  );

  setHostels((currentHostels) =>
    currentHostels.map((hostel) =>
      hostel.id === booking.id
        ? { ...hostel, rooms: Math.max(0, hostel.rooms - 1) }
        : hostel
    )
  );

  setStudentName("");
  setStudentEmail("");
  setStudentPhone("");
  setCheckIn("");
  setNights(1);
} catch (error) {
  setMessage(error.message || "Could not connect to the booking server.");
  console.error("Booking error:", error);
}

}

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header search={search} setSearch={setSearch} />

      <section className="bg-blue-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-extrabold sm:text-5xl">
            Find your perfect hostel
          </h2>
          <p className="mt-3 text-gray-600">
            Discover accommodation that suits your budget.
          </p>

          
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold">
          Available hostels
        </h2>

              {loading && (
              <p className="mb-4 text-gray-600">
                Loading hostels...
              </p>
            )}

            {error && (
              <p role="alert" className="mb-4 text-red-600">
                {error}
              </p>
            )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHostels.map((hostel) => (
          <HostelCard
           key={hostel.id}
           hostel={hostel}
           onBook={(item) => {
           setBooking(item);
           setMessage("");
   }}
  />
))}
        </div>

        <BookingHistory/>

        {filteredHostels.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            No hostels found. Try another search.
          </p>
        )}
      </main>
            <BookingForm
          booking={booking}
          studentName={studentName}
          setStudentName={setStudentName}
          studentEmail={studentEmail}
          setStudentEmail={setStudentEmail}
          studentPhone={studentPhone}
          setStudentPhone={setStudentPhone}
          nights={nights}
          setNights={setNights}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          message={message}
          onClose={() => setBooking(null)}
          onSubmit={submitBooking}
        />
    
    </div>
  );
}