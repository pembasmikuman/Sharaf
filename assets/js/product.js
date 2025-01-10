// ================ SWIPER CLASS ===================
const swiper = new Swiper('.swiper', {
  loop: false,
  grabCursor: true,
  slidesPerView: '2',

  scrollbar: {
    el: '.swiper-scrollbar',
  },

  breakpoints: {
    768: {
      slidesPerView: '3',
      spacebetween: 30
    },
    1024: {
      slidesPerView: '4',
      spacebetween: 30
    }
  }
})


// product.js
let currentProduct = null;
let allProducts = [];

async function fetchProductDetails() {
    try {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        // Fetch product data
        const response = await fetch('assets/fragrances.json');
        const data = await response.json();
        allProducts = data.fragrances;  
        currentProduct = data.fragrances.find(p => p.id === parseInt(productId));
        
        if (!currentProduct) {
            console.error('Product not found');
            return;
        }

        // Get the product container
        const productContainer = document.querySelector('.product-container');
        if (!productContainer) {
          updateProductDisplay(productContainer);
          generateRelatedProducts();
          setupEventListeners();
        }

        // Create the HTML structure
        const productHTML = `
            <div class="product-images">
                <div class="main-image">
                    <img class="product_img" src="${currentProduct.image}" alt="${currentProduct.name}">
                </div>
            </div>
            <div class="product-info">
                <div class="product_details">
                    <h3 class="product-name">${currentProduct.name}</h3>
                    <div class="rating-wrapper">
                        ${generateRatingStars(currentProduct.rating)}
                    </div>
                    <div class="price_wrapper">
                        <h3>RM ${currentProduct.prices['100ml']}
                            ${currentProduct.prices['100ml'] < currentProduct.prices.original ? `
                                <h3 style="text-decoration: line-through; color: #999999;">
                                    RM ${currentProduct.prices.original}
                                </h3>
                                <div class="discount_badge">
                                    -${calculateDiscount(currentProduct.prices['100ml'], currentProduct.prices.original)}%
                                </div>
                            ` : ''}
                        </h3>
                    </div>
                </div>
                <p class="product-description">${currentProduct.description}</p>
                <div class="size-selector">
                    ${Object.keys(currentProduct.prices)
                        .filter(size => size !== 'original')
                        .map(size => `
                            <div class="size-option ${size === '100ml' ? 'selected' : ''}" 
                                 onclick="selectSize(this)">${size}</div>
                        `).join('')}
                </div>
                <div class="quantity-container">
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
        
        // Append to product container
        productContainer.innerHTML = productHTML;
        setupEventListeners();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

function generateRatingStars(rating) {
    return Array(5).fill('')
        .map((_, index) => `<i class="ri-star-${index < rating ? 'fill' : 'line'} star_icon"></i>`)
        .join('') + 
        `<div class="rating-value">${rating}/<span style="font-weight: 100;">5</span></div>`;
}

function calculateDiscount(currentPrice, originalPrice) {
    return Math.round((originalPrice - currentPrice) / originalPrice * 100);
}

function setupEventListeners() {
    const quantityContainer = document.querySelector('.quantity-container');
    const quantitySpan = quantityContainer.querySelector('span');
    const decreaseBtn = quantityContainer.querySelector('button:first-child');
    const increaseBtn = quantityContainer.querySelector('button:nth-child(3)');
    
    decreaseBtn.onclick = () => {
        const currentQty = parseInt(quantitySpan.textContent);
        if (currentQty > 1) quantitySpan.textContent = currentQty - 1;
    };
    
    increaseBtn.onclick = () => {
        const currentQty = parseInt(quantitySpan.textContent);
        quantitySpan.textContent = currentQty + 1;
    };
}

document.addEventListener('DOMContentLoaded', fetchProductDetails);

function generateRelatedProducts() {
  // Get random products excluding current product
  const otherProducts = allProducts.filter(p => p.id !== currentProduct.id);
  const randomProducts = otherProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  
  // Get swiper wrapper
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  
  // Clear existing slides
  swiperWrapper.innerHTML = '';
  
  // Generate slides for each random product
  randomProducts.forEach(product => {
      const slide = `
          <article class="product-related swiper-slide">
              <div class="product_image">
                  <img class="product_img" src="${product.image}" alt="${product.name}">
              </div>
              <div class="product_details">
                  <a href="product.html?id=${product.id}" class="product-name-link"><h3 class="product_name">${product.name}</h3></a>

                  <div class="rating-wrapper">
                      ${generateRatingStars(product.rating)}
                  </div>

                  <div class="price_wrapper_like">
                      <h3>RM ${product.prices['100ml']}
                          ${product.prices['100ml'] < product.prices.original ? `
                              <h3 style="text-decoration: line-through; color: #999999;">
                                  RM ${product.prices.original}
                              </h3>
                              <div class="discount_badge">
                                  -${Math.round((product.prices.original - product.prices['100ml']) / product.prices.original * 100)}%
                              </div>
                          ` : ''}
                      </h3>
                  </div>
              </div>
          </article>
      `;
      swiperWrapper.innerHTML += slide;
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchProductDetails)

// Call this after fetching product details
document.addEventListener('DOMContentLoaded', () => {
  fetchProductDetails().then(() => {
      if (currentProduct) {
          generateRelatedProducts();
      }
  });
});

document.querySelectorAll('.product-name-link').forEach(productLink => {
  productLink.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.id;
      window.location.href = `product.html?id=${productId}`;
  });
});

function selectSize(element) {
  // Remove selected class from all size options
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => option.classList.remove('selected'));
  
  // Add selected class to clicked option
  element.classList.add('selected');
  
  // Get the selected size
  const selectedSize = element.textContent;
  
  // Update price based on selected size
  const priceWrapper = document.querySelector('.price_wrapper');
  const newPrice = currentProduct.prices[selectedSize];
  const originalPrice = currentProduct.prices.original;
  
  priceWrapper.innerHTML = `
      <h3>RM ${newPrice}
          ${newPrice < originalPrice ? `
          ` : ''}
      </h3>
  `;
}

function updateSizeOptions(container) {
  const sizeSelector = container.querySelector('.size-selector');
  if (!sizeSelector) return;
  
  sizeSelector.innerHTML = Object.keys(currentProduct.prices)
      .filter(size => size !== 'original')
      .map(size => `
          <div class="size-option ${size === '100ml' ? 'selected' : ''}" 
               onclick="selectSize(this)" 
               data-size="${size}">
              ${size}
          </div>
      `).join('');
}

function setupAddToCart() {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (!addToCartBtn) return;

  addToCartBtn.addEventListener('click', () => {
      // Get selected size and quantity
      const selectedSize = document.querySelector('.size-option.selected').textContent;
      const quantity = parseInt(document.querySelector('.quantity-container span').textContent);
      
      // Create cart item object
      const cartItem = {
          id: currentProduct.id,
          name: currentProduct.name,
          image: currentProduct.image,
          size: selectedSize,
          quantity: quantity,
          price: currentProduct.prices[selectedSize],
          originalPrice: currentProduct.prices.original,
          basePrice: currentProduct.prices[selectedSize] // Store base price for quantity calculations
      };
      
      // Get existing cart or initialize new one
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if item with same id and size exists
      const existingItemIndex = cart.findIndex(item => 
          item.id === cartItem.id && item.size === cartItem.size
      );
      
      if (existingItemIndex > -1) {
          // Update quantity if item exists
          cart[existingItemIndex].quantity += quantity;
      } else {
          // Add new item if it doesn't exist
          cart.push(cartItem);
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show success message and redirect
      showAddToCartMessage();
      setTimeout(() => {
          window.location.href = 'cart.html';
      }, 2000);
  });
}

function showAddToCartMessage() {
  const message = document.createElement('div');
  message.className = 'add-to-cart-message';
  message.innerHTML = `
      <div class="message-content">
          <i class="ri-shopping-cart-line"></i>
          Added to cart successfully!
      </div>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
      message.remove();
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProductDetails().then(() => {
      setupEventListeners();
      setupAddToCart(); // Add this line
  });
});
