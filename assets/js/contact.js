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


// Select form, popup, and close button
const contactForm = document.getElementById('contactForm');
const thankYouPopup = document.getElementById('thankYouPopup');
const closePopupButton = document.getElementById('closePopup');

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent actual form submission

    // Show the popup
    thankYouPopup.classList.remove('hidden');
});

// Close the popup
closePopupButton.addEventListener('click', () => {
    thankYouPopup.classList.add('hidden');
});
