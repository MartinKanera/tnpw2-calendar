# TNPW2 Project - Calendar

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

Provide .env file
```
DATABASE_URL="mongodb://127.0.0.1:27017/<database>?replicaSet=rs0"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="<AUTH_SECRET>"
```

MongoDB

```bash
docker compose up
```

## Development

Initialize the database and start the development server on `http://localhost:3000`:

```bash
# Set up database and seed it
yarn run prisma:dev

# Start Nuxt application
yarn run dev
```
