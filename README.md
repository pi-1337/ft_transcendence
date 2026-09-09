
This project has been created as part of the 42 curriculum by ynidkouc, kelmounj, yzirri, ioulkhir
 
# Description
 
**BadgeHub** is a badge-based identification and tracking system that allows organizations to identify users through badges and monitor their usage of specific services, such as food services.
 
The project is a full-stack application designed to manage users, badges, service access, and usage data through an all-in-one platform.
 
# Instructions
 
The project would normally require several technologies to work. However, since our software is containerized, the only dependency a developer needs to run the project successfully is `Docker`.
 
### How to run the project
 
Assuming we are in the project root directory, we can run these commands to set up the environment:
 
```bash
cd services/main_app
cp .env.example .env
cd ../mariadb
cp .env.example .env
```
 
Then fill in the values in both `.env` files (see below for what each variable does).
 
Once the environment is configured, go back to the project root and run docker compose:
 
```bash
docker compose up
```
 
That's it, the project should be running now without any problems. Assuming the developer has not made any changes to the `docker-compose.yml` file, the website should be accessible at:
[https://localhost:3000](https://localhost:3000)
 
### Services started by Docker Compose
 
| Service | Description |
|---|---|
| `mariadb` | MariaDB database, initialized from `services/mariadb` |
| `main_app` | The Next.js full-stack application (frontend + backend + API) |
| `reverse_proxy` | Nginx reverse proxy, exposes ports `3000` and `3002` to the host |
| `avatar_server` | Serves uploaded user avatars from a shared Docker volume |
 
### `services/mariadb/.env`
 
```bash
DB_NAME=
DB_USER=
DB_PASS=
```
 
### `services/main_app/.env`
 
```bash
# database connection URL
# dev example:  mysql://<USER>:<PASS>@localhost:3307/<NAME>
# prod example: mysql://<USER>:<PASS>@mariadb:3306/<NAME>
DATABASE_URL=
 
# Json Web Token Secret key
JWT_SECRET_KEY=
 
# OAUTH 42
UID_42=
SECRET_42=
FALLBACK_42=
 
# avatar handler URL
# dev:  localhost:3000/avatars
# prod: localhost:3002
NEXT_PUBLIC_AVATAR_LINK=
 
# Main app URL, important for redirections
# dev:  http://localhost:3000
# prod: https://localhost:3000
NEXT_PUBLIC_BASE_URL=
 
# Scanner Secret key for security, shared with the badge listener/simulator
SCANNER_API_KEY=
 
# SMTP settings for email sending
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
TWO_FACTOR_REQUIRE_SMTP=
 
# Self explanatory
TWO_FACTOR_OTP_LENGTH=
TWO_FACTOR_OTP_TTL_MINUTES=
TWO_FACTOR_OTP_MAX_ATTEMPTS=
TWO_FACTOR_OTP_MAX_RESENDS=
TWO_FACTOR_OTP_RESEND_COOLDOWN_SECONDS=
```
 
### Running the badge listener (RFID scanner simulator)
 
The `badge_listener/` directory contains a standalone FastAPI app that simulates RFID readers sending badge scans to the main app. It runs outside Docker, alongside the stack above:
 
```bash
cd badge_listener
python3 -m venv .simulator-venv
source .simulator-venv/bin/activate
pip install -r requirements.txt
cp .simulator.env.example .simulator.env
```
 
Edit `.simulator.env` and set `SCANNER_API_KEY` to the same value used in `services/main_app/.env`, then run:
 
```bash
python app.py
```
 
Open <http://localhost:8001>. The Next.js app must already be running (`NEXTJS_BASE_URL` in `.simulator.env` points to it, defaulting to `http://localhost:3000`).
 
# Resources
 
The team members did not benifit much from any resources as they were already familiar with the tech stack. But just for some little help, here is some of the resources :

- https://www.youtube.com/@ByteGrad
- https://www.youtube.com/@theavocoder
 
# Team Information
 
These are roles:
### Product Owner (PO):
- ynidkouc: the proposer of the idea and the high level abstraction of the project.
### Product Manager (PM):
- ioulkhir: meetings organizer and project low level architecture designer.
### Tech Lead:
- ioulkhir: responsible for technical decisions, the overall architecture of the services, and the technical stack choices below.
### Developers:
- ynidkouc, kelmounj, yzirri and ioulkhir: software engineers that contributed to the project.
# Project Management
 
The project involved distributing tasks among team members, coordinating through regular meetings, and using GitHub for version control and collaboration. Discord was used for communication and quick coordination.
 
Time management was more challenging than the actual engineering work. Fortunately, the project was completed successfully thanks to careful planning and task organization from the beginning.
 
# Technical Stack
 
The technical stack is as described below:
 
- **Front-end & Back-end (Full-Stack): Next.js**
	- Next.js was chosen because it lets a small team ship both the UI and the API from a single codebase, with built-in routing, server-side rendering, and API routes, which reduced the overhead of maintaining two separate services during a time-constrained project.
- **Database system: Prisma ORM and MariaDB**
	- Prisma was chosen for its type-safe query builder and easy schema migrations directly from TypeScript, which sped up development and reduced runtime SQL errors. MariaDB was chosen as a lightweight, open-source, MySQL-compatible relational database that's simple to containerize and well supported by Prisma.
- **Reverse proxy: Nginx**
	- Used to expose the application on a single entry point and route traffic to the `main_app` and `avatar_server` containers.
- **Badge scanning: FastAPI (Python)**
	- A standalone service used to simulate RFID badge readers sending scan events to the main application via its public API.
# Database Schema
 
Below is a visual representation of the database schema, it contains detailed information about tables and their relations: https://elementslink.site/u5kc5/index.html
 
# Features List
 
TODO: list the main user-facing features here (e.g. badge scanning & service access control, organization & user management, announcements/notifications, 2FA login, avatar uploads, admin dashboards, usage analytics, etc.)
 
# Modules
 
Here are the modules we were able to cover, we have a total of **20 points**:

### `Web`
- **Major**: Use a framework for both the frontend and backend.
- **Major**: A public API
- **Minor**: Use an ORM for the database.
- **Minor**: A complete notification system
- **Minor**: Server-Side Rendering
- **Minor**: Custom-made design system with reusable components, including a proper
color palette, typography, and icons.

### `Accessibility and Internationalization`
- **Minor**: Support for additional browsers.

### `User Management`
- **Major**: Advanced permissions system:
- **Major**: An organization system:
- **Minor**: Implement a complete 2FA (Two-Factor Authentication) system for the users.
- **Minor**: User activity analytics and insights dashboard.

### `Devops`
- **Major**: Backend as microservices.

### `Data and Analytics`
- **Major**: Advanced analytics dashboard with data visualization.
- **Minor**: Data export and import functionality.
 
# Individual Contributions
 
Detailed breakdown of what each team member contributed
 
- **ynidkouc** — TODO
- **kelmounj** — TODO
- **yzirri** — TODO
- **ioulkhir** — TODO
# Bonus part

#### `What it is ?`
``badge_listener`` is a standalone FastAPI service, deliberately separate from the main web app, that simulates physical RFID badge readers. It exposes a small [local web UI](http://localhost:8001) where a developer or evaluator can trigger simulated badge scans, which are then sent as authenticated HTTP requests to the main application's public API **/api/public/v1/scans**, exactly as a real RFID reader deployed at a physical service point would. It authenticates using the same ***SCANNER_API_KEY*** the real hardware integration would use, and it keeps an in-memory log of the last 100 simulated scan events so their outcomes (accepted, rejected, pending decision) can be inspected as they happen.

#### `How it adds real value ?`

It basically simulates how a real RFID reader would work without the hardware overhead, it saves a ton of time and succeeds in demonstrating the project's core purpose.

#### `Why it deserves Major status ?`

It's a fully separate, independently deployable service with its own runtime, dependency set, configuration, event log, and web UI. It is the only way our project's core concept (badge-based access tracking) can be exercised and evaluated at all, which makes it substantial to the project rather than an optional nice-to-have.

