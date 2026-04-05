<div align="center">

# WatchTower

**Real-time website monitoring with instant alerts.**  
Know when your sites go down — before your users do.

[![CI/CD](https://github.com/Pranavkok/WatchTower/actions/workflows/deploy.yml/badge.svg)](https://github.com/Pranavkok/WatchTower/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](#getting-started)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

![WatchTower Banner](./steps.png)

[Live Demo](http://13.53.78.45:3000) · [Report Bug](https://github.com/Pranavkok/WatchTower/issues) · [Request Feature](https://github.com/Pranavkok/WatchTower/issues)

</div>

---

## What is WatchTower?

WatchTower is an open-source uptime monitoring platform that continuously checks your websites and notifies you the moment something goes wrong — via **email** or **WhatsApp**.

No third-party dependencies. No paywalls. Self-host it in minutes.

---

## Features

- **Real-time monitoring** — checks your websites on a continuous schedule
- **Instant alerts** — get notified via Email and WhatsApp (Twilio) when a site goes down
- **Clean dashboard** — add, remove, and track all your websites in one place
- **Multi-service architecture** — dedicated worker, pusher, and API services
- **Self-hosted** — your data stays on your own server
- **Docker ready** — spin up the entire stack with a single command

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│  Express API │────▶│  PostgreSQL  │
│  Dashboard  │     │   (REST)     │     │  (Database)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
             ┌──────▼──────┐ ┌───▼──────────┐
             │   Worker    │ │    Pusher     │
             │ (monitors   │ │ (real-time   │
             │  websites)  │ │  updates)    │
             └──────┬──────┘ └──────────────┘
                    │
             ┌──────▼──────┐
             │    Redis     │
             │   (queue)    │
             └─────────────┘
```

| Service | Tech | Role |
|---------|------|------|
| `web` | Next.js 14 | User dashboard |
| `api` | Express + Bun | REST API, auth |
| `worker` | Bun | Pings websites, triggers alerts |
| `pusher` | Bun | Real-time status updates |
| `postgres` | PostgreSQL 16 | Persistent storage |
| `redis` | Redis 7 | Job queue |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- Git

### 1. Clone the repo

```bash
git clone https://github.com/Pranavkok/WatchTower.git
cd WatchTower
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=WatchTower <your@gmail.com>

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 3. Start everything

```bash
docker compose up -d --build
```

That's it. Visit `http://localhost:3000`.

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| API | http://localhost:3001 |

---

## Project Structure

```
WatchTower/
├── apps/
│   ├── api/          # Express REST API
│   ├── web/          # Next.js frontend
│   ├── worker/       # Website monitoring worker
│   ├── pusher/       # Real-time update service
│   └── tests/        # Integration tests
├── packages/
│   ├── store/        # Prisma DB client & schema
│   ├── redisstream/  # Redis queue utilities
│   └── ui/           # Shared UI components
├── docker-compose.yml
└── turbo.json
```

---

## CI/CD

Every push to `main` automatically deploys to EC2 via GitHub Actions.

```
git push origin main
      │
      ▼
GitHub Actions
      │
      ├── SSH into EC2
      ├── git pull
      └── docker compose build && up
```

To set up your own deployment, see the [deploy workflow](.github/workflows/deploy.yml).

---

## Alerts

WatchTower supports two alert channels out of the box:

**Email** (via SMTP/Gmail)
> Triggered when a site goes down or comes back up.

**WhatsApp** (via Twilio)
> Instant WhatsApp messages to your number when downtime is detected.

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Built with by [Pranavkok](https://github.com/Pranavkok)

**If this project helped you, give it a star!**

</div>
