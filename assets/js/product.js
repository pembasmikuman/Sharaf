// Modular JavaScript for product.html

// Product Module
const ProductModule = (() => {
  // Private Variables
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Private Functions
  const updateCartStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const renderCart = () => {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
        <p>${item.name}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: RM ${item.price * item.quantity}</p>
      `;
      cartContainer.appendChild(itemElement);
    });
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({...product, quantity: 1});
    }
    updateCartStorage();
    renderCart();
  };

  // Public Methods
  return {
    init: () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const productList = document.querySelector('.product-list');

      // Filter Functionality
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.filter;
          const products = document.querySelectorAll('.product');
          products.forEach(product => {
            if (category === 'all' || product.classList.contains(category)) {
              product.style.display = 'block';
            } else {
              product.style.display = 'none';
            }
          });
        });
      });

      // Add to Cart Functionality
      productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
          const productElement = event.target.closest('.product');
          const product = {
            id: productElement.dataset.id,
            name: productElement.querySelector('.product-name').textContent,
            price: parseFloat(productElement.querySelector('.product-price').textContent.replace('RM', '').trim()),
          };
          addToCart(product);
        }
      });

      // Render Cart on Load
      renderCart();
    },
  };
})();

// Initialize the Product Module
window.addEventListener('DOMContentLoaded', ProductModule.init);

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