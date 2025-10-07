/*
  Minimal frontend API client for the ArtRewards Laravel backend.
  Configure the base URL by setting `window.API_BASE_URL` before this script loads.
  Defaults to relative "/api" which works when frontend is served by the same host as Laravel.
*/

(function () {
  const DEFAULT_API_BASE = "/api";
  const API_BASE = typeof window !== "undefined" && window.API_BASE_URL
    ? String(window.API_BASE_URL).replace(/\/$/, "")
    : DEFAULT_API_BASE;

  function buildUrl(path) {
    const cleanPath = String(path || "").replace(/^\//, "");
    return `${API_BASE}/${cleanPath}`;
  }

  async function request(path, options) {
    const url = buildUrl(path);
    const headers = Object.assign(
      { "Accept": "application/json" },
      options && options.headers ? options.headers : {}
    );

    const fetchOptions = Object.assign({}, options, { headers });

    const res = await fetch(url, fetchOptions);
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const error = new Error(`Request failed: ${res.status}`);
      error.status = res.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  // Health check
  async function health() {
    return request("health", { method: "GET" });
  }

  // Artworks
  async function listArtworks(params) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request(`artworks${query}`, { method: "GET" });
  }

  // Collections CRUD
  async function listCollections(params) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request(`collections${query}`, { method: "GET" });
  }

  async function getCollection(collectionId) {
    return request(`collections/${encodeURIComponent(collectionId)}`, { method: "GET" });
  }

  async function createCollection(payload) {
    // Supports either JSON (title, description, cover_image_url, artist_id)
    // or FormData with a File under 'cover_image'
    if (payload instanceof FormData) {
      return request("collections", {
        method: "POST",
        body: payload
      });
    }
    return request("collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {})
    });
  }

  async function updateCollection(collectionId, payload) {
    if (payload instanceof FormData) {
      return request(`collections/${encodeURIComponent(collectionId)}`, {
        method: "POST",
        headers: { "X-HTTP-Method-Override": "PUT" },
        body: payload
      });
    }
    return request(`collections/${encodeURIComponent(collectionId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {})
    });
  }

  async function deleteCollection(collectionId) {
    return request(`collections/${encodeURIComponent(collectionId)}`, { method: "DELETE" });
  }

  async function addArtworksToCollection(collectionId, artworkIds) {
    return request(`collections/${encodeURIComponent(collectionId)}/artworks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artworks: artworkIds })
    });
  }

  async function removeArtworkFromCollection(collectionId, artworkId) {
    return request(`collections/${encodeURIComponent(collectionId)}/artworks/${encodeURIComponent(artworkId)}`, {
      method: "DELETE"
    });
  }

  // Expose as a tiny client on window for easy use from HTML
  const api = {
    get baseUrl() { return API_BASE; },
    health,
    artworks: { list: listArtworks },
    collections: {
      list: listCollections,
      get: getCollection,
      create: createCollection,
      update: updateCollection,
      delete: deleteCollection,
      addArtworks: addArtworksToCollection,
      removeArtwork: removeArtworkFromCollection
    }
  };

  if (typeof window !== "undefined") {
    window.ArtRewardsAPI = api;
  }

  // Optional: auto-ping health in dev for quick feedback (no throw)
  try { health().catch(() => {}); } catch (_) {}
})();

// ---------------- UI Wiring for Collections Page ----------------
(function () {
  if (typeof window === "undefined" || !window.ArtRewardsAPI) return;

  const api = window.ArtRewardsAPI;

  // Elements
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const collectionsGrid = document.getElementById("collectionsGrid");
  const emptyState = document.getElementById("emptyState");
  const createBtn = document.getElementById("createBtn");
  const emptyCreateBtn = document.getElementById("emptyCreateBtn");
  const gridView = document.getElementById("gridView");
  const detailView = document.getElementById("detailView");

  // Form elements
  const collectionFormModalEl = document.getElementById("collectionFormModal");
  const formTitle = document.getElementById("formTitle");
  const collectionIdInput = document.getElementById("collectionId");
  const titleInput = document.getElementById("titleInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const titleError = document.getElementById("titleError");
  const descriptionError = document.getElementById("descriptionError");
  const charCount = document.getElementById("charCount");
  const submitFormBtn = document.getElementById("submitFormBtn");
  const coverUploadInput = document.getElementById("coverUpload");
  const coverError = document.getElementById("coverError");
  const emptyStateTitle = document.getElementById("emptyStateTitle");

  let allCollections = [];
  let filteredCollections = [];

  function normalizeListResponse(res) {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data; // Laravel paginator shape
    return [];
  }

  function setEmptyState(visible) {
    if (!emptyState) return;
    emptyState.classList.toggle("d-none", !visible);
  }

  function renderCollections(list) {
    if (!collectionsGrid) return;
    collectionsGrid.innerHTML = "";

    if (!list || list.length === 0) {
      setEmptyState(true);
      return;
    }
    setEmptyState(false);

    list.forEach(function (c) {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";
      col.setAttribute("data-id", c.id);
      const title = (c.title || c.name || "Untitled");
      const description = c.description || "";
      const artworksCount = (c.artworks_count != null ? c.artworks_count : (c.artworks ? c.artworks.length : 0));
      col.innerHTML = (
        '<div class="card shadow-sm h-100">' +
          '<div class="card-body d-flex flex-column">' +
            `<h5 class="card-title mb-2">${escapeHtml(title)}</h5>` +
            `<p class="card-text text-muted flex-grow-1">${escapeHtml(description)}</p>` +
            `<div class="d-flex justify-content-between align-items-center">` +
              `<span class="text-muted small">${artworksCount} artworks</span>` +
              `<div class="d-flex gap-2">` +
                `<button class="btn btn-outline-secondary btn-sm" data-action="view" data-id="${c.id}">View</button>` +
                `<button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${c.id}">Delete</button>` +
              `</div>` +
            `</div>` +
          '</div>' +
        '</div>'
      );
      collectionsGrid.appendChild(col);
    });

    // attach handlers
    collectionsGrid.querySelectorAll('button[data-action="view"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        if (!id) return;
        openDetail(id);
      });
    });
    collectionsGrid.querySelectorAll('button[data-action="delete"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        if (!id) return;
        if (!confirm("Delete this collection?")) return;
        api.collections.delete(id)
          .then(reloadCollections)
          .catch(showErrorToast);
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function applyFilters() {
    const q = (searchInput && searchInput.value || "").toLowerCase().trim();
    const sortBy = (sortSelect && sortSelect.value) || "newest";

    let list = allCollections.slice(0);
    if (q) {
      list = list.filter(function (c) {
        const title = (c.title || c.name || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    list.sort(function (a, b) {
      if (sortBy === "oldest") {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      if (sortBy === "title-asc") {
        return String(a.title || a.name || "").localeCompare(String(b.title || b.name || ""));
      }
      if (sortBy === "title-desc") {
        return String(b.title || b.name || "").localeCompare(String(a.title || a.name || ""));
      }
      if (sortBy === "most-artworks") {
        const ac = (a.artworks_count != null ? a.artworks_count : (a.artworks ? a.artworks.length : 0));
        const bc = (b.artworks_count != null ? b.artworks_count : (b.artworks ? b.artworks.length : 0));
        return bc - ac;
      }
      if (sortBy === "least-artworks") {
        const ac = (a.artworks_count != null ? a.artworks_count : (a.artworks ? a.artworks.length : 0));
        const bc = (b.artworks_count != null ? b.artworks_count : (b.artworks ? b.artworks.length : 0));
        return ac - bc;
      }
      // default newest
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    filteredCollections = list;
    renderCollections(filteredCollections);
  }

  function reloadCollections() {
    api.collections.list()
      .then(function (res) {
        allCollections = normalizeListResponse(res);
        applyFilters();
      })
      .catch(showErrorToast);
  }

  // Detail view
  function openDetail(collectionId) {
    api.collections.get(collectionId)
      .then(function (col) {
        renderDetail(col);
        if (gridView) gridView.classList.add("d-none");
        if (detailView) detailView.classList.remove("d-none");
      })
      .catch(showErrorToast);
  }

  function closeDetail() {
    if (detailView) detailView.classList.add("d-none");
    if (gridView) gridView.classList.remove("d-none");
    reloadCollections();
  }

  function renderDetail(c) {
    if (!detailView) return;
    const title = (c.title || c.name || "Untitled");
    const description = c.description || "";
    const artworks = Array.isArray(c.artworks) ? c.artworks : [];
    const artworksCount = (c.artworks_count != null ? c.artworks_count : artworks.length);

    detailView.innerHTML = (
      '<div class="d-flex justify-content-between align-items-center mb-3">' +
        `<h2 class="h4 m-0">${escapeHtml(title)}</h2>` +
        '<div class="d-flex gap-2">' +
          `<button id="backToGridBtn" class="btn btn-outline-secondary btn-sm">Back</button>` +
          `<button id="editCollectionBtn" class="btn btn-dark btn-sm">Edit</button>` +
          `<button id="deleteCollectionBtn" class="btn btn-danger btn-sm">Delete</button>` +
        '</div>' +
      '</div>' +
      `<p class="text-muted">${escapeHtml(description)}</p>` +
      `<p class="text-muted"><strong>${artworksCount}</strong> artworks</p>` +
      '<div class="row g-3" id="detailArtworksGrid"></div>'
    );

    const backBtn = document.getElementById("backToGridBtn");
    const editBtn = document.getElementById("editCollectionBtn");
    const deleteBtn = document.getElementById("deleteCollectionBtn");
    const grid = document.getElementById("detailArtworksGrid");

    if (backBtn) backBtn.addEventListener("click", closeDetail);
    if (editBtn) editBtn.addEventListener("click", function () { openEditModal(c); });
    if (deleteBtn) deleteBtn.addEventListener("click", function () {
      if (!confirm("Delete this collection?")) return;
      api.collections.delete(c.id).then(function () { closeDetail(); }).catch(showErrorToast);
    });

    if (grid && artworks.length) {
      artworks.forEach(function (a) {
        const div = document.createElement("div");
        div.className = "col-12 col-sm-6 col-lg-4";
        const title = a.title || a.name || "Artwork";
        div.innerHTML = (
          '<div class="card h-100">' +
            '<div class="card-body">' +
              `<h6 class="card-title">${escapeHtml(title)}</h6>` +
            '</div>' +
          '</div>'
        );
        grid.appendChild(div);
      });
    }
  }

  // Create collection flow
  function openCreateModal() {
    if (!collectionFormModalEl) return;
    formTitle && (formTitle.textContent = "Create New Collection");
    collectionIdInput && (collectionIdInput.value = "");
    titleInput && (titleInput.value = "");
    descriptionInput && (descriptionInput.value = "");
    updateCharCount();
    hideFieldErrors();
    const modal = bootstrap && bootstrap.Modal ? new bootstrap.Modal(collectionFormModalEl) : null;
    if (modal) modal.show();
  }

  function openEditModal(collection) {
    if (!collectionFormModalEl) return;
    formTitle && (formTitle.textContent = "Edit Collection");
    collectionIdInput && (collectionIdInput.value = collection.id);
    titleInput && (titleInput.value = collection.title || collection.name || "");
    descriptionInput && (descriptionInput.value = collection.description || "");
    updateCharCount();
    hideFieldErrors();
    const modal = bootstrap && bootstrap.Modal ? new bootstrap.Modal(collectionFormModalEl) : null;
    if (modal) modal.show();
  }

  function hideFieldErrors() {
    if (titleError) titleError.classList.add("d-none");
    if (descriptionError) descriptionError.classList.add("d-none");
  }

  function updateCharCount() {
    if (!charCount || !descriptionInput) return;
    charCount.textContent = String(descriptionInput.value.length || 0);
  }

  function handleSubmitCreate() {
    hideFieldErrors();
    const title = titleInput ? titleInput.value.trim() : "";
    const description = descriptionInput ? descriptionInput.value.trim() : "";
    const id = collectionIdInput ? collectionIdInput.value : "";
    const coverFile = coverUploadInput && coverUploadInput.files && coverUploadInput.files[0] ? coverUploadInput.files[0] : null;

    let hasError = false;
    if (!title) {
      if (titleError) {
        titleError.textContent = "Title is required";
        titleError.classList.remove("d-none");
      }
      hasError = true;
    }
    if (!description) {
      if (descriptionError) {
        descriptionError.textContent = "Description is required";
        descriptionError.classList.remove("d-none");
      }
      hasError = true;
    }
    if (hasError) return;

    // Laravel requires artist_id on create. Use 1 by default (seeded Demo Artist)
    let op;
    if (id) {
      if (coverFile) {
        const fd = new FormData();
        fd.set('title', title);
        fd.set('description', description);
        fd.set('cover_image', coverFile);
        op = api.collections.update(id, fd);
      } else {
        op = api.collections.update(id, { title: title, description: description });
      }
    } else {
      if (coverFile) {
        const fd = new FormData();
        fd.set('artist_id', '1');
        fd.set('title', title);
        fd.set('description', description);
        fd.set('cover_image', coverFile);
        op = api.collections.create(fd);
      } else {
        op = api.collections.create({ artist_id: 1, title: title, description: description, cover_image_url: 'https://via.placeholder.com/600x400?text=Cover' });
      }
    }

    op.then(function () {
        if (collectionFormModalEl && bootstrap && bootstrap.Modal) {
          bootstrap.Modal.getInstance(collectionFormModalEl)?.hide();
        }
        if (id) {
          showToast("Collection updated");
          if (!detailView || detailView.classList.contains("d-none")) {
            reloadCollections();
          } else {
            openDetail(id);
          }
        } else {
          showToast("Collection created");
          reloadCollections();
        }
      })
      .catch(showErrorToast);
  }

  // Toast helpers (simple fallback)
  function showToast(message) {
    try {
      const toastContainer = document.getElementById("toastContainer");
      if (!toastContainer) { console.log(message); return; }
      const div = document.createElement("div");
      div.className = "toast align-items-center text-bg-dark border-0 show mb-2";
      div.setAttribute("role", "alert");
      div.innerHTML = `<div class="d-flex"><div class="toast-body">${escapeHtml(message)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
      toastContainer.appendChild(div);
      setTimeout(function () { div.remove(); }, 3000);
    } catch (_) {
      console.log(message);
    }
  }

  function showErrorToast(err) {
    const msg = err && err.body && err.body.message
      ? err.body.message
      : (err && err.message ? err.message : "Something went wrong");
    showToast(msg);
  }

  // Event wiring
  if (searchInput) {
    let t;
    searchInput.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(applyFilters, 250);
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", applyFilters);
  }
  if (emptyCreateBtn) emptyCreateBtn.addEventListener("click", openCreateModal);
  if (createBtn) createBtn.addEventListener("click", openCreateModal);
  if (descriptionInput) descriptionInput.addEventListener("input", updateCharCount);
  if (coverUploadInput) coverUploadInput.addEventListener("change", function(){ if (coverError) coverError.classList.add('d-none'); });
  if (submitFormBtn) submitFormBtn.addEventListener("click", handleSubmitCreate);

  // Initial load
  if (collectionsGrid) {
    reloadCollections();
  }
})();

// ---------------- Artwork Creation (basic) ----------------
(function () {
  if (typeof window === "undefined" || !window.ArtRewardsAPI) return;
  const api = window.ArtRewardsAPI;

  // Add a simple helper on the global API for creating an artwork with FormData or JSON
  api.artworks.create = function (payload) {
    if (payload instanceof FormData) {
      return fetch(`${api.baseUrl}/artworks`, { method: 'POST', body: payload })
        .then(function (r) { return r.json(); });
    }
    return fetch(`${api.baseUrl}/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload || {})
    }).then(function (r) { return r.json(); });
  };
})();

