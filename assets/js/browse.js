// ================ FETCH PRODUCT ================
const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let allProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch('assets/products.json');
    const data = await response.json();
    allProducts = data.fragrances;
    renderProductsPage(currentPage);
    setupPagination();
    updateProductCount();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function setItemsPerPage(count) {
    ITEMS_PER_PAGE = count;
    currentPage = 1; // Reset to first page when changing items per page
    renderProductsPage(currentPage);
    setupPagination();
}

function renderProductsPage(page) {
  const productContainer = document.querySelector('.product_grid');
  productContainer.innerHTML = ''; // Clear existing products
  
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, allProducts.length);
  const pageProducts = allProducts.slice(startIndex, endIndex);
  
  pageProducts.forEach(product => {
    const productElement = createProductElement(product);
    productContainer.appendChild(productElement);
  });

  updateProductCount();
}


function updateProductCount() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    let endIndex = Math.min(currentPage * ITEMS_PER_PAGE, allProducts.length);
    const totalProducts = allProducts.length;
    const productCountElement = document.getElementById('product-count');
    productCountElement.textContent = `Showing ${startIndex}-${endIndex} of ${totalProducts}`;
} 

function setupPagination() {
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const pageNumbers = document.getElementById('pageNumbers');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageNum = document.createElement('span');
    pageNum.className = `page-num ${i === currentPage ? 'active' : ''}`;
    pageNum.textContent = i;
    pageNum.addEventListener('click', () => {
      currentPage = i;
      renderProductsPage(currentPage);
      updatePaginationUI();
    });
    pageNumbers.appendChild(pageNum);
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProductsPage(currentPage);
      updatePaginationUI();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProductsPage(currentPage);
      updatePaginationUI();
    }
  });
  
  updatePaginationUI();
}

function updatePaginationUI() {
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const pageNums = document.querySelectorAll('.page-num');
  pageNums.forEach((pageNum, index) => {
    pageNum.classList.toggle('active', index + 1 === currentPage);
  });
  
  document.getElementById('prevBtn').disabled = currentPage === 1;
  document.getElementById('nextBtn').disabled = currentPage === totalPages;
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

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});