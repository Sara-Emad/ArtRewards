// ================= state and Dummy Data=====================
const state = {
    collections: [],
    currentView: 'grid',
    selectedCollection: null,
    searchTerm: '',
    sortOption: 'newest',
    currentPage: 1,
    itemsPerPage: 6,
    deleteConfirmId: null,
    artworkDeleteConfirm: null,
    selectedArtworks: [],
    editingCollection: null,
    availableArtworks: [
        { 
            id: 1, 
            image: 'https://picsum.photos/300/400?random=1', 
            title: 'Rare Bird VI', 
            artist: 'Mark Hellbusch',
            price: '$690',
            category: 'Painting',
            link: '/artwork/1'
        },
        { 
            id: 2, 
            image: 'https://picsum.photos/300/400?random=2', 
            title: 'Mountain Dreams', 
            artist: 'Sarah Johnson',
            price: '$850',
            category: 'Photography',
            link: '/artwork/2'
        },
        { 
            id: 3, 
            image: 'https://picsum.photos/300/400?random=3', 
            title: 'Ocean Waves', 
            artist: 'Michael Chen',
            price: '$720',
            category: 'Digital Art',
            link: '/artwork/3'
        },
        { 
            id: 4, 
            image: 'https://picsum.photos/300/400?random=4', 
            title: 'Urban Life', 
            artist: 'Emma Davis',
            price: '$950',
            category: 'Mixed Media',
            link: '/artwork/4'
        },
        { 
            id: 5, 
            image: 'https://picsum.photos/300/400?random=5', 
            title: 'Desert Soul', 
            artist: 'Alex Rodriguez',
            price: '$680',
            category: 'Sculpture',
            link: '/artwork/5'
        },
        { 
            id: 6, 
            image: 'https://picsum.photos/300/400?random=6', 
            title: 'Forest Magic', 
            artist: 'Lisa Wang',
            price: '$890',
            category: 'Painting',
            link: '/artwork/6'
        },
        { 
            id: 7, 
            image: 'https://picsum.photos/300/400?random=7', 
            title: 'Sunset Glow', 
            artist: 'David Kim',
            price: '$780',
            category: 'Photography',
            link: '/artwork/7'
        },
        { 
            id: 8, 
            image: 'https://picsum.photos/300/400?random=8', 
            title: 'Winter Mist', 
            artist: 'Maria Garcia',
            price: '$920',
            category: 'Digital Art',
            link: '/artwork/8'
        },
    ],
    collectionArtworksSearchTerm: '',
    collectionArtworksSortOption: 'newest',
    collectionArtworksCurrentPage: 1,
    collectionArtworksPerPage: 6,
    availableArtworksSearchTerm: '',
    availableArtworksSortOption: 'newest',
    availableArtworksCurrentPage: 1,
    availableArtworksPerPage: 6
};

// ================= DOM=====================
const elements = {
    gridView: document.getElementById('gridView'),
    detailView: document.getElementById('detailView'),
    collectionsGrid: document.getElementById('collectionsGrid'),
    pagination: document.getElementById('pagination'),
    emptyState: document.getElementById('emptyState'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    createBtn: document.getElementById('createBtn'),
    emptyCreateBtn: document.getElementById('emptyCreateBtn'),
    collectionFormModal: document.getElementById('collectionFormModal'),
    collectionForm: document.getElementById('collectionForm'),
    titleInput: document.getElementById('titleInput'),
    descriptionInput: document.getElementById('descriptionInput'),
    coverUpload: document.getElementById('coverUpload'),
    coverPreview: document.getElementById('coverPreview'),
    submitFormBtn: document.getElementById('submitFormBtn'),
    deleteModal: document.getElementById('deleteModal'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    artworkDeleteModal: document.getElementById('artworkDeleteModal'),
    confirmArtworkDeleteBtn: document.getElementById('confirmArtworkDeleteBtn'),
    artworkSelectionModal: document.getElementById('artworkSelectionModal'),
    artworksGrid: document.getElementById('artworksGrid'),
    addArtworksBtn: document.getElementById('addArtworksBtn'),
    fullscreenOverlay: document.getElementById('fullscreenOverlay'),
    fullscreenImage: document.getElementById('fullscreenImage'),
    artworksPagination: document.getElementById('artworksPagination')
};

// ================= Helper function to find artwork by ID ================
function findArtworkById(artworkId) {
    return state.availableArtworks.find(artwork => artwork.id === artworkId);
}

// ================= Func to show toast =================
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast show custom-toast ${type} mb-2`;
    toast.innerHTML = `
        <div class="toast-body d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ================= Func to reset and validate form ================
function resetFormValidation() {
    elements.titleInput.classList.remove('is-invalid');
    elements.descriptionInput.classList.remove('is-invalid');
    elements.coverUpload.classList.remove('is-invalid');
    document.getElementById('titleError').classList.add('d-none');
    document.getElementById('descriptionError').classList.add('d-none');
    document.getElementById('coverError').classList.add('d-none');    
    document.getElementById('titleError').textContent = '';
    document.getElementById('descriptionError').textContent = '';
    document.getElementById('coverError').textContent = '';
}

// ================= Func to validate form fields =================
function validateForm() {
    let isValid = true;    
    resetFormValidation();    
    if (!elements.titleInput.value.trim()) {
        elements.titleInput.classList.add('is-invalid');
        document.getElementById('titleError').textContent = 'Title is required';
        document.getElementById('titleError').classList.remove('d-none');
        isValid = false;
    } else if (elements.titleInput.value.trim().length < 2) {
        elements.titleInput.classList.add('is-invalid');
        document.getElementById('titleError').textContent = 'Title must be at least 2 characters';
        document.getElementById('titleError').classList.remove('d-none');
        isValid = false;
    } else if (elements.titleInput.value.trim().length > 50) {
        elements.titleInput.classList.add('is-invalid');
        document.getElementById('titleError').textContent = 'Title must be less than 50 characters';
        document.getElementById('titleError').classList.remove('d-none');
        isValid = false;
    }
    
    if (!elements.descriptionInput.value.trim()) {
        elements.descriptionInput.classList.add('is-invalid');
        document.getElementById('descriptionError').textContent = 'Description is required';
        document.getElementById('descriptionError').classList.remove('d-none');
        isValid = false;
    }  else if (elements.descriptionInput.value.trim().length > 200) {
        elements.descriptionInput.classList.add('is-invalid');
        document.getElementById('descriptionError').textContent = 'Description must be less than 200 characters';
        document.getElementById('descriptionError').classList.remove('d-none');
        isValid = false;
    }
    
    if (!state.editingCollection) {
        if (!elements.coverUpload.files[0]) {
            elements.coverUpload.classList.add('is-invalid');
            document.getElementById('coverError').textContent = 'Cover image is required';
            document.getElementById('coverError').classList.remove('d-none');
            isValid = false;
        } else {
            const file = elements.coverUpload.files[0];
            if (file.size > 5242880) {
                elements.coverUpload.classList.add('is-invalid');
                document.getElementById('coverError').textContent = 'File too large (max 5MB)';
                document.getElementById('coverError').classList.remove('d-none');
                isValid = false;
            } else if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                elements.coverUpload.classList.add('is-invalid');
                document.getElementById('coverError').textContent = 'Unsupported file format';
                document.getElementById('coverError').classList.remove('d-none');
                isValid = false;
            }
        }
    } else {
        if (!elements.coverUpload.files[0] && !state.editingCollection.coverImage) {
            elements.coverUpload.classList.add('is-invalid');
            document.getElementById('coverError').textContent = 'Cover image is required';
            document.getElementById('coverError').classList.remove('d-none');
            isValid = false;
        } else if (elements.coverUpload.files[0]) {
            const file = elements.coverUpload.files[0];
            if (file.size > 5242880) {
                elements.coverUpload.classList.add('is-invalid');
                document.getElementById('coverError').textContent = 'File too large (max 5MB)';
                document.getElementById('coverError').classList.remove('d-none');
                isValid = false;
            } else if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                elements.coverUpload.classList.add('is-invalid');
                document.getElementById('coverError').textContent = 'Unsupported file format';
                document.getElementById('coverError').classList.remove('d-none');
                isValid = false;
            }
        }
    }
    
    return isValid;
}

// =================func to validate individual field================
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (!field || !errorElement) {
        console.warn(`Element not found: ${fieldName} or ${fieldName}Error`);
        return true;
    }
    
    field.classList.remove('is-invalid');
    errorElement.classList.add('d-none');
    let isValid = true;
    
    switch(fieldName) {
        case 'titleInput':
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                errorElement.textContent = 'Title is required';
                errorElement.classList.remove('d-none');
                isValid = false;
            } else if (field.value.trim().length < 2) {
                field.classList.add('is-invalid');
                errorElement.textContent = 'Title must be at least 2 characters';
                errorElement.classList.remove('d-none');
                isValid = false;
            } else if (field.value.trim().length > 50) {
                field.classList.add('is-invalid');
                errorElement.textContent = 'Title must be less than 50 characters';
                errorElement.classList.remove('d-none');
                isValid = false;
            }
            break;
            
        case 'descriptionInput':
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                errorElement.textContent = 'Description is required';
                errorElement.classList.remove('d-none');
                isValid = false;
            } else if (field.value.trim().length > 200) {
                field.classList.add('is-invalid');
                errorElement.textContent = 'Description must be less than 200 characters';
                errorElement.classList.remove('d-none');
                isValid = false;
            }
            break;
            
        case 'coverUpload':
            if (!state.editingCollection) {
                if (!field.files[0]) {
                    field.classList.add('is-invalid');
                    errorElement.textContent = 'Cover image is required';
                    errorElement.classList.remove('d-none');
                    isValid = false;
                } else {
                    const file = field.files[0];
                    if (file.size > 5242880) {
                        field.classList.add('is-invalid');
                        errorElement.textContent = 'File too large (max 5MB)';
                        errorElement.classList.remove('d-none');
                        isValid = false;
                    } else if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                        field.classList.add('is-invalid');
                        errorElement.textContent = 'Unsupported file format';
                        errorElement.classList.remove('d-none');
                        isValid = false;
                    }
                }
            } else {
                if (!field.files[0] && !state.editingCollection.coverImage) {
                    field.classList.add('is-invalid');
                    errorElement.textContent = 'Cover image is required';
                    errorElement.classList.remove('d-none');
                    isValid = false;
                } else if (field.files[0]) {
                    const file = field.files[0];
                    if (file.size > 5242880) {
                        field.classList.add('is-invalid');
                        errorElement.textContent = 'File too large (max 5MB)';
                        errorElement.classList.remove('d-none');
                        isValid = false;
                    } else if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                        field.classList.add('is-invalid');
                        errorElement.textContent = 'Unsupported file format';
                        errorElement.classList.remove('d-none');
                        isValid = false;
                    }
                }
            }
            break;
    }
    return isValid;
}

// =====================func to handle collections=================
function createCollection() {
    state.editingCollection = null;
    document.getElementById('formTitle').textContent = 'Create New Collection';
    elements.submitFormBtn.textContent = 'Create Collection';    
    elements.collectionForm.reset();
    document.getElementById('collectionId').value = '';
    document.getElementById('charCount').textContent = '0';    
    elements.coverPreview.innerHTML = `
        <i class="fas fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
        <p class="mb-1 text-muted"><span class="fw-semibold">Click to upload</span> or drag and drop</p>
        <p class="small text-muted">PNG, JPG, WEBP (MAX. 5MB)</p>
    `;    
    resetFormValidation();    
    elements.coverUpload.value = '';
    new bootstrap.Modal(elements.collectionFormModal).show();
}

// =================Func to edit collection================
function editCollection(collection) {
    state.editingCollection = collection;
    document.getElementById('formTitle').textContent = 'Edit Collection';
    elements.submitFormBtn.textContent = 'Update Collection';
    document.getElementById('collectionId').value = collection.id;
    elements.titleInput.value = collection.title;
    elements.descriptionInput.value = collection.description;
    document.getElementById('charCount').textContent = collection.description.length;    
    elements.coverPreview.innerHTML = `<img src="${collection.coverImage}" alt="Cover preview" class="img-fluid rounded">`;    
    resetFormValidation();    
    elements.coverUpload.value = '';
    new bootstrap.Modal(elements.collectionFormModal).show();
}

// ======================Func to submit form=================
function submitCollectionForm() {
    if (!validateForm()) return;
    const formData = {
        title: elements.titleInput.value.trim(),
        description: elements.descriptionInput.value.trim(),
        coverImage: elements.coverUpload.files[0]
    };
    
    if (state.editingCollection) {
        const coverImageUrl = formData.coverImage instanceof File ? 
            URL.createObjectURL(formData.coverImage) : state.editingCollection.coverImage;        
        state.collections = state.collections.map(collection =>
            collection.id === state.editingCollection.id
                ? {
                    ...collection,
                    title: formData.title,
                    description: formData.description,
                    coverImage: coverImageUrl
                }
                : collection
        );
        
        if (state.selectedCollection && state.selectedCollection.id === state.editingCollection.id) {
            state.selectedCollection = {
                ...state.selectedCollection,
                title: formData.title,
                description: formData.description,
                coverImage: coverImageUrl
            };
        }
        
        showToast('Collection updated successfully');        
        if (state.currentView === 'detail' && state.selectedCollection && state.selectedCollection.id === state.editingCollection.id) {
            renderDetailView();
        }        
        renderCollections();
        
    } else {
        const newCollection = {
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            coverImage: URL.createObjectURL(formData.coverImage),
            artworks: []
        };
        state.collections.push(newCollection);
        showToast('Collection created successfully');        
        elements.createBtn.classList.remove('d-none');        
        renderCollections();
    }    
    const modal = bootstrap.Modal.getInstance(elements.collectionFormModal);
    modal.hide();
}

// ================= Func to open artwork details ================
function openArtworkDetails(artworkId) {
    const artwork = findArtworkById(artworkId);
    if (artwork) {
        console.log('🎨 Opening artwork details:', artwork);
        alert(`you will go to artwork number ${artwork.id}`);

         // u will add the redirect to the artwork details page here
        // window.location.href = artwork.link;
    } else {
        console.error('Artwork not found with ID:', artworkId);
    }
}

// ===================func to delete collection ================
function deleteCollection(id) {
    state.deleteConfirmId = id;
    new bootstrap.Modal(elements.deleteModal).show();
}

function confirmDelete() {
    state.collections = state.collections.filter(collection => collection.id !== state.deleteConfirmId);
    
    if (state.selectedCollection && state.selectedCollection.id === state.deleteConfirmId) {
        showDetailView('grid');
    }
    
    if (state.collections.length === 0) {
        elements.createBtn.classList.add('d-none');
    }
    
    showToast('Collection deleted successfully');
    bootstrap.Modal.getInstance(elements.deleteModal).hide();
    renderCollections();
}

// ================= Func to switch view================
function showDetailView(collection) {
    if (collection === 'grid') {
        state.currentView = 'grid';
        state.selectedCollection = null;
        elements.gridView.classList.remove('d-none');
        elements.detailView.classList.add('d-none');
    } else {
        state.currentView = 'detail';
        state.selectedCollection = collection;
        elements.gridView.classList.add('d-none');
        elements.detailView.classList.remove('d-none');
        renderDetailView();
    }
}

// ================= Func to show live collection view ================
function showLiveCollection(collection) {
    alert(`Opening live view for: ${collection.title}`);


    //u will add the redirect to the live view page here
}

// ================= Func to show fullscreen image ================
function showFullscreenImage(imageUrl) {
    elements.fullscreenImage.src = imageUrl;
    elements.fullscreenOverlay.classList.remove('d-none');
    document.body.style.overflow = 'hidden';
}

// ================= Func to close fullscreen image ================
function closeFullscreenImage() {
    elements.fullscreenOverlay.classList.add('d-none');
    document.body.style.overflow = 'auto';
}

function renderDetailView() {
    if (!state.selectedCollection) return;    
    let filteredArtworks = state.selectedCollection.artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(state.collectionArtworksSearchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(state.collectionArtworksSearchTerm.toLowerCase())
    );
    
    filteredArtworks.sort((a, b) => {
        switch(state.collectionArtworksSortOption) {
            case 'newest':
                return b.id - a.id;
            case 'oldest':
                return a.id - b.id;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });
    
    const totalPages = Math.ceil(filteredArtworks.length / state.collectionArtworksPerPage);
    const startIndex = (state.collectionArtworksCurrentPage - 1) * state.collectionArtworksPerPage;
    const currentArtworks = filteredArtworks.slice(startIndex, startIndex + state.collectionArtworksPerPage);    
    const hasArtworks = state.selectedCollection.artworks.length > 0;
    const showAddButtonUnderDescription = hasArtworks;
    
    elements.detailView.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="detail-header">
                    <h2 class="h3 fw-bold text-dark">${state.selectedCollection.title}</h2>
                    <div class="detail-actions">
                        <button onclick="showLiveCollection(${JSON.stringify(state.selectedCollection).replace(/"/g, '&quot;')})" 
                                class="btn btn-dark d-flex align-items-center">
                               View Live Collection
                        </button>
                        <button onclick="editCollection(${JSON.stringify(state.selectedCollection).replace(/"/g, '&quot;')})" 
                                class="btn btn-outline-secondary d-flex align-items-center">
                            <i class="fas fa-edit me-2"></i> Edit
                        </button>
                        <button onclick="deleteCollection(${state.selectedCollection.id})" 
                                class="btn btn-outline-secondary d-flex align-items-center">
                             Delete Collection
                        </button>
                        <button onclick="showDetailView('grid')" class="btn btn-outline-secondary d-flex align-items-center">
                            <i class="fas fa-arrow-left me-2"></i> Back
                        </button>
                    </div>
                </div>

                <div class="d-flex flex-column flex-md-row align-items-center mb-4">
                    <div class="me-md-4 mb-3 mb-md-0">
                        <img src="${state.selectedCollection.coverImage}" 
                             alt="${state.selectedCollection.title}" 
                             class="detail-cover">
                    </div>
                    <div class="flex-grow-1 text-center text-md-start">
                        <p class="text-muted mb-3">${state.selectedCollection.description}</p>
                        ${showAddButtonUnderDescription ? `
                            <button onclick="showArtworkSelection()" class="btn btn-dark d-inline-flex align-items-center">
                                <i class="fas fa-plus me-2"></i> Add Artwork
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- ============== Search and Sort for Artworks ============== -->
                ${hasArtworks ? `
                <div class="d-flex flex-column flex-lg-row gap-3 mb-3">
                    <div class="flex-grow-1">
                        <div class="search-container position-relative">
                            <i class="fas fa-search position-absolute top-50 start-3 translate-middle-y text-muted"></i>
                            <input type="text" id="collectionArtworksSearch" placeholder="Search artworks..." 
                                   value="${state.collectionArtworksSearchTerm}"
                                   class="form-control ps-5 rounded-pill border-0 shadow-sm">
                        </div>
                    </div>                    
                    <div class="sort-container" style="min-width: 200px;">
                        <select id="collectionArtworksSort" class="form-select rounded-pill border-0 shadow-sm">
                            <option value="newest" ${state.collectionArtworksSortOption === 'newest' ? 'selected' : ''}>Newest First</option>
                            <option value="oldest" ${state.collectionArtworksSortOption === 'oldest' ? 'selected' : ''}>Oldest First</option>
                            <option value="title-asc" ${state.collectionArtworksSortOption === 'title-asc' ? 'selected' : ''}>Title (A-Z)</option>
                            <option value="title-desc" ${state.collectionArtworksSortOption === 'title-desc' ? 'selected' : ''}>Title (Z-A)</option>
                        </select>
                    </div>
                </div>
                ` : ''}

                <div class="mb-4">
                    <h3 class="h4 fw-semibold text-dark mb-3">Artworks in this Collection</h3>
                    
                    ${filteredArtworks.length === 0 ? `
                        <div class="no-artworks-state">
                            <div class="no-artworks-icon">
                                <i class="fa-regular fa-image"></i>
                            </div>
                            <h4 class="no-artworks-title">${state.collectionArtworksSearchTerm ? 'No artworks found' : 'No artworks yet'}</h4>
                            <p class="no-artworks-message">${state.collectionArtworksSearchTerm ? 'Try adjusting your search term' : 'Get started by adding artworks to this collection'}</p>
                            ${!hasArtworks ? `
                                <button onclick="showArtworkSelection()" class="btn btn-dark">
                                    <i class="fas fa-plus me-2"></i> Add Artworks
                                </button>
                            ` : ''}
                        </div>
                    ` : `
                        <div class="row g-3" id="artworksContainer">
                            ${currentArtworks.map((artwork, index) => `
                                <div class="col-sm-6 col-md-4 col-lg-3">
                                    <div class="artwork-item">
                                        <div class="artwork-image-container">
                                            <img src="${artwork.image}" 
                                                 alt="${artwork.title}" 
                                                 class="artwork-image"
                                                 onclick="openArtworkDetails(${artwork.id})">
                                            <div class="artwork-overlay">
                                                <button onclick="event.stopPropagation(); showFullscreenImage('${artwork.image}')" 
                                                        class="artwork-action-btn artwork-view-btn">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <button onclick="event.stopPropagation(); confirmArtworkDelete(${state.selectedCollection.id}, ${artwork.id})" 
                                                        class="artwork-action-btn artwork-remove-btn">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="artwork-info">
                                            <div class="artwork-title" onclick="openArtworkDetails(${artwork.id})">${artwork.title}</div>
                                            <div class="artwork-category">${artwork.category}</div>
                                            <div class="artwork-price">${artwork.price}</div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        ${totalPages > 1 ? `
                            <div class="d-flex justify-content-center mt-4">
                                ${renderArtworksPagination(totalPages)}
                            </div>
                        ` : ''}
                    `}
                </div>
            </div>
        </div>
    `;
    
    const searchInput = document.getElementById('collectionArtworksSearch');
    const sortSelect = document.getElementById('collectionArtworksSort');    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.collectionArtworksSearchTerm = e.target.value;
            state.collectionArtworksCurrentPage = 1;
            renderDetailView();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.collectionArtworksSortOption = e.target.value;
            state.collectionArtworksCurrentPage = 1;
            renderDetailView();
        });
    }
}

// ===============func to handle artworks in the collection =================
function showArtworkSelection() {
    state.selectedArtworks = [];
    state.availableArtworksCurrentPage = 1;
    renderArtworkSelection();
    new bootstrap.Modal(elements.artworkSelectionModal).show();
}

// ===============func to render artwork selection ===================
function renderArtworkSelection() {
    let filteredArtworks = state.availableArtworks.filter(artwork =>
        artwork.title.toLowerCase().includes(state.availableArtworksSearchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(state.availableArtworksSearchTerm.toLowerCase())
    );
    
    filteredArtworks.sort((a, b) => {
        switch(state.availableArtworksSortOption) {
            case 'newest':
                return b.id - a.id;
            case 'oldest':
                return a.id - b.id;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });
    
    const totalPages = Math.ceil(filteredArtworks.length / state.availableArtworksPerPage);
    const startIndex = (state.availableArtworksCurrentPage - 1) * state.availableArtworksPerPage;
    const currentArtworks = filteredArtworks.slice(startIndex, startIndex + state.availableArtworksPerPage);
    elements.artworksGrid.innerHTML = currentArtworks.map(artwork => `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="artwork-item card h-100 ${state.selectedArtworks.some(a => a.id === artwork.id) ? 'selected-artwork' : ''}"
                 onclick="toggleArtworkSelection(${artwork.id})">
                <div class="artwork-image-container">
                    <img src="${artwork.image}" 
                         alt="${artwork.title}" 
                         class="artwork-image card-img-top">
                    ${state.selectedArtworks.some(a => a.id === artwork.id) ? `
                        <div class="position-absolute top-0 end-0 m-2 bg-dark text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;">
                            <i class="fas fa-check" style="font-size: 12px;"></i>
                        </div>
                    ` : ''}
                </div>
                <div class="card-body">
                    <h6 class="card-title artwork-title">${artwork.title}</h6>
                    <p class="card-text artwork-category">${artwork.category}</p>
                    <p class="card-text artwork-price">${artwork.price}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('selectedArtworksCount').textContent = state.selectedArtworks.length;    
    if (totalPages > 1) {
        elements.artworksPagination.innerHTML = renderAvailableArtworksPagination(totalPages);
    } else {
        elements.artworksPagination.innerHTML = '';
    }
    
    if (!document.getElementById('availableArtworksSearch')) {
        const searchAndSortHTML = `
            <div class="d-flex flex-column flex-md-row gap-3 mb-4">
                <div class="flex-grow-1">
                    <div class="search-container position-relative">
                        <i class="fas fa-search position-absolute top-50 start-3 translate-middle-y text-muted"></i>
                        <input type="text" id="availableArtworksSearch" placeholder="Search artworks..." 
                               value="${state.availableArtworksSearchTerm}"
                               class="form-control ps-5 rounded-pill border-0 shadow-sm">
                    </div>
                </div>
                <div class="sort-container" style="min-width: 200px;">
                    <select id="availableArtworksSort" class="form-select rounded-pill border-0 shadow-sm">
                        <option value="newest" ${state.availableArtworksSortOption === 'newest' ? 'selected' : ''}>Newest First</option>
                        <option value="oldest" ${state.availableArtworksSortOption === 'oldest' ? 'selected' : ''}>Oldest First</option>
                        <option value="title-asc" ${state.availableArtworksSortOption === 'title-asc' ? 'selected' : ''}>Title (A-Z)</option>
                        <option value="title-desc" ${state.availableArtworksSortOption === 'title-desc' ? 'selected' : ''}>Title (Z-A)</option>
                    </select>
                </div>
            </div>
        `;
        
        elements.artworksGrid.insertAdjacentHTML('beforebegin', searchAndSortHTML);        
        document.getElementById('availableArtworksSearch').addEventListener('input', (e) => {
            state.availableArtworksSearchTerm = e.target.value;
            state.availableArtworksCurrentPage = 1;
            renderArtworkSelection();
        });
        
        document.getElementById('availableArtworksSort').addEventListener('change', (e) => {
            state.availableArtworksSortOption = e.target.value;
            state.availableArtworksCurrentPage = 1;
            renderArtworkSelection();
        });
    }
}

// ======================func to toggle artwork selection =================
function toggleArtworkSelection(artworkId) {
    const artwork = state.availableArtworks.find(a => a.id === artworkId);
    const index = state.selectedArtworks.findIndex(a => a.id === artworkId);
    
    if (index > -1) {
        state.selectedArtworks.splice(index, 1);
    } else {
        state.selectedArtworks.push(artwork);
    }
    
    renderArtworkSelection();
}

// =================== func to add artwork in the collection ===================
function addArtworksToCollection() {
    if (state.selectedArtworks.length === 0) {
        showToast('Please select at least one artwork', 'error');
        return;
    }
    const collection = state.collections.find(c => c.id === state.selectedCollection.id);
    if (collection) {
        const newArtworks = state.selectedArtworks.filter(artwork => 
            !collection.artworks.some(a => a.id === artwork.id)
        );
        
        collection.artworks.push(...newArtworks);
        
        if (state.selectedCollection.id === collection.id) {
            state.selectedCollection.artworks = collection.artworks;
        }
        
        showToast('Artworks added to collection');
        bootstrap.Modal.getInstance(elements.artworkSelectionModal).hide();        
        renderDetailView();        
        renderCollections();
    }
}

// ======================== func to show confirmation popup to remove artwork from the collection =================
function confirmArtworkDelete(collectionId, artworkId) {
    const collection = state.collections.find(c => c.id === collectionId);
    const artworkIndex = collection.artworks.findIndex(a => a.id === artworkId);
    
    state.artworkDeleteConfirm = { collectionId, artworkIndex };
    
    const isLastArtwork = collection.artworks.length === 1;
    
    document.getElementById('artworkDeleteMessage').textContent = 
        `Are you sure you want to remove this artwork from the collection?${
            isLastArtwork ? " This is the last artwork in the collection, so the entire collection will be deleted." : ""
        }`;
    
    new bootstrap.Modal(elements.artworkDeleteModal).show();
}

// ======================== func to remove artwork from the collection =================
function removeArtwork() {
    const { collectionId, artworkIndex } = state.artworkDeleteConfirm;
    const collection = state.collections.find(c => c.id === collectionId);
    const isLastArtwork = collection.artworks.length === 1;  
    if (isLastArtwork) {
        state.collections = state.collections.filter(c => c.id !== collectionId);
        showDetailView('grid');
        showToast('Last artwork removed. Collection deleted.');
        
        // ============= Hide create btn if no collections left =============
        if (state.collections.length === 0) {
            elements.createBtn.classList.add('d-none');
        }
    } else {
        collection.artworks.splice(artworkIndex, 1);
        
        if (state.selectedCollection && state.selectedCollection.id === collectionId) {
            state.selectedCollection.artworks = collection.artworks;
        }       
        showToast('Artwork removed from collection');
    }
    bootstrap.Modal.getInstance(elements.artworkDeleteModal).hide();    
    renderCollections();
    if (state.currentView === 'detail') {
        renderDetailView();
    }
}

// =======================func to render collections grid ================
function renderCollections() {
    let filteredCollections = state.collections.filter(collection =>
        collection.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(state.searchTerm.toLowerCase())
    );    
    filteredCollections.sort((a, b) => {
        switch(state.sortOption) {
            case 'newest':
                return b.id - a.id;
            case 'oldest':
                return a.id - b.id;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            case 'most-artworks':
                return b.artworks.length - a.artworks.length;
            case 'least-artworks':
                return a.artworks.length - b.artworks.length;
            default:
                return 0;
        }
    });
    
    const totalPages = Math.ceil(filteredCollections.length / state.itemsPerPage);
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const currentCollections = filteredCollections.slice(startIndex, startIndex + state.itemsPerPage);
    
    if (filteredCollections.length === 0) {
        elements.emptyState.classList.remove('d-none');
        elements.collectionsGrid.innerHTML = '';
        elements.pagination.innerHTML = '';
        
        if (state.searchTerm) {
            document.getElementById('emptyStateTitle').textContent = 'No collections found';
            document.getElementById('emptyStateMessage').textContent = 'Try adjusting your search term';
        } else {
            document.getElementById('emptyStateTitle').textContent = 'No collections';
            document.getElementById('emptyStateMessage').textContent = 'Get started by creating a new collection';
        }
    } else {
        elements.emptyState.classList.add('d-none');
        
        elements.collectionsGrid.innerHTML = currentCollections.map(collection => `
            <div class="col-md-6 col-lg-4">
                <div class="collection-card card h-100">
                    <div class="cover-image-container">
                        <img src="${collection.coverImage}" 
                             alt="${collection.title}" 
                             class="cover-image"
                             onclick="showDetailView(${JSON.stringify(collection).replace(/"/g, '&quot;')})">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" onclick="showDetailView(${JSON.stringify(collection).replace(/"/g, '&quot;')})">${collection.title}</h5>
                        <p class="card-text text-muted line-clamp-2 flex-grow-1">${collection.description}</p>
                        
                        <div class="mb-3">
                            <h6 class="fw-semibold small mb-2">Artworks in this collection:</h6>
                            <ul class="list-unstyled small text-muted mb-0">
                                ${collection.artworks.slice(0, 3).map((artwork, index) => `
                                    <li>• ${artwork.title}</li>
                                `).join('')}
                                ${collection.artworks.length > 3 ? `
                                    <li class="text-muted">+ ${collection.artworks.length - 3} more</li>
                                ` : ''}
                                ${collection.artworks.length === 0 ? `
                                    <li class="text-muted">No artworks yet</li>
                                ` : ''}
                            </ul>
                        </div>
                        
                        <div class="action-buttons-container mt-auto">
                            <button onclick="showLiveCollection(${JSON.stringify(collection).replace(/"/g, '&quot;')})" 
                                    class="btn btn-dark btn-sm view-collection-btn">
                                 View Live Collection
                            </button>
                            <div class="action-buttons">
                                <button onclick="editCollection(${JSON.stringify(collection).replace(/"/g, '&quot;')})" 
                                        class="btn btn-edit btn-sm">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        renderPagination(totalPages);
    }
}

// ======================== func to render pagination ==================
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';    
    paginationHTML += `
        <button onclick="changePage(${state.currentPage - 1})" 
                ${state.currentPage === 1 ? 'disabled' : ''}
                class="btn btn-outline-dark me-2">
            Previous
        </button>
    `;    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" 
                    class="btn ${state.currentPage === i ? 'btn-dark' : 'btn-outline-dark'} mx-1">
                ${i}
            </button>
        `;
    }    
    paginationHTML += `
        <button onclick="changePage(${state.currentPage + 1})" 
                ${state.currentPage === totalPages ? 'disabled' : ''}
                class="btn btn-outline-dark ms-2">
            Next
        </button>
    `;
    
    elements.pagination.innerHTML = paginationHTML;
}

// ======================== func to render artworks pagination ==================
function renderArtworksPagination(totalPages) {
    if (totalPages <= 1) {
        return '';
    }
    
    let paginationHTML = '';    
    paginationHTML += `
        <button onclick="changeArtworksPage(${state.collectionArtworksCurrentPage - 1})" 
                ${state.collectionArtworksCurrentPage === 1 ? 'disabled' : ''}
                class="btn btn-outline-dark btn-sm me-2">
            Previous
        </button>
    `;    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button onclick="changeArtworksPage(${i})" 
                    class="btn btn-sm ${state.collectionArtworksCurrentPage === i ? 'btn-dark' : 'btn-outline-dark'} mx-1">
                ${i}
            </button>
        `;
    }    
    paginationHTML += `
        <button onclick="changeArtworksPage(${state.collectionArtworksCurrentPage + 1})" 
                ${state.collectionArtworksCurrentPage === totalPages ? 'disabled' : ''}
                class="btn btn-outline-dark btn-sm ms-2">
            Next
        </button>
    `;
    
    return paginationHTML;
}

// ======================== func to render available artworks pagination ==================
function renderAvailableArtworksPagination(totalPages) {
    if (totalPages <= 1) {
        return '';
    }
    
    let paginationHTML = '';    
    paginationHTML += `
        <button onclick="changeAvailableArtworksPage(${state.availableArtworksCurrentPage - 1})" 
                ${state.availableArtworksCurrentPage === 1 ? 'disabled' : ''}
                class="btn btn-outline-dark btn-sm me-2">
            Previous
        </button>
    `;    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button onclick="changeAvailableArtworksPage(${i})" 
                    class="btn btn-sm ${state.availableArtworksCurrentPage === i ? 'btn-dark' : 'btn-outline-dark'} mx-1">
                ${i}
            </button>
        `;
    }    
    paginationHTML += `
        <button onclick="changeAvailableArtworksPage(${state.availableArtworksCurrentPage + 1})" 
                ${state.availableArtworksCurrentPage === totalPages ? 'disabled' : ''}
                class="btn btn-outline-dark btn-sm ms-2">
            Next
        </button>
    `;
    
    return paginationHTML;
}

// ===============func to change page in pagination ===================
function changePage(page) {
    state.currentPage = page;
    renderCollections();
}

// ===============func to change artworks page in collection ===================
function changeArtworksPage(page) {
    state.collectionArtworksCurrentPage = page;
    renderDetailView();
}

// ===============func to change available artworks page ===================
function changeAvailableArtworksPage(page) {
    state.availableArtworksCurrentPage = page;
    renderArtworkSelection();
}

// ============================ func to intialize event listner ==============
function initializeEventListeners() {
    elements.searchInput.addEventListener('input', (e) => {
        state.searchTerm = e.target.value;
        state.currentPage = 1;
        renderCollections();
    });    
    elements.sortSelect.addEventListener('change', (e) => {
        state.sortOption = e.target.value;
        state.currentPage = 1;
        renderCollections();
    });
    
    elements.createBtn.addEventListener('click', createCollection);
    elements.emptyCreateBtn.addEventListener('click', createCollection);    
    elements.submitFormBtn.addEventListener('click', submitCollectionForm);    
    elements.confirmDeleteBtn.addEventListener('click', confirmDelete);    
    elements.confirmArtworkDeleteBtn.addEventListener('click', removeArtwork);    
    elements.addArtworksBtn.addEventListener('click', addArtworksToCollection);    
    elements.coverUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.coverPreview.innerHTML = `<img src="${e.target.result}" alt="Cover preview" class="img-fluid rounded">`;
            };
            reader.readAsDataURL(file);
        }
        validateField('coverUpload');
    });
    
    elements.descriptionInput.addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = e.target.value.length;
        validateField('descriptionInput');
    });
    
    elements.titleInput.addEventListener('input', (e) => {
        validateField('titleInput');
    });
    
    elements.coverPreview.parentElement.addEventListener('click', () => {
        elements.coverUpload.click();
    });
    
    //============= Fullscreen overlay events =============
    elements.fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === elements.fullscreenOverlay) {
            closeFullscreenImage();
        }
    });
    document.querySelector('.fullscreen-close').addEventListener('click', closeFullscreenImage);

    //============= Close fullscreen on ESC key =============
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.fullscreenOverlay.classList.contains('d-none')) {
            closeFullscreenImage();
        }
    });
}

// =========================func to initalize collection component ===============
function initializeApp() {
    initializeEventListeners();
    renderCollections();
    
    // Hide create button initially if no collections
    if (state.collections.length === 0) {
        elements.createBtn.classList.add('d-none');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);