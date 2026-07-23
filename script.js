/**
 * Biofouling Identification Guide - JavaScript
 * Global JSON Dynamic Version
 */

// =============================================
// HTML Generation & Dynamic Loading
// =============================================

function createCardHTML(species) {
    // Constrói os items da lista (bullet points) a partir do array no JSON
    const featuresList = species.features.map(feature => `<li>${feature}</li>`).join('');
    
    return `
        <div class="species-card ${species.category}" data-name="${species.dataName}" data-region="${species.region}" data-images="${species.images}">
            <div class="species-image"><img src="${species.mainImage}" alt="${species.name}"></div>
            <div class="species-content">
                <div class="species-header">
                    <div>
                        <div class="species-name">${species.name}</div>
                        <div class="species-scientific">${species.scientific}</div>
                    </div>
                    <span class="priority ${species.priorityClass}">${species.priority}</span>
                </div>
                <span class="species-group">${species.group}</span>
                <p class="species-description">${species.description}</p>
                <div class="species-features">
                    <h4>How to Spot It</h4>
                    <ul>
                        ${featuresList}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// =============================================
// Species Search Filter
// =============================================

function filterSpecies(type) {
    const searchInput = document.getElementById(type + '-search').value.toLowerCase();
    const grid = document.getElementById(type + '-grid');
    if (!grid) return;
    
    const cards = grid.querySelectorAll('.species-card, .species-item');
    
    cards.forEach(card => {
        const nameEl = card.querySelector('.species-name');
        const scientificEl = card.querySelector('.species-scientific');
        const groupEl = card.querySelector('.species-group');
        
        const searchDataText = card.getAttribute('data-name') ? card.getAttribute('data-name').toLowerCase() : '';
        const nameText = nameEl ? nameEl.textContent.toLowerCase() : '';
        const scientificText = scientificEl ? scientificEl.textContent.toLowerCase() : '';
        const groupText = groupEl ? groupEl.textContent.toLowerCase() : '';
        
        if (searchDataText.includes(searchInput) || nameText.includes(searchInput) || scientificText.includes(searchInput) || groupText.includes(searchInput)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// =============================================
// Gallery Modal Global Variables
// =============================================

const galleryOverlay = document.getElementById('gallery-overlay');
const galleryHeader = document.getElementById('gallery-header');
const galleryTitle = document.getElementById('gallery-title');
const galleryScientific = document.getElementById('gallery-scientific');
const galleryImage = document.getElementById('gallery-image');
const galleryDescription = document.getElementById('gallery-description');
const galleryFeatures = document.getElementById('gallery-features');
const galleryLookalike = document.getElementById('gallery-lookalike');
const galleryThumbnails = document.getElementById('gallery-thumbnails');
const galleryClose = document.getElementById('gallery-close');

function setGalleryImage(src, alt, index) {
    if(galleryImage) {
        galleryImage.src = src;
        galleryImage.alt = alt;
    }
    
    document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
        thumb.classList.remove('active');
        if (i === index) {
            thumb.classList.add('active');
        }
    });
}

function closeGallery() {
    if(galleryOverlay) {
        galleryOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// =============================================
// Bind Events to Dynamically Created Cards
// =============================================

function bindCardEvents() {
    // 1. Image Error Handling (Placeholders)
    document.querySelectorAll('.species-image img').forEach(img => {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.style.display = 'flex';
        placeholder.style.flexDirection = 'column';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.backgroundColor = '#f0f0f0';
        placeholder.style.color = '#888';
        
        const speciesName = img.alt || 'Species';
        placeholder.innerHTML = '<div style="font-size:24px; margin-bottom:5px;">🔍</div><div style="font-size:12px; font-weight:bold; text-align:center;">' + speciesName + '</div><div style="font-size:10px; margin-top:5px;">Image not available</div>';
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
            this.parentNode.appendChild(placeholder);
        });
        
        if (img.complete && img.naturalHeight === 0) {
            img.style.display = 'none';
            img.parentNode.appendChild(placeholder);
        }
    });

    // 2. Species Gallery Modal Open Event
    document.querySelectorAll('.species-card, .species-item').forEach(card => {
        if(card.style.cursor === 'default') return;

        card.addEventListener('click', function() {
            const nameEl = this.querySelector('.species-name');
            const scientificEl = this.querySelector('.species-scientific');
            const descEl = this.querySelector('.species-description');
            
            const name = nameEl ? nameEl.textContent : '';
            const scientific = scientificEl ? scientificEl.textContent : '';
            const description = descEl ? descEl.textContent : '';
            
            const img = this.querySelector('.species-image img');
            const imgSrc = img ? img.src : '';
            const imgAlt = img ? img.alt : name;
            
            const imagesData = this.getAttribute('data-images');
            const images = imagesData ? imagesData.split(',').map(s => s.trim()) : [];
            
            const featuresList = this.querySelector('.species-features ul');
            const featuresHTML = featuresList ? '<h4>How to Spot It</h4>' + featuresList.outerHTML : '';
            
            const lookalikeBox = this.querySelector('.lookalike-box');
            const lookalikeHTML = lookalikeBox ? lookalikeBox.innerHTML : '';
            
            if(galleryHeader) {
                galleryHeader.className = 'gallery-header';
                if (this.classList.contains('noxious') || this.classList.contains('invasive')) {
                    galleryHeader.style.backgroundColor = '#CC0000'; // Red
                } else if (this.classList.contains('native')) {
                    galleryHeader.style.backgroundColor = '#006400'; // Dark green
                } else {
                    galleryHeader.style.backgroundColor = '#FF8C00'; // Orange
                }
            }
            
            if(galleryTitle) galleryTitle.textContent = name;
            if(galleryScientific) galleryScientific.textContent = scientific;
            if(galleryImage) {
                galleryImage.src = imgSrc;
                galleryImage.alt = imgAlt;
            }
            if(galleryDescription) galleryDescription.textContent = description;
            if(galleryFeatures) galleryFeatures.innerHTML = featuresHTML;
            
            if (images.length > 1 && galleryThumbnails) {
                galleryThumbnails.innerHTML = '';
                images.forEach((imageSrc, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = imageSrc;
                    thumb.alt = imgAlt + ' - Photo ' + (index + 1);
                    thumb.className = 'gallery-thumb' + (index === 0 ? ' active' : '');
                    thumb.dataset.index = index;
                    
                    // Prevenir que o clique na miniatura ative o modal novamente
                    thumb.addEventListener('click', function(e) {
                        e.stopPropagation(); 
                        setGalleryImage(this.src, this.alt, parseInt(this.dataset.index));
                    });
                    
                    galleryThumbnails.appendChild(thumb);
                });
                galleryThumbnails.style.display = 'flex';
                if(galleryImage) galleryImage.src = images[0];
            } else if (galleryThumbnails) {
                galleryThumbnails.style.display = 'none';
                galleryThumbnails.innerHTML = '';
            }
            
            if (lookalikeHTML && galleryLookalike) {
                galleryLookalike.innerHTML = lookalikeHTML;
                galleryLookalike.style.display = 'block';
            } else if (galleryLookalike) {
                galleryLookalike.style.display = 'none';
            }
            
            if(galleryOverlay) {
                galleryOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// =============================================
// Main Initialization (DOM Content Loaded)
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Load Data from JSON
    try {
        const response = await fetch('data.json');
        const speciesData = await response.json();

        const invasiveGrid = document.getElementById('invasive-grid');
        const nicheGrid = document.getElementById('niche-grid');

        // Draw cards in HTML
        speciesData.forEach(species => {
            const cardHTML = createCardHTML(species);
            if (species.category === 'invasive' && invasiveGrid) {
                invasiveGrid.innerHTML += cardHTML;
            } else if (species.category === 'niche-species' && nicheGrid) {
                nicheGrid.innerHTML += cardHTML;
            }
        });

        // Bind clicks and errors to the new cards
        bindCardEvents();

    } catch (error) {
        console.error('Error loading species data:', error);
    }

    // 2. Setup Geographic Filter Dropdowns (Multiple)
    const regionMenus = document.querySelectorAll('.region-filter');
    
    if (regionMenus.length > 0) {
        regionMenus.forEach(menu => {
            menu.addEventListener('change', (e) => {
                const filterValue = e.target.value;
                
                // Reset todos os outros menus para não haver conflitos na interface
                regionMenus.forEach(otherMenu => {
                    if (otherMenu !== e.target) {
                        otherMenu.selectedIndex = 0; 
                    }
                });

                const speciesCards = document.querySelectorAll('.species-card');

                speciesCards.forEach(card => {
                    const regions = card.getAttribute('data-region') || "";
                    
                    // Fazer reset à barra de pesquisa ao mudar de região
                    document.querySelectorAll('.search-box').forEach(box => box.value = '');
                    
                    // 'global' mostra todos, caso contrário verifica a tag da região
                    if (filterValue === 'global' || regions.includes(filterValue)) {
                        card.style.display = 'flex'; 
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 3. Setup Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Setup Modal Closing Events
    if(galleryClose) {
        galleryClose.addEventListener('click', closeGallery);
    }

    if(galleryOverlay) {
        galleryOverlay.addEventListener('click', function(e) {
            if (e.target === galleryOverlay) {
                closeGallery();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryOverlay && galleryOverlay.classList.contains('active')) {
            closeGallery();
        }
    });
});
