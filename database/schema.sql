-- 1. Students table
CREATE TABLE students (
    student_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hostels table
CREATE TABLE hostels (
    hostel_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
    total_rooms INTEGER NOT NULL CHECK (total_rooms >= 0),
    available_rooms INTEGER NOT NULL CHECK (
        available_rooms >= 0 AND available_rooms <= total_rooms
    ),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bookings table
CREATE TABLE bookings (
    booking_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id),
    hostel_id INTEGER NOT NULL REFERENCES hostels(hostel_id),
    check_in DATE NOT NULL CHECK (check_in >= CURRENT_DATE),
    nights INTEGER NOT NULL DEFAULT 1 CHECK (nights > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes to improve common searches
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_hostel ON bookings(hostel_id);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);