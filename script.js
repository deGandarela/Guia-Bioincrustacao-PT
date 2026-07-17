/**
 * Guia de Identificação de Bioincrustação - JavaScript
 * Adaptado para Portugal
 */

// =============================================
// Seletor de Região
// =============================================

const regionData = {
    cont: {
        name: 'Portugal Continental',
        shortName: 'PT Cont.',
        icon: '🌊'
    },
    mad: {
        name: 'Madeira',
        shortName: 'Madeira',
        icon: '🏝️'
    },
    aco: {
        name: 'Açores',
        shortName: 'Açores',
        icon: '🌋'
    }
};

function setRegion(region) {
    // Atualiza o atributo de dados no body para aplicar CSS específico de região (se necessário)
    document.body.setAttribute('data-region', region);
    
    // Atualiza o crachá/badge da região no banner principal
    const badgeText = document.getElementById('region-badge-text');
    if (badgeText) {
        badgeText.textContent = regionData[region].name;
        // Reinicia a animação para dar feedback visual
        badgeText.parentElement.style.animation = 'none';
        badgeText.parentElement.offsetHeight; // Força o reflow do DOM
        badgeText.parentElement.style.animation = 'fadeInUp 0.3s ease';
    }
    
    // Atualiza o texto e ícone do menu dropdown no cabeçalho
    const dropdownText = document.getElementById('region-dropdown-text');
    const dropdownIcon = document.getElementById('region-dropdown-icon');
    if (dropdownText) dropdownText.textContent = regionData[region].shortName;
    if (dropdownIcon) dropdownIcon.textContent = regionData[region].icon;
    
    // Atualiza o estado "ativo" das opções no menu dropdown
    document.querySelectorAll('.region-dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-region') === region) {
            item.classList.add('active');
        }
    });
    
    // Atualiza textos dinâmicos na página
    const regionTextSpans = document.querySelectorAll('.region-text');
    regionTextSpans.forEach(span => {
        span.textContent = regionData[region].name;
    });

    // Guarda a preferência no armazenamento local do navegador
    localStorage.setItem('biofouling-region-pt', region);

    // Fecha o dropdown se estiver aberto
    closeRegionDropdown();
}

// Seleciona a região a partir da janela modal (primeira visita)
function selectRegionFromModal(region) {
    setRegion(region);
    localStorage.setItem('biofouling-region-selected-pt', 'true');
    closeRegionModal();
}

// Funções da janela modal de região
function showRegionModal() {
    const modal = document.getElementById('region-modal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Impede o scroll na página de fundo
}

function closeRegionModal() {
    const modal = document.getElementById('region-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Funções do menu dropdown de região
function toggleRegionDropdown() {
    const dropdown = document.getElementById('region-dropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

function closeRegionDropdown() {
    const dropdown = document.getElementById('region-dropdown');
    if (dropdown) dropdown.classList.remove('open');
}

// Fechar o dropdown ao clicar fora dele
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('region-dropdown');
    if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.region-dropdown-trigger')) {
        closeRegionDropdown();
    }
});

// Inicialização da Região ao carregar a página
function initRegion() {
    const hasSelected = localStorage.getItem('biofouling-region-selected-pt');
    const savedRegion = localStorage.getItem('biofouling-region-pt') || 'cont'; // Por defeito: Continente
    
    // Aplica a região guardada
    setRegion(savedRegion);
    
    // Mostra a janela modal se for a primeira visita do utilizador
    if (!hasSelected) {
        setTimeout(showRegionModal, 300);
    }
}

// Executar quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', initRegion);

// =============================================
// Filtro de Pesquisa de Espécies
// =============================================

function filterSpecies(type) {
    const searchInput = document.getElementById(type + '-search').value.toLowerCase();
    const grid = document.getElementById(type + '-grid');
    const cards = grid.querySelectorAll('.species-card, .species-item');
    
    cards.forEach(card => {
        // Se a classe base do teu HTML for 'species-item', pesquisa aí, caso contrário tenta 'species-card'
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
// Scroll Suave para a Navegação
// =============================================

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

// =============================================
// Tratamento de Erros de Imagens (Placeholders)
// =============================================

document.querySelectorAll('.species-image img').forEach(img => {
    // Cria um espaço reservado (placeholder) caso a imagem não exista
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
    
    const speciesName = img.alt || 'Espécie';
    placeholder.innerHTML = '<div style="font-size:24px; margin-bottom:5px;">🔍</div><div style="font-size:12px; font-weight:bold; text-align:center;">' + speciesName + '</div><div style="font-size:10px; margin-top:5px;">Imagem indisponível</div>';
    
    // Insere o placeholder antes da imagem (escondido inicialmente por CSS se precisares, ou trata via JS)
    
    img.addEventListener('error', function() {
        this.style.display = 'none';
        this.parentNode.appendChild(placeholder);
    });
    
    if (img.complete && img.naturalHeight === 0) {
        img.style.display = 'none';
        img.parentNode.appendChild(placeholder);
    }
});

// =============================================
// Modal da Galeria de Espécies
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

// Função para definir a imagem principal e atualizar a miniatura ativa
function setGalleryImage(src, alt, index) {
    if(galleryImage) {
        galleryImage.src = src;
        galleryImage.alt = alt;
    }
    
    // Atualiza a miniatura ativa através do índice
    document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
        thumb.classList.remove('active');
        if (i === index) {
            thumb.classList.add('active');
        }
    });
}

// Abrir janela modal ao clicar no cartão da espécie
document.querySelectorAll('.species-card, .species-item').forEach(card => {
    // Excluir blocos puramente informativos de abrirem modal
    if(card.style.cursor === 'default') return;

    card.addEventListener('click', function() {
        // Extrair informações do cartão
        const nameEl = this.querySelector('.species-name');
        const scientificEl = this.querySelector('.species-scientific');
        const descEl = this.querySelector('.species-description');
        
        const name = nameEl ? nameEl.textContent : '';
        const scientific = scientificEl ? scientificEl.textContent : '';
        const description = descEl ? descEl.textContent : '';
        
        const img = this.querySelector('.species-image img');
        const imgSrc = img ? img.src : '';
        const imgAlt = img ? img.alt : name;
        
        // Obter múltiplas imagens, se disponíveis (atributo data-images)
        const imagesData = this.getAttribute('data-images');
        const images = imagesData ? imagesData.split(',').map(s => s.trim()) : [];
        
        // Obter lista de características
        const featuresList = this.querySelector('.species-features ul');
        const featuresHTML = featuresList ? '<h4>Como Identificar</h4>' + featuresList.outerHTML : '';
        
        // Obter campo "Não confundir com", se existir
        const lookalikeBox = this.querySelector('.lookalike-box');
        const lookalikeHTML = lookalikeBox ? lookalikeBox.innerHTML : '';
        
        // Ajustar a cor do cabeçalho da janela modal consoante a prioridade
        if(galleryHeader) {
            galleryHeader.className = 'gallery-header';
            if (this.classList.contains('noxious') || this.classList.contains('invasive')) {
                galleryHeader.style.backgroundColor = '#CC0000'; // Vermelho perigo
            } else if (this.classList.contains('native')) {
                galleryHeader.style.backgroundColor = '#006400'; // Verde nativo
            } else {
                galleryHeader.style.backgroundColor = '#FF8C00'; // Laranja aviso/nicho
            }
        }
        
        // Povoar a janela modal
        if(galleryTitle) galleryTitle.textContent = name;
        if(galleryScientific) galleryScientific.textContent = scientific;
        if(galleryImage) {
            galleryImage.src = imgSrc;
            galleryImage.alt = imgAlt;
        }
        if(galleryDescription) galleryDescription.textContent = description;
        if(galleryFeatures) galleryFeatures.innerHTML = featuresHTML;
        
        // Tratar as múltiplas imagens (miniaturas)
        if (images.length > 1 && galleryThumbnails) {
            galleryThumbnails.innerHTML = '';
            images.forEach((imageSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imageSrc;
                thumb.alt = imgAlt + ' - Foto ' + (index + 1);
                thumb.className = 'gallery-thumb' + (index === 0 ? ' active' : '');
                thumb.dataset.index = index;
                thumb.addEventListener('click', function() {
                    setGalleryImage(this.src, this.alt, parseInt(this.dataset.index));
                });
                galleryThumbnails.appendChild(thumb);
            });
            galleryThumbnails.style.display = 'flex';
            // Define a imagem principal como a primeira do array
            if(galleryImage) galleryImage.src = images[0];
        } else if (galleryThumbnails) {
            galleryThumbnails.style.display = 'none';
            galleryThumbnails.innerHTML = '';
        }
        
        // Tratar secção "Não confundir com"
        if (lookalikeHTML && galleryLookalike) {
            galleryLookalike.innerHTML = lookalikeHTML;
            galleryLookalike.style.display = 'block';
        } else if (galleryLookalike) {
            galleryLookalike.style.display = 'none';
        }
        
        // Mostrar modal
        if(galleryOverlay) {
            galleryOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Função para fechar modal
function closeGallery() {
    if(galleryOverlay) {
        galleryOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Fechar ao clicar no botão X
if(galleryClose) {
    galleryClose.addEventListener('click', closeGallery);
}

// Fechar ao clicar fora da caixa principal
if(galleryOverlay) {
    galleryOverlay.addEventListener('click', function(e) {
        if (e.target === galleryOverlay) {
            closeGallery();
        }
    });
}

// Fechar ao pressionar a tecla 'Esc'
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && galleryOverlay && galleryOverlay.classList.contains('active')) {
        closeGallery();
    }
});
