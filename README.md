# GoTech Chat — Engineering Hiring Evaluation

A real-time chat application built with **NestJS + React + PostgreSQL + Socket.IO**. This project is used to evaluate full-stack engineering candidates at GoTech.

## Candidate Task

You are reviewing a codebase written by a developer in a hurry. The application works, but it contains **realistic engineering flaws** across four categories. Your job is to:

1. **Identify** the issues in each category
2. **Fix** as many as you can until your deadline
3. **Fork the repo** 
4. **Submit a PR** to your fork with your changes + a short write-up explaining each fix

You are allowed to use whatever you want, but you have to fully understand the final solution. 
> **Depth over breadth.** A thorough fix with clear reasoning beats a shallow scan.

---

## Features

- User registration and login with JWT authentication
- Create and join chat rooms
- Real-time messaging via WebSockets
- Message history per room

---

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Run the App

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## Known Issue Areas

The following categories contain real engineering problems. The description tells you *what kind* of issue exists — not how to fix it. Part of the evaluation is finding the specific locations.

### Architecture & Design

- The backend has no feature module structure — all providers, controllers, and entities are registered in a single flat module
- One service handles concerns from multiple domains with no separation
- A controller contains logic that belongs in the service layer
- DTOs are defined but never enforced by the framework
- The frontend has a single component exceeding 400 lines handling too many responsibilities
- State is passed down through 4–5 component levels unnecessarily

### Security

- Passwords are hashed using a cryptographically broken algorithm
- A sensitive configuration value is hardcoded in source code in two separate files
- One API endpoint exposes sensitive user data to any authenticated caller
- WebSocket messages trust a value supplied by the client without server-side verification
- A frontend component renders user content in a way that allows script injection

### Performance

- A database query pattern results in N+1 queries for a common operation
- No indexes are defined on frequently-queried foreign key columns
- Message history has no pagination — all messages are loaded at once
- On every real-time event, the frontend discards existing data and re-fetches everything from the server
- A WebSocket connection is recreated on every render cycle

### Code Quality

- A deprecated/cryptographically weak import is left commented out alongside its replacement
- `console.log` statements remain in production paths
- Untyped (`any`) is used for function parameters and return types throughout
- Magic strings and magic numbers appear in multiple files without constants
- One component uses a different paradigm than the rest of the codebase
- `snake_case` and `camelCase` naming conventions are mixed within a single entity
- Array indexes are used as React list keys

---

## Evaluation Rubric

| Category | Weight | What we look for |
|---|---|---|
| Issue Identification | 20% | Did you find the actual code locations, not just the category descriptions? |
| Security Fixes | 25% | Correct algorithm choices, no new vulnerabilities introduced |
| Architecture | 20% | Reasonable module boundaries, separation of concerns |
| Performance | 15% | Fix the query pattern, add pagination, fix real-time update logic |
| Code Quality | 10% | Consistent style, types, no dead code |
| Write-up | 10% | Clear explanation of each fix and the reasoning behind it |

---

## Tech Stack

- **Backend:** NestJS, TypeORM, PostgreSQL, Socket.IO, JWT
- **Frontend:** React 18, React Router v6, Socket.IO Client, Vite, TypeScript
- **Infrastructure:** Docker, Docker Compose





## 🛠 Project Refactoring & Security Improvements
This project underwent a significant refactoring process to eliminate critical vulnerabilities, optimize performance, and align the codebase with NestJS best practices.

1. Security & Authentication
Replaced MD5 with Bcrypt:

Reasoning: MD5 is cryptographically broken and vulnerable to rainbow table attacks. Using Bcrypt with an adaptive salting mechanism ensures that user passwords are secure against brute-force attacks.

Environment Configuration (.env):

Reasoning: Sensitive data like JWT secrets and Database credentials were hardcoded. Moving these to .env files using ConfigModule prevents accidental exposure of credentials in version control.

WebSocket Authentication:

Reasoning: The original Gateway allowed any client to connect. I implemented a JWT handshake validation in handleConnection to ensure only authenticated users can access the real-time features.

2. Database & Performance Optimization
Resolved the N+1 Query Problem:

Reasoning: The getMessages method previously triggered a separate database query for every message to fetch the author's details. By using TypeORM relations (LEFT JOIN), the server now fetches all necessary data in a single efficient SQL query.

Implemented Pagination:

Reasoning: Loading all messages at once can crash the server or the client as the database grows. Adding limit and offset (pagination) ensures the app remains scalable and performant.

3. Data Integrity & Validation
Shifted from any to DTOs (Data Transfer Objects):

Reasoning: Using any bypasses type safety. Implementing classes like CreateUserDto and SendMessageDto defines a clear contract for the API and prevents "mass assignment" vulnerabilities.

Global ValidationPipe:

Reasoning: Enabled the ValidationPipe to automate incoming data checks. This allows for declarative validation using class-validator decorators (e.g., @MinLength), removing the need for manual if-else checks in controllers.

4. Clean Architecture
Separation of Concerns:

Reasoning: Database logic was incorrectly placed inside Controllers. I moved all business and persistence logic into Services, leaving Controllers responsible only for routing and request handling.

CORS Hardening:

Reasoning: Changed the CORS policy from a wildcard * to a specific allowed origin. This prevents unauthorized third-party domains from making requests to the backend.

5. WebSocket Logic Refinement
Centralized Room Management:

Reasoning: Eliminated "magic strings" by creating a helper method for room keys. This ensures consistency and makes the code easier to maintain if the room naming convention changes.

Improved Error Handling:

Reasoning: Removed unimplemented methods and "throw error" stubs in the Gateway that were causing the server to crash whenever a user disconnected.
