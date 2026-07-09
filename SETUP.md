# Jetski Development Setup & Command Guide (Cross-Platform)

Welcome to the **Jetski Real-Time AI Code Reviewer**! This guide details the complete local setup instructions for both **macOS/Linux** and **Windows** (CMD & PowerShell) systems. It also serves as a step-by-step instruction set that can be read and executed by **AI agents** running on different operating systems.

---

## System Architecture & Ports

- **React/Next.js Frontend**: Port `3000`
- **Express Backend**: Port `5001` (moved from `5000` to avoid macOS AirPlay and Windows services conflicts)
- **PostgreSQL Database (Docker)**: Exposed on host port `5440` (to prevent conflicts with local instances on `5432`)
- **Redis (Docker)**: Port `6379`

---

## Prerequisites

Ensure the following are installed:
- **Node.js** (v20+ recommended)
- **Docker Desktop** (configured and running)
- **Git**
- **Google Gemini API Key**

---

## 1. Branch Merging & Code Setup

To get the latest branch `jetski-v2` locally and merge it into `main`:

```bash
# Fetch latest remote changes
git fetch origin

# Create local tracking branch for jetski-v2
git checkout -b jetski-v2 origin/jetski-v2

# Switch to main and merge
git checkout main
git merge jetski-v2
```

---

## 2. Infrastructure Setup (Docker Compose)

### Launching Docker Desktop
- **macOS**:
  ```bash
  open -a Docker
  ```
- **Linux**:
  ```bash
  sudo systemctl start docker
  ```
- **Windows (PowerShell)**:
  ```powershell
  Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  ```

### Spin up Database and Caching
From the root workspace folder:
```bash
docker compose up -d
```
*Verify they are running using:*
```bash
docker compose ps
```

---

## 3. Environment Configuration

Copy the template files `_env` and `_env.local` to their active filenames.

### macOS & Linux (Bash/Zsh)
```bash
# Copy backend template
cp backend/_env backend/.env

# Copy frontend template
cp frontend/_env.local frontend/.env.local
```

### Windows (Command Prompt - CMD)
```cmd
:: Copy backend template
copy backend\_env backend\.env

:: Copy frontend template
copy frontend\_env.local frontend\.env.local
```

### Windows (PowerShell)
```powershell
# Copy backend template
Copy-Item backend/_env backend/.env

# Copy frontend template
Copy-Item frontend/_env.local frontend/.env.local
```

---

## 4. Backend Setup & Seeding

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Port Conflicts (Check & Free Port 5000/5001)
If there is another process blocking port `5000` or `5001`:
- **macOS / Linux**:
  ```bash
  lsof -i :5000
  # If blocked, kill process:
  kill -9 <PID>
  ```
- **Windows (Command Prompt - CMD)**:
  ```cmd
  netstat -ano | findstr :5000
  # If blocked, kill process:
  taskkill /PID <PID> /F
  ```
- **Windows (PowerShell)**:
  ```powershell
  Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, OwningProcess
  # If blocked, kill process:
  Stop-Process -Id <PID> -Force
  ```

### Synchronize Schema & Seed Database
Run from inside the `backend/` directory:
```bash
# Push Prisma schema to Postgres
npm run db:push

# Load seed mock data
npm run db:seed
```

**Seeded Credentials:**
- **Demo User Email**: `demo@jetski.dev`
- **Password**: `password123`

---

## 5. Frontend Setup

### Install Dependencies
From a separate terminal window, go into the `frontend/` directory and install:
```bash
cd frontend
npm install
```

---

## 6. Running Development Servers

### macOS & Linux
```bash
# Terminal 1: Start Backend (inside backend/)
npm run dev

# Terminal 2: Start Frontend (inside frontend/)
npm run dev
```

### Windows (CMD)
```cmd
:: Terminal 1: Start Backend
cd backend
npm run dev

:: Terminal 2: Start Frontend
cd frontend
npm run dev
```

### Windows (PowerShell - Run in background/jobs)
```powershell
# Start Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Start Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

---

## 7. Testing Suite

### Run Backend Unit & Integration Tests (Vitest)
In `backend/`:
```bash
npm run test
```

### Run Frontend Component Tests (Vitest)
In `frontend/`:
```bash
npm run test
```

### Run Frontend End-to-End Tests (Playwright)
In `frontend/`:
```bash
# Install Playwright browser engines
npx playwright install

# Run E2E tests
npm run test:e2e
```
