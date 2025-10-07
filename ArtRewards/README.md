## ArtRewards – Backend API (Laravel) and Frontend (Vanilla JS)

This repo contains a Laravel API and a simple static frontend for managing artists, artworks, and collections, including image uploads.

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ (only for optional static server; the frontend is plain HTML/JS)
- Git

### Folder layout
- `ArtRewards/` – Laravel backend (API)
- `ArtRewards FrontEnd/` – Static frontend (HTML/CSS/JS)

---

## 1) Backend – Laravel API

### Setup
From `ArtRewards/`:

```bash
composer install
cp .env.example .env   # on Windows: copy .env.example .env
php artisan key:generate
```

Database (SQLite is preconfigured):

```bash
# Ensure the sqlite file exists (the repo already includes one):
# database/database.sqlite

php artisan migrate --seed
php artisan storage:link
```

Run the API:

```bash
php artisan serve
# API base will be http://127.0.0.1:8000/api
```

Health check:
```bash
curl http://127.0.0.1:8000/api/health
```

### Available API endpoints
- `GET /api/collections?search=&sort=&per_page=` – list with search/sort/pagination
- `POST /api/collections` – create
  - FormData: `artist_id` (int), `title` (string), `description` (string), `cover_image` (file)
  - or JSON: `artist_id`, `title`, `description`, `cover_image_url`
- `GET /api/collections/{id}` – show (includes `artworks`)
- `PUT /api/collections/{id}` – update (JSON or FormData with `cover_image`)
- `DELETE /api/collections/{id}` – delete
- `POST /api/collections/{id}/artworks` – attach artworks
  - JSON: `{ "artwork_ids": number[] }`
- `DELETE /api/collections/{id}/artworks/{artworkId}` – detach artwork

- `GET /api/artworks?search=&sort=&per_page=` – list artworks
- `POST /api/artworks` – create artwork
  - FormData: `title`, `artist_name`, optional `category`, `price_cents`, `image` (file)
  - or JSON: `title`, `artist_name`, optional `image_url`, `link`, etc.

Notes
- Image uploads are stored under `storage/app/public/...` and served via `public/storage` (enabled by `php artisan storage:link`).
- The API returns absolute `cover_image_url`/`image_url` so the frontend can render images directly.

---

## 2) Frontend – Static site

The frontend is a static page that calls the API via `fetch`. You can open it with any static HTTP server.

### Configure API URL
In `ArtRewards FrontEnd/index.html`, we set the API base:

```html
<script>window.API_BASE_URL = 'http://127.0.0.1:8000/api';</script>
```

### Run the frontend
Option A: VS Code Live Server (or any dev server that serves the folder).

Option B: Node’s simple static server (from project root):

```bash
npx serve "ArtRewards FrontEnd" -l 56258
# Then open http://localhost:56258
```

### What’s implemented in the frontend
- Collections grid with search/sort (client-side) and detail view
- Create/Edit collection with cover image upload (drag-and-drop or click)
- Delete collection
- Artwork selection modal (pagination), add artworks to a collection
- Remove artwork from a collection
- Renders collection cover and artwork thumbnails; shows artwork title and artist name

---

## 3) How the API was created (high-level steps)

1. Models and Migrations
   - `Artist`, `Artwork`, `Collection` tables; pivot `collection_artwork`
   - Relationships set in models (`Collection` has many `artworks` via pivot; belongs to `artist`)

2. Validation Requests
   - `StoreCollectionRequest`, `UpdateCollectionRequest`, `AddArtworksRequest` encapsulate validation rules

3. Controllers
   - `CollectionController` with actions: `index`, `store`, `show`, `update`, `destroy`, `addArtworks`, `removeArtwork`
   - `ArtworkController` with `index`, `store`
   - Image handling with `$request->file(...)->store('covers','public')` and public URL via `asset('storage/...')`

4. Routes (`routes/api.php`)
   - REST endpoints for collections and artworks (see list above)

5. Pagination, Search, Sort
   - `index` actions accept `search`, `sort`, `per_page`; use Eloquent query builders and return Laravel paginator JSON

6. Seeds
   - Seeders create sample artists, artworks, collections for quick testing

7. Frontend integration
   - Vanilla JS client in `ArtRewards FrontEnd/script.js`
   - Uses FormData for uploads and JSON for other calls; renders images by `cover_image_url` / `image_url`

---

## Troubleshooting
- Images don’t show
  - Run `php artisan storage:link`
  - Ensure `window.API_BASE_URL` points to your API origin
  - Open the image URL from the API response directly in the browser to verify access
- 404/Network errors
  - Check that `php artisan serve` is running and CORS isn’t blocked when serving the frontend from another origin

---

