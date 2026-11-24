# Intam Solutions – Full Stack Project

> React + Node.js + GraphQL + MongoDB

## Folder Structure

```
Intam-solutions/
├── frontend/
│   ├── .env                        ← VITE_ environment variables
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.css               ← Global styles
│       ├── main.jsx                ← ReactDOM entry point
│       ├── App.jsx                 ← Root component (Apollo + layout)
│       ├── graphql/
│       │   ├── apolloClient.js     ← Apollo Client setup
│       │   └── queries.js          ← GQL queries & mutations
│       └── components/
│           ├── Header.jsx / .css   ← Sticky nav + topbar + mobile menu
│           ├── Hero.jsx / .css     ← Slider + feature strip
│           ├── ProductCategories.jsx / .css  ← Category grid (from DB)
│           └── Footer.jsx / .css   ← CTA + links + contact form
│
└── backend/
    ├── .env                        ← PORT, MONGO_URI, NODE_ENV
    ├── package.json
    └── src/
        ├── index.js                ← Express + Apollo Server entry
        ├── config/
        │   └── db.js               ← Mongoose connection
        ├── models/
        │   ├── Product.js
        │   ├── Category.js
        │   └── ContactQuery.js
        ├── schema/
        │   └── typeDefs.js         ← GraphQL SDL
        └── resolvers/
            └── resolvers.js        ← Query + Mutation resolvers
```

## Quick Start

### 1 – Backend
```bash
cd backend
npm install
# Edit .env → set your MONGO_URI
npm run dev      # nodemon → http://localhost:5000/graphql
```

### 2 – Frontend
```bash
cd frontend
npm install
# Edit .env if backend port differs from 5000
npm run dev      # Vite → http://localhost:5173
```

## Environment Files

### `backend/.env`
| Variable | Default | Description |
|---|---|---|
| `PORT` | 5000 | Express server port |
| `MONGO_URI` | `mongodb://localhost:27017/intam_solutions` | MongoDB connection string |
| `NODE_ENV` | `development` | Node environment |

### `frontend/.env`
| Variable | Default | Description |
|---|---|---|
| `VITE_GRAPHQL_URI` | `http://localhost:5000/graphql` | Apollo Client endpoint |
| `VITE_APP_NAME` | `Intam Solutions` | Application title |

## GraphQL API

| Operation | Description |
|---|---|
| `query categories` | Fetch all product categories |
| `query products` | Fetch all products |
| `query productsByCategory(category)` | Filter products |
| `mutation addCategory(...)` | Add a new category |
| `mutation addProduct(...)` | Add a new product |
| `mutation submitContactQuery(...)` | Submit contact form |
