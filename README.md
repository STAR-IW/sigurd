# Real-time class Booking System

Real-time class booking platform with automatic waitlist management, live capacity updates via WebSockets, and distributed locking for concurrent bookings.

##  Features

- **JWT Authentication** - Secure user registration and login with role-based access control
- **Class Management** - CRUD operations for gym classes with instructor assignments
- **Smart Booking System** - Redis distributed locks prevent double-booking
- **Automatic Waitlist** - Users auto-added to waitlist when class is full
- **Auto-Promotion** - Waitlist users automatically promoted when spots open
- **Real-time Updates** - WebSocket notifications for capacity changes and promotions
- **Redis Caching** - Fast capacity lookups with 60-second TTL
- **Comprehensive API** - RESTful endpoints with Swagger documentation

##  Tech Stack

**Backend:**
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL (database)
- Prisma ORM
- Redis (caching & pub/sub)
- Socket.io (WebSockets)
- JWT (authentication)
- Docker & Docker Compose

**Testing:**
- Jest
- Supertest (E2E testing)

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Git

## Architecture
```
Client → NestJS API (JWT Auth, REST endpoints)
    ├── PostgreSQL (data persistence)
    ├── Redis (caching, distributed locks, pub/sub)
    ├── WebSocket Gateway (real-time updates)
    └── Prisma ORM (database queries)
```

## Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd gym-booking-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env` file in root:
```env
Use the .env.example file
```

### 4. Start Docker Services
```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- pgAdmin (port 5050)
- RedisInsight (port 8001)

### 5. Run Migrations
```bash
npx prisma migrate dev
```

### 6. Seed Database
```bash
npx prisma db seed
```

Creates:
- 2 admins
- 5 students
- 3 instructors
- 20 sample classes

**Seeded credentials:**
- Admin: `admin@gym.com` / `password123`
- Student: `student@gym.com` / `password123`

### 7. Start Application
```bash
npm run start:dev
```

Server runs on: `http://localhost:3000`

## API Documentation

Interactive Swagger documentation available at:
```
http://localhost:3000/api
```

### Key Endpoints

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

**Classes:**
- `GET /classes` - List all classes (with filters)
- `POST /classes` - Create class (admin/instructor only)
- `GET /classes/:id/capacity` - Get real-time capacity
- `GET /classes/instructor/:id/schedule` - Get instructor's schedule

**Bookings:**
- `POST /booking` - Book a class (or join waitlist if full)
- `GET /booking` - Get user's bookings
- `DELETE /booking/:id` - Cancel booking (triggers auto-promotion)
- `GET /booking/all` - Get all bookings (admin only)

**Waitlist:**
- `GET /waitlist` - Get user's waitlists
- `GET /waitlist/class/:id` - Get class waitlist (admin/instructor)
- `DELETE /waitlist/:id` - Leave waitlist

##  Testing

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Unit Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:cov
```

## WebSocket Events

Connect to: `ws://localhost:3000/events`

**Client Events:**
- `join-class` - Join class room for updates
```javascript
  socket.emit('join-class', { classId: 5 });
```
- `leave-class` - Leave class room
```javascript
  socket.emit('leave-class', { classId: 5 });
```

**Server Events:**
- `capacity-updated` - Real-time capacity changes
```javascript
  socket.on('capacity-updated', (data) => {
    // data: { classId, currentBookings, capacity, promotedUserId?, timestamp }
  });
```

## Security Features

- JWT authentication with bearer tokens
- Password hashing with bcrypt (12 salt rounds)
- Role-based access control (ADMIN, INSTRUCTOR, STUDENT)
- Global validation pipe (whitelist, transform)
- Redis distributed locks for race condition prevention
- CORS enabled (configure for production)

## Database Schema

**Models:**
- User (authentication & profiles)
- Instructor (1-to-1 with User)
- Class (gym classes with capacity tracking)
- Booking (user bookings with status)
- Waitlist (queue management with positions)

View schema: `prisma/schema.prisma`

## Key Features Explained

### Distributed Locking
Uses Redis SET NX (set if not exists) to prevent double-booking:
```
Lock key: booking:spot:{classId}
TTL: 10 seconds
```

### Auto-Waitlist Enrollment
When booking a full class, users are automatically added to waitlist instead of receiving an error.

### Auto-Promotion
When a booking is cancelled:
1. First person in waitlist is promoted
2. Booking created automatically
3. Waitlist entry deleted
4. Remaining positions updated
5. Real-time event broadcast to all clients

### Redis Caching
Class capacity cached for 60 seconds to reduce database load on high-traffic endpoints.

## Deployment


**Live Demo:** [https://sigurd.onrender.com/api](https://sigurd.onrender.com/api)

### Render Deployment (Free)

**Requirements:**
- GitHub repository
- Render account 

**Steps:**
1. **Create Services:**
    - PostgreSQL database (free tier)
    - Redis instance (free tier)
    - Web Service connected to GitHub

2. **Environment Variables:**
    - `DATABASE_URL` - From Render PostgreSQL
    - `REDIS_URL` - From Render Redis
    - `JWT_SECRET` - Generate secure key

3. **Build Settings:**
    - Build Command: `npm install && npm run build:render`
    - Start Command: `node dist/src/main.js`

4. **Auto-deploy enabled** - pushes to `main` trigger deployment


## License



## Author

Itai - [GitHub](https://github.com/STAR-IW)

---

