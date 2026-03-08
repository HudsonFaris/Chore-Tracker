# Chore Tracker | High-Density Visual Audit System

A minimalist, high-efficiency chore management system designed to replace high-noise communication with a silent, visual audit grid.

## Launch Premise
The objective is to eliminate accountability fatigue in large group living environments. The system replaces cluttered message threads with a high-density grid designed for 30-second manager audits.

## Tech Stack
* **Frontend:** React / Tailwind CSS
* **Backend:** Firebase (Cloud Firestore, Authentication, Cloud Storage)
* **Hosting:** Railway (App Server)
* **DNS & Security:** Cloudflare (Edge Caching and SSL)
* **Authentication:** 4-digit PIN-based system tied to Manager CSV ingests

---

## Tech Stack
* **Frontend Library:** React 18
* **Build Tool:** Vite 6 (ESM-based HMR)
* **Styling:** Tailwind CSS 4 (Vite plugin)
* **Backend:** Firebase (Firestore, Auth, Storage)

## Firebase Backend Architecture

The backend leverages a serverless NoSQL structure to minimize latency during high-density photo uploads:

* **Cloud Firestore:** Uses a flat document-collection model. All assignments are indexed by `org_id` to allow managers to fetch an entire house's status in a single query.
* **Firebase Storage:** Handles binary image data for "proof of work." The database stores only the signed URL strings to maintain high query performance in the dashboard.
* **Authentication:** Implements a custom PIN-to-UID mapping. By utilizing Firebase Anonymous Auth combined with custom claims, users maintain a persistent session on their mobile devices without requiring traditional email/password credentials.

---

## Launch Roadmap and Milestones

| Milestone | Deliverable | Target Date | Status |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | **Integration:** Frontend/Backend connected locally | Mar 3, 2026 | COMPLETED |
| **Milestone 2** | **Launch Plan:** Presentation of Alpha deployment strategy | Mar 4, 2026 | COMPLETED |
| **Milestone 3** | **Alpha Deployment:** Live testing with 5 organizations | Mar 5, 2026 | IN PROGRESS |
| **Milestone 4** | **Iteration:** Patching friction points from user data | Mar 9, 2026 | PENDING |

---

## Team and Responsibilities
* **Hudson:** Backend Infrastructure, Database Architecture, Escalation Lead.
* **Eoghan:** Frontend Development, Mobile UI/UX, Repository Management.
* **Alex:** User Logistics, Alpha Test Outreach, Launch Presentation.

## Sync and Escalation Plan
* **Asynchronous:** Daily updates in group chat upon feature branch merges.
* **Synchronous:** 15-minute standups (Mon/Wed) and 1-hour Sunday Synthesis meetings.
* **The 24-Hour Rule:** If a team member is stuck for 24 hours, it must be escalated to the group. If unblocked after 12 more hours, it is escalated to the project advisor.

## Success Metrics
1. **Infrastructure:** 100% team parity in repository contribution.
2. **User Adoption:** 5 distinct organizations (ATO, Dorm, 3 Roommate groups) onboarded.
3. **Engagement:** Minimum 20 successful visual logs during the first 48 hours of launch.

---

## Domain
Chore-Tracker.net

## Backend Baseline Initialization

Another thing to note is that node modules or /.env files are included. This should be done by installing 
1. npm install firebase
2. npm install -g firebase-tools

Create the .env file locally with Hudsons Key


## How to run
npm run dev (in terminal, root of folder)

### Firebase Configuration (`src/firebase.js`)
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "choretracker-8e636.firebaseapp.com",
  projectId: "choretracker-8e636",
  storageBucket: "choretracker-8e636.firebasestorage.app",
  messagingSenderId: "1078067222453",
  appId: "1:1078067222453:web:b14522dfc862e7c45fabfc",
  measurementId: "G-R32G3T7ZHR"
};

//initialize firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
