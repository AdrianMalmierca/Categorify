# Categorify — Full-Stack URL Manager with Angular + Express + MongoDB

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)
![RxJS](https://img.shields.io/badge/RxJS-7-B7178C?style=flat-square&logo=reactivex)
![Render](https://img.shields.io/badge/Render-deployed-46E3B7?style=flat-square&logo=render)

A full-stack web application for organizing and managing URLs through color-coded categories — with metadata support, favorites, real-time search, and full CRUD operations across nested resources.

---

## Live Demo

🔗 [categorify.onrender.com](https://categorify.onrender.com) It can takes even 1 minute to deploy so is a normal behaviour.

No local setup needed — the app is fully deployed on Render with an external MongoDB instance.

---

## Problem Statement

Most people store URLs in browser bookmarks, messaging apps, open tabs, or notes — with no semantic structure, no context, and no way to search across them.

Categorify solves this by:

- Organizing links into color-coded categories for visual grouping
- Attaching metadata (description, image, favorite flag) to every URL
- Providing real-time global search and a cross-category favorites view
- Offering full CRUD control through a clean REST API backed by MongoDB

---

## Screenshots

### Home — Category Overview
All categories displayed with their custom names and colors. Create a new one with the `+` button.

![Home](assets/home.png)

### Category Detail
All URLs inside a category. Add a new entry with `+` or delete the entire category with the trash icon.

![Category detail](assets/Add%20categoria.png)

### URL Detail
Full metadata view for a URL — edit name, description, URL, and favorite status.

![Element detail](assets/elemento%20update.png)

### Favorites
Aggregated view of all favorited URLs across every category.

![Favourites full](assets/favoritos.png)

![Favourites empty](assets/favoritos%20vacio.png)

### Search
Real-time, case-insensitive filtering across all stored URLs by name.

![Search](assets/search.png)

### Create Category
Pick a name and a color from the color picker to create a new category.

![Create category](assets/crear%20elemento.png)

---

## Features

### Categories
- Create with custom name and color via color picker
- Delete a category along with all its nested URLs

### URL Management
- Add URLs with name (required), URL (required), description (optional), Base64 image, and favorite flag
- Edit all metadata fields from the detail page
- Delete individual URLs without affecting the parent category

### Favorites
- Toggle favorite state from any page
- Centralized favorites view aggregated across all categories
- Reactive synchronization — changes reflect instantly everywhere

### Search
- Real-time client-side filtering across all URLs
- Case-insensitive name matching

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Angular (standalone + NgModules) | Component-driven SPA with reactive data flow |
| State | RxJS BehaviorSubject | Single reactive source of truth, no external state library |
| HTTP | Angular HttpClient | Typed HTTP communication with the REST API |
| Backend | Node.js + Express | Lightweight REST API with layered architecture |
| Database | MongoDB (embedded documents) | Nested URL items inside category documents |
| Hosting | Render (frontend + backend) | Zero-config deployment, external MongoDB |

---

## Architecture

### Data Model
```json
{
  "name": "String",
  "color": "String",
  "items": [
    {
      "name": "String",
      "url": "String",
      "description": "String",
      "imageUrl": "String (Base64)",
      "isFavorite": "Boolean"
    }
  ]
}
```

Each category embeds its URL items directly. Each item has its own `_id` (ObjectId).

### Data Flow
```
User action → Angular Service → HttpClient → Express Route → Service layer → MongoDB
                                                                              ↓
                             BehaviorSubject updated ← Response returned ←───┘
```

### Project Structure
```
categorify/
│
├── backend/
│   ├── index.js
│   ├── modelos/
│   ├── rutas/
│   ├── servicios/
│   └── lib/
│
└── frontend/
    └── src/app/
        ├── componentes/
        │   ├── category-card/
        │   ├── create-category/
        │   ├── header/
        │   ├── header-fs/
        │   ├── nav-bar/
        │   └── url-card/
        ├── pages/
        │   ├── home/
        │   ├── category-detail/
        │   ├── add-url/
        │   ├── url-detail/
        │   ├── favourites/
        │   └── search/
        └── servicios/
```

---

## REST API

Base URL: `/api/categorias`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all categories |
| POST | `/` | Create new category |
| DELETE | `/:id` | Delete category and all nested URLs |
| PUT | `/:id/add-url` | Add URL to category |
| PUT | `/:categoryId/update-url/:urlId` | Update URL metadata |
| DELETE | `/:categoryId/delete-url/:urlId` | Delete a URL |

All endpoints return JSON. The backend follows a layered architecture: Routes handle HTTP, Services encapsulate business logic, and MongoLib abstracts database operations.

---

## Local Development
```bash
# Clone the repository
git clone https://github.com/AdrianMalmierca/Categorify
```

### Backend
```bash
cd backend
npm install
npm run start
```

Environment variables required:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

API available at: `http://localhost:3000/api/categorias`

### Frontend
```bash
cd frontend
npm install
ng serve
```

Frontend at `http://localhost:4200` — update the API base URL in the service to point to `localhost:3000` for local development.

---

## Key Engineering Decisions

### Why embedded documents in MongoDB?
URL items live inside their parent category document rather than in a separate collection. This simplifies reads — loading a category returns all its URLs in a single query — at the cost of some update complexity. For this scale and use case, the tradeoff is clearly worth it.

### Why BehaviorSubject over Angular Signals?
The app was built before Signals became the standard Angular recommendation. BehaviorSubject from RxJS provides a reactive single source of truth that components subscribe to — any mutation triggers a backend sync and a full state reload, guaranteeing consistency across views.

### Why Base64 for images?
Storing images as Base64 strings in MongoDB avoids the need for a separate file storage service (S3, Cloudinary). It's the simplest approach for a portfolio-scale app — no external dependencies, no presigned URLs, no CORS issues.

---

## Future Improvements

### Short Term
- Validation middleware with Joi
- Pagination for large category datasets
- Unit and integration tests

### Medium Term
- Authentication and user accounts (each user owns their categories)
- Dockerization for local and CI environments
- Optimized MongoDB queries (avoid full collection fetch on updates)
- Environment-based API configuration

### Long Term
- Migrate image storage to Cloudinary or S3
- Migrate state management to Angular Signals
- Tag system for cross-category URL labeling
- Import/export from browser bookmarks

---

## What I Learned Building This

This was my first complete full-stack Angular project — and the hardest part wasn't writing code, it was understanding *how* Angular thinks. The component/service boundary, how services hold shared state, how `BehaviorSubject` connects a service mutation to a template update — none of that clicked immediately.

Once it did, the pattern became very logical: services own the data, components own the presentation, and RxJS streams connect them. Building CategoryService to be the single source of truth for the entire app — handling all CRUD, synchronizing state after every mutation, and deriving favorites dynamically — was the moment that pattern became concrete for me.

Deploying on Render with a live MongoDB instance was also new ground. Getting CORS, environment variables, and production build configuration right across two separate services taught me that deployment is its own engineering problem, not just an afterthought.

---

## License

MIT — free to use, modify, and deploy.

---

## Author

**Adrián Martín Malmierca**  
Computer Engineer & Mobile Applications Master's Student  
[GitHub](https://github.com/AdrianMalmierca) · [LinkedIn](https://www.linkedin.com/in/adri%C3%A1n-mart%C3%ADn-malmierca-4aa6b0293/)

*Built as a portfolio project demonstrating full-stack Angular + Node.js development, deployed live on Render.*