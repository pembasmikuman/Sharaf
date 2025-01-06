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

// ================= FILTER TOGGLE ================
const filterMobileButton = document.querySelector('.filter_mobile');
const filterPanel = document.querySelector('.filter-panel');
const closeFilterButton = document.querySelector('.close-filter');
const filterButtons = document.querySelectorAll('.filter-btn');
const applyBtn = document.getElementById('applyBtn');

filterMobileButton.addEventListener('click', () => {
    filterPanel.classList.add('open');
});

closeFilterButton.addEventListener('click', () => {
    filterPanel.classList.remove('open');
});

// Store original active states
let activeFilters = {
    department: null,
    price: null,
    occasion: null
};

// Add click handlers for filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filterGroup = this.closest('.filter-buttons');
        const groupButtons = filterGroup.querySelectorAll('.filter-btn');
        
        // If clicking an already active button, deactivate it
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            return;
        }
        
        // Remove active class from other buttons in same group
        groupButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Close panel without applying filters
closeFilterButton.addEventListener('click', () => {
    // Reset all buttons to their previous state
    resetFilters();
    filterPanel.classList.remove('open');
});

// Apply filters and close panel
applyBtn.addEventListener('click', () => {
    // Save current active states
    saveActiveStates();
    filterPanel.classList.remove('open');
});

function saveActiveStates() {
    // Save department filters
    const departmentActive = document.querySelector('.department_filter .filter-btn.active');
    activeFilters.department = departmentActive ? departmentActive.dataset.filter : null;
    
    // Save price filters
    const priceActive = document.querySelector('.price-filter .filter-btn.active');
    activeFilters.price = priceActive ? priceActive.dataset.filter : null;
    
    // Save occasion filters
    const occasionActive = document.querySelector('.occasion-filter .filter-btn.active');
    activeFilters.occasion = occasionActive ? occasionActive.dataset.filter : null;
}

function resetFilters() {
    // Reset department filters
    const departmentButtons = document.querySelectorAll('.department_filter .filter-btn');
    departmentButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activeFilters.department);
    });
    
    // Reset price filters
    const priceButtons = document.querySelectorAll('.price-filter .filter-btn');
    priceButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activeFilters.price);
    });
    
    // Reset occasion filters
    const occasionButtons = document.querySelectorAll('.occasion-filter .filter-btn');
    occasionButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activeFilters.occasion);
    });
}



// ============= PAGINATION =================
function updatePagination() {
  const pageNumbers = document.getElementById('pageNumbers');
  const totalPages = 10;
  
  // Clear existing page numbers
  pageNumbers.innerHTML = '';
  
  if (window.innerWidth >= 768) {
      // Desktop view: 1 2 3 ... 8 9 10
      const desktopPages = [1, 2, 3, '...', 8, 9, 10];
      
      desktopPages.forEach(page => {
          const span = document.createElement('span');
          if (page === '...') {
              span.className = 'dots';
          } else {
              span.className = `page-num ${page === 1 ? 'active' : ''}`;
          }
          span.textContent = page;
          pageNumbers.appendChild(span);
      });
  } else {
      // Mobile view: 1 2 ... 9 10
      const mobilePages = [1, 2, '...', 9, 10];
      
      mobilePages.forEach(page => {
          const span = document.createElement('span');
          if (page === '...') {
              span.className = 'dots';
          } else {
              span.className = `page-num ${page === 1 ? 'active' : ''}`;
          }
          span.textContent = page;
          pageNumbers.appendChild(span);
      });
  }
}

// Add event listener for screen resize
window.addEventListener('resize', updatePagination);

// Initial call
updatePagination();

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  reset: false // Animation repeat
})

sr.reveal(`.product`, {transition: 500, origin:'right', duration: 500})
sr.reveal(`.footer_container`, {transition: 500, origin:'bottom', delay: 100})
