import { BedDouble, Search } from "lucide-react";

export default function Header({ search, setSearch }) {
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <BedDouble size={30} className="text-blue-600" />

          <h1 className="text-xl font-bold text-gray-900">
            Hostel Booking System
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search hostels by name or location..."
            className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  );
}