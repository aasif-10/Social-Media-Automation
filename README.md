# Social Media Automation Backend

An AI-powered, cross-platform social media scheduler and automation engine built with Node.js, Express, MongoDB, Google Gemini, and Zerio. This backend allows users to authenticate, generate engaging social media posts using advanced AI models, link multiple social media platforms, and schedule automated post publishing.

---

## Key Features

*   **User Authentication:** Secure JWT-based registration and login flows.
*   **AI-Powered Post Generation:** Seamless integration with **Google Gemini 2.5 Flash** (`@google/genai`) to generate high-quality post copy and context-aware image generation prompts based on custom tones and prompts.
*   **Multi-Platform Syncing:** Integration with **Zerio** to connect, manage, and synchronize profiles for Facebook, Twitter/X, Instagram, and LinkedIn.
*   **Scheduled Post Publishing:** A robust, cron-based automation scheduler (`node-cron`) that runs every minute to publish scheduled posts to the selected platforms as soon as their target release time is reached.
*   **Activity Tracking:** Keeps detailed activity logs for key actions (e.g., successful AI post generation and published posts).

---

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose ODM)
*   **AI Engine:** Google Gemini (using the `@google/genai` library)
*   **Publishing Channel:** Zerio (`@zernio/node` SDK)
*   **Scheduler:** `node-cron`
*   **Security & Auth:** `bcrypt` (password hashing) & `jsonwebtoken` (JWT implementation)

---

## Directory Structure

```text
Social Media Automation/
├── Backend/
│   ├── src/
│   │   ├── config/             # DB & Service Configurations (Zerio, Environment)
│   │   ├── controllers/        # Express Route Handlers (Auth, Posts, Accounts, Logs)
│   │   ├── middlewares/        # Authentication and Route Middlewares
│   │   ├── models/             # Mongoose Schemas (User, Post, Account, Generation, Activity)
│   │   ├── routes/             # API Router mappings
│   │   ├── services/           # External Services (Gemini AI service, node-cron Scheduler)
│   │   └── app.js              # Application entry configuration
│   ├── server.js               # Server initialization
│   ├── package.json            # Node dependencies and scripts
│   └── .env.example            # Environment variables template
└── README.md                   # Project documentation (this file)
```

---

## Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   MongoDB Instance (Local or MongoDB Atlas)
*   Google Gemini API Key
*   Zerio API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd social-media-automation/Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the `Backend/` directory:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/social-automation
    JWT_SECRET=your_jwt_secret_key
    ZERNIO_API_KEY=your_zerio_api_key
    GOOGLE_API_KEY=your_google_gemini_api_key
    ```

4.  **Run the application:**
    *   **Development mode** (with nodemon):
        ```bash
        npm run dev
        ```
    *   **Production mode**:
        ```bash
        node server.js
        ```

---

## API Endpoints Reference

All endpoints (except Authentication and Health checks) require a valid JWT token passed in the `Authorization` header as `Bearer <token>`.

### Health & Public
*   `GET /health` - Verify server status.

### Authentication
*   `POST /api/auth/register` - Register a new user.
    *   **Body:** `{ "name": "...", "email": "...", "password": "..." }`
*   `POST /api/auth/login` - Authenticate and retrieve a JWT token.
    *   **Body:** `{ "name": "...", "email": "...", "password": "..." }`

### AI Post Generation & Retrieval
*   `POST /api/posts/generate` - Generate post content using Google Gemini.
    *   **Body:** `{ "prompt": "...", "tone": "...", "generateImage": true/false }`
    *   **Response:** Returns a generated post copy and an optional image prompt.
*   `GET /api/posts/generations` - Retrieve all historical AI generations by the user.

### Post Scheduling
*   `POST /api/posts/schedule` - Schedule a post for publishing.
    *   **Body:**
        ```json
        {
          "content": "Post copy here",
          "platforms": ["twitter", "linkedin"],
          "mediaUrl": "http://...",
          "mediaType": "image",
          "scheduledAt": "2026-06-20T18:00:00.000Z",
          "status": "scheduled"
        }
        ```
*   `GET /api/posts` - Fetch all posts scheduled or published by the logged-in user.

### Social Profile Connection & Syncing (via Zerio)
*   `GET /api/social-auth/:platform` - Redirects/generates a Zerio connection URL for linking a channel (e.g., `twitter`, `linkedin`, `facebook`, `instagram`).
*   `GET /api/social-auth/sync` - Syncs connected accounts from Zerio to the local database.
*   `GET /api/accounts` - Retrieve all local synced social media accounts.
*   `DELETE /api/accounts/:id` - Deletes a connected account from both local database and Zerio.

### Activity logs
*   `GET /api/activity` - Fetch chronological activity logs of operations.

---

## How the Scheduler Works

The automation uses `node-cron` to look up the database every minute.
1. It queries `Post` documents with `status: "scheduled"` and `scheduledAt <= currentTime`.
2. For each eligible post, it finds connected accounts matching the user and platforms specified in the post.
3. It bundles the payload (`content`, `mediaUrl`, and list of platform account IDs) and triggers Zerio's posting API.
4. On success, the post status updates to `published` and an activity log is created. On failure, it falls back to `failed`.
