# Real-Time Booking System - Architecture Diagram



## Detailed Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Swagger UI     │  Postman     │  WebSocket Client  │  Frontend (Future)   │
│  /api/docs      │  REST Calls  │  Real-time Updates │  React/Vue/Angular   │
└─────────────────┴──────────────┴────────────────────┴──────────────────────┘
                                    │
                          ┌─────────┴─────────┐
                          │                   │
                      HTTP/HTTPS        WebSocket (Socket.io)
                          │                   │
┌─────────────────────────┴─────────────────────────────────────────────────────┐
│                           NESTJS APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  HTTP GATEWAY   │  │ WEBSOCKET GATEWAY│  │ GLOBAL FILTERS  │              │
│  │                 │  │                 │  │                 │              │
│  │ • CORS Config   │  │ • Socket.io     │  │ • Exception     │              │
│  │ • Rate Limiting │  │ • Room Mgmt     │  │ • Validation    │              │
│  │ • Security      │  │ • Event Broadcast│  │ • Transform     │              │
│  │ • Swagger       │  └─────────────────┘  └─────────────────┘              │
│  └─────────────────┘                                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                         AUTHENTICATION & AUTHORIZATION                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   JWT STRATEGY  │  │   JWT GUARD     │  │   ROLES GUARD   │              │
│  │                 │  │                 │  │                 │              │
│  │ • Token Valid.  │  │ • Route Protect.│  │ • ADMIN         │              │
│  │ • User Extract. │  │ • @UseGuards()  │  │ • INSTRUCTOR    │              │
│  │ • Payload Parse │  │ • Unauthorized  │  │ • STUDENT       │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                            CONTROLLERS LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │AuthController│ │ClassController│ │BookController│ │WaitController│        │
│ │              │ │              │ │              │ │              │        │
│ │• POST /auth/ │ │• GET /classes│ │• POST /book  │ │• GET /wait   │        │
│ │  register    │ │• POST /class │ │• DELETE /book│ │• POST /wait  │        │
│ │• POST /auth/ │ │• GET /:id/   │ │• GET /book   │ │• DELETE /wait│        │
│ │  login       │ │  capacity    │ │• GET /all    │ │              │        │
│ │• GET /auth/  │ │• GET /instr/ │ │              │ │              │        │
│ │  profile     │ │  :id/sched   │ │              │ │              │        │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                           BUSINESS LOGIC LAYER                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ AuthService  │ │ClassService  │ │BookService   │ │WaitService   │        │
│ │              │ │              │ │              │ │              │        │
│ │• Hash Passwords│ • CRUD Ops   │ │• Create Book │ │• Join Wait   │        │
│ │• Generate JWT │ │• Capacity    │ │• Cancel Book │ │• Promote User│        │
│ │• Validate User│ │• Cache Mgmt  │ │• Validation  │ │• Position Mgmt│       │
│ │• User Creation│ │• Filters     │ │• Redis Locks │ │• Leave Wait  │        │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│           REDIS LAYER           │   │        POSTGRESQL LAYER         │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│                                 │   │                                 │
│ ┌─────────────────────────────┐ │   │ ┌─────────────────────────────┐ │
│ │         CACHING             │ │   │ │        DATA MODELS          │ │
│ │                             │ │   │ │                             │ │
│ │ • class:capacity:{id}       │ │   │ │ • User (authentication)     │ │
│ │ • TTL: 60 seconds           │ │   │ │ • Instructor (profiles)     │ │
│ │ • JSON serialization        │ │   │ │ • Class (gym classes)       │ │
│ │ • Fast lookups              │ │   │ │ • Booking (reservations)    │ │
│ └─────────────────────────────┘ │   │ │ • Waitlist (queue mgmt)     │ │
│                                 │   │ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │   │                                 │
│ │      DISTRIBUTED LOCKS      │ │   │ ┌─────────────────────────────┐ │
│ │                             │ │   │ │         PRISMA ORM          │ │
│ │ • booking:spot:{classId}    │ │   │ │                             │ │
│ │ • TTL: 10 seconds           │ │   │ │ • Type-safe queries         │ │
│ │ • SET NX pattern            │ │   │ │ • Migration system          │ │
│ │ • Prevent race conditions   │ │   │ │ • Connection pooling        │ │
│ └─────────────────────────────┘ │   │ │ • Transaction support       │ │
│                                 │   │ • Schema generation         │ │
│ ┌─────────────────────────────┐ │   │ └─────────────────────────────┘ │
│ │        PUB/SUB              │ │   │                                 │
│ │                             │ │   └─────────────────────────────────┘
│ │ • class:updates channel     │ │
│ │ • Real-time broadcasting    │ │
│ │ • Event-driven architecture │ │
│ │ • WebSocket notifications   │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BOOKING FLOW EXAMPLE                            │
└─────────────────────────────────────────────────────────────────────────────┘

1. USER MAKES BOOKING REQUEST
   ┌─────────┐    HTTP POST /booking    ┌─────────────┐
   │ Client  │ ────────────────────────→ │ BookingCtrl │
   └─────────┘      { classId: 5 }      └─────────────┘
                                                │
                                                ▼
2. AUTHENTICATION & VALIDATION              ┌─────────────┐
   JWT Token ──→ JwtGuard ──→ @GetUser() ──→ │BookingService│
                                             └─────────────┘
                                                │
                                                ▼
3. DISTRIBUTED LOCKING                      ┌─────────────┐
   Redis SET NX ──→ booking:spot:5 ────────→ │ RedisService│
   (10 sec TTL)                             └─────────────┘
                                                │
                                                ▼
4. BUSINESS LOGIC EXECUTION                 ┌─────────────┐
   • Check class exists                     │   Prisma    │
   • Validate capacity      ←──────────────→ │ Transactions│
   • Create booking record                  └─────────────┘
   • Update currentBookings
                                                │
                                                ▼
5. CACHE UPDATE & PUBLISH                   ┌─────────────┐
   • Update capacity cache ←───────────────→ │Redis Cache &│
   • Publish to class:updates channel       │   Pub/Sub   │
                                            └─────────────┘
                                                │
                                                ▼
6. REAL-TIME NOTIFICATION                   ┌─────────────┐
   Redis Subscriber ──→ EventsGateway ────→ │ WebSocket   │
                                            │ Broadcast   │
                                            └─────────────┘
                                                │
                                                ▼
7. CLIENT RECEIVES UPDATE                   ┌─────────────┐
   capacity-updated event ←────────────────→ │   Client    │
   { classId, currentBookings, capacity }   │ Updates UI  │
                                            └─────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRODUCTION DEPLOYMENT                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           ┌─────────────────┐                              │
│                           │   RENDER.COM    │                              │
│                           │   PLATFORM      │                              │
│                           └─────────────────┘                              │
│                                    │                                       │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          │                         │                         │              │
│          ▼                         ▼                         ▼              │
│ ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│ │   WEB SERVICE   │    │   POSTGRESQL    │    │     REDIS       │           │
│ │                 │    │    DATABASE     │    │   INSTANCE      │           │
│ │ • NestJS App    │    │                 │    │                 │           │
│ │ • Auto Deploy   │◄───┤ • Free Tier     │    │ • Free Tier     │           │
│ │ • SSL/HTTPS     │    │ • Persistent    │    │ • In-Memory     │           │
│ │ • Load Balancer │    │ • Backups       │    │ • Pub/Sub       │           │
│ │ • Health Checks │    │ • Migrations    │    │ • Caching       │           │
│ └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                             │
│                           ┌─────────────────┐                              │
│                           │  GITHUB REPO    │                              │
│                           │                 │                              │
│                           │ • Source Code   │                              │
│                           │ • Auto Deploy   │                              │
│                           │ • CI/CD Pipeline│                              │
│                           └─────────────────┘                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ENVIRONMENT VARIABLES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DATABASE_URL=postgresql://user:pass@host/db                               │
│  REDIS_URL=redis://host:port                                               │
│  JWT_SECRET=production-secret                                               │
│  NODE_ENV=production                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SECURITY LAYERS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TRANSPORT SECURITY                           │    │
│  │                                                                     │    │
│  │  • HTTPS/TLS (SSL Certificate)                                     │    │
│  │  • Helmet.js (Security Headers)                                    │    │
│  │  • CORS Configuration                                               │    │
│  │  • Rate Limiting (100 req/min)                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     AUTHENTICATION SECURITY                        │    │
│  │                                                                     │    │
│  │  • JWT Tokens (Bearer Authentication)                              │    │
│  │  • Password Hashing (bcrypt, 12 salt rounds)                       │    │
│  │  • Token Expiration                                                 │    │
│  │  • Secure JWT Secrets                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      AUTHORIZATION SECURITY                        │    │
│  │                                                                     │    │
│  │  • Role-Based Access Control (RBAC)                                │    │
│  │  • Route-Level Guards                                               │    │
│  │  • Method-Level Permissions                                         │    │
│  │  • Resource Ownership Validation                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        DATA SECURITY                                │    │
│  │                                                                     │    │
│  │  • Input Validation (class-validator)                              │    │
│  │  • SQL Injection Prevention (Prisma ORM)                           │    │
│  │  • XSS Protection                                                   │    │
│  │  • Data Sanitization                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     CONCURRENCY SECURITY                           │    │
│  │                                                                     │    │
│  │  • Redis Distributed Locks                                         │    │
│  │  • Race Condition Prevention                                        │    │
│  │  • Transaction Isolation                                            │    │
│  │  • Atomic Operations                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

