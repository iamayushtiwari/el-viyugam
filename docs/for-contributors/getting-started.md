# Getting Started

This guide will help you start contributing to EL Viyugam.

## Steps to Contribute

1. Fork the repository
2. Clone your fork locally
3. Install dependencies
4. Create a new branch for your work
5. Make your changes
6. Test your changes properly
7. Push and create a pull request

## Local Setup

### Frontend Setup

#### Installation

```bash
cd frontend
npm install
```

#### Run Development Server

```bash
npm run dev
```

The frontend will run locally on:

http://localhost:3000

### Backend Setup

#### Installation

```bash
cd backend
npm install
```

#### Run Development Server

```bash
npm run start:dev
```

The backend server will run locally on:

http://localhost:3001

### Database Setup

Follow the steps below to configure the database locally for backend development.

1. Install PostgreSQL on your system and ensure the service is running.

2. Create a `.env` file in the backend directory.

3. Add the following database connection string to the `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/el_viyugam"
```

4. Run the Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
```

5. Start the backend development server.