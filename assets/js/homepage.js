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
  