import { CalendarDays } from "lucide-react";

export default function BookingForm({
 booking,
studentName,
setStudentName,
studentEmail,
setStudentEmail,
studentPhone,
setStudentPhone,
nights,
setNights,
checkIn,
setCheckIn,
message,
onClose,
onSubmit,
}) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <form
        onSubmit={onSubmit}
        className="my-auto w-full max-w-md space-y-4 rounded-2xl bg-white p-6"
      >
        <h2 className="text-2xl font-bold">
          Book {booking.name}
        </h2>

        <label className="block">
          Student name
          <input
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your name"
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        <label className="block">
          Student email
          <input
            required
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        <label className="block">
          Phone number
          <input
            type="tel"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        <label className="block">
          Number of nights
          <input
            required
            type="number"
            min="1"
            value={nights}
            onChange={(e) => setNights(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border p-3"
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
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        <div className="space-y-2 rounded-xl bg-blue-50 p-4">
          <p className="text-gray-700">
            Price per night:{" "}
            <strong>
              KSh {Number(booking.price).toLocaleString()}
            </strong>
          </p>      <p className="text-gray-700">
        Number of nights: <strong>{nights}</strong>
      </p>

      <div className="border-t border-blue-200 pt-2">
        <p className="text-lg font-bold text-blue-800">
          Total price: KSh{" "}
          {(Number(booking.price) * Number(nights || 0)).toLocaleString()}
        </p>
      </div>
    </div>

        {message && (
          <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm">
            {message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
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
  );
}