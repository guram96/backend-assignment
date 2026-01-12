# backend-assignment

A backend application built with Express.js and TypeScript.

## Prerequisites

- Node.js (v22 or higher recommended)
- npm or yarn
- Docker and Docker Compose (for database)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables (e.g., `PORT`, database connection details)

## Database Setup

The project uses MySQL via Docker Compose. To start the database services:

```bash
docker-compose up -d
```

This will start:
- MySQL database on port `3306`
- phpMyAdmin on port `8080`

To stop the services:
```bash
docker-compose down
```

## Development

Run the development server with hot-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Building

Build the project for production:

```bash
npm run build
```

This compiles TypeScript files to JavaScript in the `dist` directory.

## Production

After building, start the production server:

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with watch mode
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled production build