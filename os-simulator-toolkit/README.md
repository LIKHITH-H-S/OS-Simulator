# OS Simulator Toolkit

OS Simulator Toolkit is an educational full‑stack web app that lets you **visually simulate classic Operating System algorithms**:

- **CPU Scheduling** – FCFS, SJF, Round Robin (with Gantt chart)
- **Page Replacement** – FIFO, LRU, Optimal (frame‑by‑frame table)
- **Deadlock Avoidance** – Banker’s algorithm (safe / unsafe + safe sequence)
- **Disk Scheduling** – FCFS, SSTF, SCAN (head movement path + seek time)

The goal is to provide a **resume‑quality learning platform** where students can interactively explore how OS algorithms behave on real input data.

---

## 1. Tech Stack

- **Frontend**: React, Vite, React Router, plain CSS, `react-chartjs-2` + `chart.js`
- **Backend**: Node.js, Express
- **Project layout**:

```
os-simulator-toolkit
│
├── client              # React frontend
│   └── src
│       ├── components  # Reusable UI & charts
│       ├── pages       # Route-level pages (simulators)
│       ├── algorithms  # (optional) client-side helpers
│       └── App.js
│
├── server              # Express backend
│   ├── controllers     # Each simulator’s core handler
│   ├── routes          # API routes
│   └── server.js
│
├── shared              # Pure algorithm implementations (Node-friendly)
│   ├── cpu
│   ├── page
│   ├── deadlock
│   └── disk
│
└── README.md
```

---

## 2. Getting Started

From the `os-simulator-toolkit` folder:

```bash
# 1. Install root dev dependency (npm-run-all) and per-app dependencies
npm install
cd client && npm install
cd ../server && npm install

# Or (from root) run everything with one command on most shells:
# npm run install:all
```

### Run in development

In **two terminals**:

```bash
# Terminal 1 – backend
cd server
npm run dev   # runs Express on http://localhost:4000

# Terminal 2 – frontend
cd client
npm run dev   # Vite dev server, usually http://localhost:5173
```

The frontend is configured (via `vite.config.mjs`) to proxy `/api/*` requests to `http://localhost:4000`.

---

## 3. Available Simulators

### 3.1 CPU Scheduling Simulator

**Path**: Home → **CPU Scheduling**

**Algorithms**:
- FCFS (First‑Come, First‑Served)
- SJF (Shortest Job First, non‑preemptive)
- Round Robin (with configurable time quantum)

**Inputs**:
- **Process ID**
- **Arrival Time**
- **Burst Time**

**Outputs**:
- **Gantt chart** of CPU usage
- Per-process **waiting time** and **turnaround time**
- **Average waiting time**
- **Average turnaround time**

**Example input** (also available via “Load Sample Data”):

| Process | Arrival | Burst |
|--------:|--------:|------:|
| P1      | 0       | 7     |
| P2      | 2       | 4     |
| P3      | 4       | 1     |
| P4      | 5       | 4     |

---

### 3.2 Page Replacement Simulator

**Path**: Home → **Page Replacement**

**Algorithms**:
- FIFO
- LRU
- Optimal

**Inputs**:
- **Reference String** (space or comma separated, e.g. `7 0 1 2 0 3 0 4 2 3 0 3 2`)
- **Number of Frames**

**Outputs**:
- **Frame table step‑by‑step** for each reference
- **Page hits** and **page faults** count
- Victim page at each fault

**Sample data** (pre‑loaded in the UI):

- Reference string: `7 0 1 2 0 3 0 4 2 3 0 3 2`
- Frames: `3`

---

### 3.3 Deadlock Avoidance (Banker’s Algorithm)

**Path**: Home → **Deadlock Avoidance**

**Inputs**:
- **Allocation matrix** – each line is a process, resources space-separated  
  Example:
  ```text
  0 1 0
  2 0 0
  3 0 2
  2 1 1
  0 0 2
  ```
- **Maximum matrix** – same shape as allocation  
  Example:
  ```text
  7 5 3
  3 2 2
  9 0 2
  2 2 2
  4 3 3
  ```
- **Available vector** – resources available of each type  
  Example:
  ```text
  3 3 2
  ```

**Outputs**:
- Whether the system is in a **safe state**
- A **safe sequence** of processes (e.g. `P1 → P3 → ...`) if it exists
- The computed **Need matrix** (`Max - Allocation`)

The sample values above correspond to the classic safe example from many OS textbooks.

---

### 3.4 Disk Scheduling Simulator

**Path**: Home → **Disk Scheduling**

**Algorithms**:
- FCFS
- SSTF (Shortest Seek Time First)
- SCAN (Elevator)

**Inputs**:
- **Request queue**: space/comma‑separated cylinder numbers  
  Example: `82 170 43 140 24 16 190`
- **Initial head position**: e.g. `50`
- **SCAN direction** (when SCAN is selected): `Towards higher cylinders` or `Towards lower cylinders`

**Outputs**:
- **Head movement order** (e.g. `50 → 82 → 43 → …`)
- **Total seek time** (sum of absolute head movements)
- A **chart of head movement** over time (using Chart.js)

---

## 4. Implementation Notes

- Each algorithm is implemented as a **pure function** under `shared/`:
  - CPU: `shared/cpu/fcfs.js`, `sjf.js`, `roundRobin.js`
  - Page replacement: `shared/page/fifo.js`, `lru.js`, `optimal.js`
  - Deadlock: `shared/deadlock/bankers.js`
  - Disk: `shared/disk/fcfs.js`, `sstf.js`, `scan.js`
- The **Express controllers** wrap these functions and expose JSON APIs under `/api/*`.
- The **React frontend** calls these APIs with `axios` and renders:
  - **Custom Gantt chart** for CPU
  - **Tabular frame visualizations** for paging
  - **Matrix tables** for Banker’s algorithm
  - **Chart.js line chart** for disk head movement

This separation makes it easy to **unit-test algorithms independently** or reuse them in other contexts.

---

## 5. Production build (optional)

To build the frontend for production:

```bash
cd client
npm run build
```

You can then serve the static build with any static server (or extend the Express app to serve `client/dist`).

---

## 6. Next Ideas

- Add **preemptive SJF (SRTF)** and **Priority scheduling**
- Add more disk policies (C‑SCAN, LOOK, C‑LOOK)
- Add **interactive step controls** (next/previous step) for each simulator
- Persist scenarios in local storage so students can save and share experiments

