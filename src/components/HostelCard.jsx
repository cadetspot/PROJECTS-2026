import { MapPin, Users } from "lucide-react";

export default function HostelCard({ hostel, onBook }) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <img
        src={hostel.image}
        alt={hostel.name}
        className="h-48 w-full object-cover"
      />

      <div className="space-y-4 p-5">
        <h3 className="text-xl font-bold">{hostel.name}</h3>

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
            onClick={() => onBook(hostel)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            Book now
          </button>
        </div>
      </div>
    </article>
  );
}