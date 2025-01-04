// ========== CLOSE PROMO BAR =========
const promoBar = document.getElementById('promo-bar');
const promoCloseBtn = document.getElementById('close-promo-btn');
const resetPromoBtn = document.getElementById('reset-promo-btn');

promoBar.classList.remove('hidden');
localStorage.removeItem('promo-bar-closed');

document.addEventListener('DOMContentLoaded', () => {

    // Check if promo bar state is saved in localStorage
    const isPromoClosed = localStorage.getItem('promo-bar-closed') === 'true';
    
    if (isPromoClosed) {
        promoBar.classList.add('hidden');
    }

    // Close Promo Bar
    promoCloseBtn.addEventListener('click', () => {
        promoBar.classList.add('hidden');
        localStorage.setItem('promo-bar-closed', 'true');
    });
});

// ============= MENU OVERLAY TOGGLE =============
function toggleSidePanel() {
    const sidePanel = document.getElementById('side-panel');
    const overlay = document.getElementById('overlay');
    
    sidePanel.classList.toggle('active');
    overlay.classList.toggle('active');
}

// ============ SEARCH OVERLAY TOGGLE =============
function toggleSearch() {
    const searchOverlay = document.getElementById('search-overlay');
    searchOverlay.classList.toggle('active');
    
    // Focus the search input when overlay opens
    if (searchOverlay.classList.contains('active')) {
        searchOverlay.querySelector('.mobile_search_container').focus();
    }
}

// ================ SWIPER CLASS ===============
let swiperHome = new Swiper('.home__swiper', {
    // Optional parameters
    loop: false,
    grabCursor: true,
    slidesPerView: '1',

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },

    breakpoints: {
        768: {
            slidesPerView: '3',
            spacebetween: 20
        },
        1024: {
            slidesPerView: '4',
            spacebetween: 30
        }
    }
});

let swiperReview = new Swiper('.review_swiper', {

    loop : true,
    grabCursor: true,
    slidesPerView: '1',

    navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
    },

    breakpoints: {
        768: {
            slidesPerView: '2',
            spacebetween: 20
        },
        1024: {
            slidesPerView: '3',
            spacebetween: 30
        }
    }

});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    reset: false // Animation repeat
})

sr.reveal(`.hero_title, .shop_now_btn`, {transition: 1000, origin:'left'})
sr.reveal(`.hero_img`, {transition: 1000, origin:'bottom', delay: 100})
sr.reveal(`.hero_stars`, {scale: 1.5, origin:'bottom', delay: 300})
sr.reveal(`.main_title`, {transition: 1000, origin:'left'})
sr.reveal(`.product_prev, .product_next`, {origin:'bottom', duration: 1500})
sr.reveal(`.occasion_card`, {transition: 500, origin:'bottom'})
sr.reveal(`.review_swiper`, {transition: 500, origin:'left', duration: 1000})
sr.reveal(`.footer_container`, {transition: 500, origin:'bottom', delay: 100})


// ================= FETCH DATA FOR PRODUCTS ========================
// Fetch product data
async function fetchProductsNew() {
    try {
        const response = await fetch('assets/products.json');
        const data = await response.json();
        const newProducts = data.fragrances.filter(product => product.category === "new");
        renderProductsNew(newProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchProductsTop() {
    try {
        const response = await fetch('assets/products.json');
        const data = await response.json();
        const topProducts = data.fragrances.filter(product => product.category === "top");
        renderProductsTop(topProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


// Render products
function renderProductsNew(products) {
    const productContainer = document.querySelector('.new_arrivals_wrapper');
    products.slice(0, 6).forEach(product => {
        const productElement = createProductElement(product);
        productContainer.appendChild(productElement);
    });
}

function renderProductsTop(products) {
    const productContainer = document.querySelector('.top_selling_wrapper');
    products.slice(0, 6).forEach(product => {
        const productElement = createProductElement(product);
        productContainer.appendChild(productElement);
    });
}


// Create a single product element
function createProductElement(product) {
    const article = document.createElement('article');
    article.className = 'product swiper-slide';

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
        <div class="product_image">
            <img class="product_img" src="${product.image}" alt="${product.name}">
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
    `;

    return article;
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

// Call fetchProducts when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchProductsNew);
document.addEventListener('DOMContentLoaded', fetchProductsTop);
