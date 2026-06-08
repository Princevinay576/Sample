# Painting Store (React + Vite + MongoDB)

This project now uses a MongoDB-backed API for product data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` from `.env.example`:
```bash
copy .env.example .env
```

3. Update `MONGODB_URI` in `.env` if needed.

4. Set admin credentials in `.env`:
```env
ADMIN_EMAIL=admin@painting.com
ADMIN_PASSWORD=your-strong-password
ADMIN_TOKEN_SECRET=your-random-secret
```

5. Start the app (client + server):
```bash
npm run dev
```

## Scripts

- `npm run dev` - run Vite client and Express server together
- `npm run dev:client` - run only Vite frontend
- `npm run dev:server` - run only API server
- `npm run dev:server:watch` - run API server with watch mode
- `npm run server` - run only API server
- `npm run build` - build frontend
- `npm run preview` - preview frontend build

## API

- `GET /api/health` - server health check
- `GET /api/products` - list shop products from MongoDB
- `POST /api/admin/login` - admin login, returns bearer token
- `POST /api/products` - create a product (admin bearer token required)
- `PUT /api/products/:id` - update a product by Mongo `_id` (admin bearer token required)
- `DELETE /api/products/:id` - delete a product by Mongo `_id` (admin bearer token required)
- `POST /api/subscribers` - subscribe an email to newsletter

Products support either `imageKey` (`item1`..`item5`) or `imageUrl` (custom URL).

## Admin UI

- Open `/login` and sign in with `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
- Only logged-in admin can open `/admin` and perform create/update/delete.
