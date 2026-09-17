# LeadDesk — AI Executive Productivity Workspace

LeadDesk is an AI-powered executive productivity assistant designed to help leaders manage commitments, deadlines, risks, ownership gaps, email updates, calendar conflicts, and important follow-ups from one unified workspace.

It acts as an intelligent digital chief-of-staff by converting scattered work information into actionable priorities and executive-level insights.

## Features

* Executive dashboard with key productivity metrics
* AI-powered executive assistant
* Commitment and task tracking
* Deadline and due-date intelligence
* Risk and urgency detection
* Email thread understanding
* Ownership ambiguity detection
* Waiting-on and dependency tracking
* Calendar conflict detection
* AI-generated executive briefings
* Source evidence and grounded responses
* People and stakeholder overview
* Activity timeline
* Global search and filtering
* In-app notifications

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* PostgreSQL
* Prisma ORM

### AI

* OpenAI API

## System Architecture

```text
React + Vite Frontend
        ↓
Express.js REST API
        ↓
Controllers
        ↓
Business Services
        ↓
Prisma ORM
        ↓
PostgreSQL Database
        ↓
OpenAI API for AI Processing
```

## Project Structure

```text
LeadDesk/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── data/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js 18+
* npm
* PostgreSQL database or a cloud PostgreSQL provider
* OpenAI API key

### Clone the Repository

```bash
git clone https://github.com/devansh-0001/AI_Executive_Productivity_Workspace.git
cd AI_Executive_Productivity_Workspace
```

### Install Dependencies

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

Never commit your actual `.env` file or API keys to GitHub.

### Configure Database

Run Prisma migration:

```bash
cd server
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

If seed data is available, run:

```bash
npm run seed
```

### Run the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend will generally run at:

```text
http://localhost:5173
```

The backend will generally run at:

```text
http://localhost:5000
```

## Core Use Cases

LeadDesk helps executives answer questions such as:

* What commitments are currently pending?
* Which deadlines are at risk?
* What tasks have been repeatedly delayed?
* Who owns an unassigned responsibility?
* What am I waiting on from others?
* Are there conflicts in my calendar?
* What needs my immediate attention?
* What changed across emails, meetings, and updates?
* Can I generate a concise executive briefing?

## AI Capabilities

The AI layer is used for:

* Extracting commitments from unstructured information
* Identifying deadlines and date references
* Understanding the latest state of email threads
* Detecting ownership ambiguity
* Summarizing executive activity
* Generating grounded answers
* Creating executive briefings
* Connecting related information across sources

AI responses are grounded in the available source data and avoid unsupported assumptions.

## Security

* API keys are stored in environment variables
* `.env` files are excluded from Git
* Sensitive credentials must never be committed
* Backend handles database and AI communication
* Frontend does not directly access PostgreSQL

## Future Improvements

* Authentication and role-based access
* Real Gmail integration
* Real Google Calendar integration
* Multi-user support
* Multi-tenant workspace support
* Slack and Microsoft Teams integration
* Email and mobile notifications
* Advanced analytics and reporting
* Deployment with CI/CD

## Project Status

This project is currently under active development as an AI-powered executive productivity workspace prototype.

## Author

**Devansh**

GitHub: https://github.com/devansh-0001

## License

This project is intended for educational, experimental, and portfolio purposes.
