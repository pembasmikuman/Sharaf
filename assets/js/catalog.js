/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  reset: false // Animation repeat
})

sr.reveal(`.display_header h1`, {transition: 500, origin: 'left', duration: 500})
sr.reveal(`.filter_wrapper`, {transition: 500, origin:'left', duration: 500, delay: 100})
sr.reveal(`.product_grid`, {transition: 500, origin:'left', duration: 1500, delay: 200})
sr.reveal(`.product`, {transition: 500, origin:'left', duration: 1500})
sr.reveal(`.footer_container`, {transition: 500, origin:'bottom', delay: 100})

// ================= FILTER TOGGLE ================
const filterMobileButton = document.querySelector('.filter_mobile');
const filterPanel = document.querySelector('.filter-panel');
const closeFilterButton = document.querySelector('.close-filter');
const filterButtons = document.querySelectorAll('.filter-btn');
const applyBtnM = document.getElementById('applyBtnM');
const searchBox = document.querySelector('.search_box');
searchBox.addEventListener('input', handleSearch);

filterMobileButton.addEventListener('click', () => {
    filterPanel.classList.add('open');
});

closeFilterButton.addEventListener('click', () => {
    filterPanel.classList.remove('open');
});

// ================= FETCH DATA FOR PRODUCTS ========================
let Products = [];
let activeFilters = {
    department: [],
    price: [],
    occasion: []
};

// Fetch product data
async function fetchProducts() {
    try {
        const response = await fetch('assets/fragrances.json');
        const data = await response.json();
        Products = data.fragrances;

        const urlParams = new URLSearchParams(window.location.search);
        const filterType = urlParams.get('filterType');
        const filter = urlParams.get('filter');
        
        if (filter && filterType) {
            applyInitialFilter(filterType, filter);
        } else {
            renderProducts(Products);
        }

        console.log(Products);
        setupSearchFunctionality();
        setupFilterListeners();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function applyInitialFilter(filterType, filter) {
    const filterButton = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
    if (filterButton) {
        filterButton.classList.add('active');
        activeFilters[filterType] = [filter];
        applyFilters();
    } else {
        const filteredProducts = Products.filter(product => 
            product[filterType].toLowerCase() === filter.toLowerCase()
        );
        renderProducts(filteredProducts);
    }
}

function renderProducts(products) {
    const productContainer = document.querySelector('.product_grid');
    const displayHeader = document.querySelector('.display_header h1');
    productContainer.innerHTML = '';
    
    // Get all active filters
    let activeFilterTexts = [];
    Object.entries(activeFilters).forEach(([type, filters]) => {
        filters.forEach(filter => {
            switch(filter.toLowerCase()) {
                case 'new':
                    activeFilterTexts.push('New Arrivals');
                    break;
                case 'top':
                    activeFilterTexts.push('Top Selling');
                    break;
                case 'date':
                    activeFilterTexts.push('Date Occasion');
                    break;
                case 'formal':
                    activeFilterTexts.push('Formal Occasion');
                    break;
                case 'casual':
                    activeFilterTexts.push('Casual Occasion');
                    break;
                case 'active':
                    activeFilterTexts.push('Active Occasion');
                    break;
                case 'under100':
                    activeFilterTexts.push('Under RM 100');
                    break;
                case '100to500':
                    activeFilterTexts.push('RM 100 - RM 500');
                    break;
                case '500to1000':
                    activeFilterTexts.push('RM 500 - RM 1000');
                    break;
                case 'morethan1000':
                    activeFilterTexts.push('More than RM 1000');
                    break;
            }
        });
    });
    
    // Set header text
    let headerText = activeFilterTexts.length > 0 
        ? activeFilterTexts.join(' & ') 
        : 'All Products';
    
    if (displayHeader) {
        displayHeader.textContent = headerText;
    }
    
    // Render products
    products.forEach(product => {
        const productElement = createProductElement(product);
        sr.reveal(`.product`, {transition: 500, origin:'left', duration: 500, delay: 100})
        productContainer.appendChild(productElement);
    });
}


// Create a single product element
function createProductElement(product) {
    const article = document.createElement('article');
    article.className = 'product';

    const currentPrice = product.prices['100ml'];
    const originalPrice = product.prices.original;
    const hasDiscount = currentPrice < originalPrice;

    const priceHTML = hasDiscount ? 
        `<h3>RM ${currentPrice}
            <h3 style="text-decoration: line-through; color: #999999;">
                RM ${originalPrice}
            </h3>
            <div class="discount_badge">
                -${calculateDiscount(currentPrice, originalPrice)}%
            </div>
        </h3>` :
        `<h3>RM ${currentPrice}</h3>`;

    article.innerHTML = `
    <a href="product.html?id=${product.id}" class="product-name-link">
            <div class="product_image">
            <img loading="lazy" class="product_img" src="${product.image}" alt="${product.name}">
        </div>
        <div class="product_details">
            <h3 class="product_name">${product.name}</h3>

            <div class="rating-wrapper">
                ${generateStarRating(product.rating)}
                ${product.rating}/
                <span style="font-weight: 100;">5</span>
            </div>

            <div class="price_wrapper">
                ${priceHTML}
            </div>
        </div>
        </a>
    `;

    return article;
}

function setupSearchFunctionality() {
    const searchBox = document.querySelector('.search_box');
    const mobileSearchBox = document.querySelector('.mobile_search_box');
    const searchIcon = document.getElementById('search-icon');

    searchBox?.addEventListener('input', handleSearch);
    mobileSearchBox?.addEventListener('input', handleMobileSearch);
    searchIcon?.addEventListener('click', handleMobileSearchIconClick);
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    filterAndRenderProducts(searchTerm);
}

function handleMobileSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    filterAndRenderProducts(searchTerm);
}

function handleMobileSearchIconClick() {
    const searchTerm = document.querySelector('.mobile_search_box').value.toLowerCase().trim();
    if (searchTerm !== '') {
        filterAndRenderProducts(searchTerm);
        toggleSearch();
    } else {
        toggleSearch();
    }
}

function filterAndRenderProducts(searchTerm) {
    const filteredProducts = Products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Setup filter listeners
function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.closest('.filter-buttons').previousElementSibling.textContent.toLowerCase();
            const filterValue = button.dataset.filter;
            
            if (!activeFilters[filterType]) {
                activeFilters[filterType] = [];
            }
            
            if (button.classList.contains('active')) {
                button.classList.remove('active');
                activeFilters[filterType] = activeFilters[filterType].filter(val => val !== filterValue);
            } else {
                button.classList.add('active');
                activeFilters[filterType].push(filterValue);
            }
            
            console.log('Updated Active Filters:', activeFilters);
        });
    });

    const applyButton = document.getElementById('applyBtn');
    applyButton.addEventListener('click', applyFilters);
    applyBtnM.addEventListener('click', applyFilters)
}



// Apply filters
function applyFilters() {
    console.log('applying filters!')
    const filteredProducts = Products.filter(product => {
        const departmentMatch = activeFilters.department.length === 0 || activeFilters.department.includes(product.department);
        const occasionMatch = activeFilters.occasion.length === 0 || activeFilters.occasion.includes(product.occasion);
        const priceMatch = activeFilters.price.length === 0 || activeFilters.price.some(range => checkPriceRange(product.prices['100ml'], range));
        
        console.log(departmentMatch);
        console.log(occasionMatch);
        console.log(priceMatch)
        return departmentMatch && occasionMatch && priceMatch;
    });

    filterPanel.classList.remove('open');
    console.log(filteredProducts)
    renderProducts(filteredProducts);
}

// Check price range
function checkPriceRange(price, range) {
    switch (range) {
        case 'under100':
            return price < 100;
        case '100to500':
            return price >= 100 && price <= 500;
        case '500t01000':
            return price > 500 && price <= 1000;
        case 'moreThan1000':
            return price > 1000;
        default:
            return false;
    }
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="ri-star-fill star_icon"></i>';
        } else if (i === fullStars && halfStar) {
            starsHTML += '<i class="ri-star-half-fill star_icon"></i>';
        } else {
            starsHTML += '<i class="ri-star-line star_icon"></i>';
        }
    }
    
    return starsHTML;
}

// Calculate discount percentage
function calculateDiscount(currentPrice, originalPrice) {
    return Math.round((1 - currentPrice / originalPrice) * 100);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});


document.querySelectorAll('.product-name-link').forEach(productLink => {
    productLink.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.dataset.id;
        window.location.href = `product.html?id=${productId}`;
    });
});
