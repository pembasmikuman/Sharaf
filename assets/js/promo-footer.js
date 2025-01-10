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

document.addEventListener('DOMContentLoaded', () => {
    const viewButtons = document.querySelectorAll('.nav-link');

    viewButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
});

function handleFilterClick(event) {
    const filter = event.currentTarget.dataset.filter;
    const filterType = event.currentTarget.classList.contains('occasion_card') ? 'occasion' : 'department';
    window.location.href = `catalog.html?filterType=${filterType}&filter=${filter}`;
}

const newsletterForm = document.querySelector('.newsletter_card');
newsletterForm.addEventListener('submit', handleNewsletterSubmission);

function handleNewsletterSubmission(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    if (validateEmail(email)) {
        submitNewsletter(email);
    } else {
        displayError('Please enter a valid email address');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitNewsletter(email) {
    // Here you would typically send the email to your server
    // For this example, we'll just log it to the console
    console.log(`Subscribing email: ${email}`);
    
    // Clear the input field
    document.getElementById('email-input').value = '';
}

function displayPopup(message, isError = false) {
    const popup = document.createElement('div');
    popup.className = `popup ${isError ? 'error' : 'success'}`;
    popup.textContent = message;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }, 2000);
    }, 10);
}

function handleNewsletterSubmission(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    if (validateEmail(email)) {
        submitNewsletter(email);
        displayPopup('Thank you for subscribing!');
    } else {
        displayPopup('Please enter a valid email address', true);
    }
}