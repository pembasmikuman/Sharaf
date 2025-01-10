let isPromoCodeApplied = false;

document.addEventListener('DOMContentLoaded', () => {
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    quantityControls.forEach(control => {
        const quantityElement = control.querySelector('.quantity');
        const decreaseButton = control.querySelector('.quantity-decrease');
        const increaseButton = control.querySelector('.quantity-increase');
        const cartItem = control.closest('.cart-item');
        const priceElement = cartItem.querySelector('.item-price');
        const basePrice = parseFloat(priceElement.textContent.replace('RM', ''));
        
        // Decrease quantity
        decreaseButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityElement.textContent, 10);
            if (currentQuantity > 1) {
                currentQuantity -= 1;
                quantityElement.textContent = currentQuantity;
                priceElement.textContent = `RM ${(basePrice * currentQuantity).toFixed(2)}`;
                updateCartSummary();
            }
        }); // Missing closing bracket was here
        
        // Increase quantity
        increaseButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityElement.textContent, 10);
            currentQuantity += 1;
            quantityElement.textContent = currentQuantity;
            priceElement.textContent = `RM ${(basePrice * currentQuantity).toFixed(2)}`;
            updateCartSummary();
        });
    });
 // Promo code functionality
 const promoCodeInput = document.querySelector('.promo-code .input');
 const applyButton = document.querySelector('.promo-code .apply-button');

 applyButton.addEventListener('click', () => {
     const promoCode = promoCodeInput.value.trim().toLowerCase();
     const discountLabel = document.querySelector('.discount-label');

     if (promoCode === 'webtech') {
         isPromoCodeApplied = true;
         updateCartSummary();
         if (discountLabel) {
             discountLabel.textContent = 'Discount (-40%)';
         }
         showPopup('Voucher applied!');
     } else {
         isPromoCodeApplied = false;
         if (discountLabel) {
             discountLabel.textContent = 'Discount (-20%)';
         }
         showPopup('Invalid promo code!', true);
     }
 });
});

function updateCartSummary() {
 let subtotal = 0;
 document.querySelectorAll('.cart-item').forEach(item => {
     const priceElement = item.querySelector('.item-price');
     if (priceElement) {
         const price = parseFloat(priceElement.textContent.replace('RM', ''));
         subtotal += price;
     }
 });

 const subtotalElement = document.querySelector('.summary-item .value:not(.discount)');
 if (subtotalElement) {
     subtotalElement.textContent = `RM ${subtotal.toFixed(2)}`;
 }

 const discountElement = document.querySelector('.summary-item .value.discount');
 let discountRate = isPromoCodeApplied ? 0.40 : 0.20;
 const discount = subtotal * discountRate;
 if (discountElement) {
     discountElement.textContent = `-RM ${discount.toFixed(2)}`;
 }

 const deliveryFee = 5;
 const totalElement = document.querySelector('.summary-item.total .value');
 if (totalElement) {
     totalElement.textContent = `RM ${(subtotal - discount + deliveryFee).toFixed(2)}`;
 }
}

function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const itemHTML = `
                               <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}"/>
                        </div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-size">Size: ${item.size}</div>
                            <div class="item-price">RM ${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <div class="item-actions">
                            <span class="remove-icon"><i class="ri-delete-bin-line remove-icon"></i></span>
                            <div class="quantity-control">
                                <span class="quantity-decrease"><ion-icon name="remove-outline"></ion-icon></span>
                                <div class="quantity">${item.quantity}</div>
                                <span class="quantity-increase"><ion-icon name="add-outline"></ion-icon></span>
                            </div>
                        </div>
                    </div>
        `;
        cartItemsContainer.innerHTML += itemHTML;
    });
    
    updateCartSummary();
}

// Add this to cart.js
function setupRemoveIcons() {
    const removeIcons = document.querySelectorAll('.remove-icon');
    
    removeIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const cartItem = icon.closest('.cart-item');
            if (!cartItem) return;
            
            // Get item details for removal
            const itemId = cartItem.dataset.id;
            const itemSize = cartItem.dataset.size;
            
            // Remove from localStorage
            removeFromLocalStorage(itemId, itemSize);
            
            // Remove from UI
            cartItem.remove();
            updateCartSummary();
            
            // Show removal message
            showRemoveMessage();
        });
    });
}

function removeFromLocalStorage(itemId, itemSize) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Filter out the item to be removed
    cart = cart.filter(item => 
        !(item.id === parseInt(itemId) && item.size === itemSize)
    );
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showRemoveMessage() {
    const message = document.createElement('div');
    message.className = 'remove-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="ri-delete-bin-line"></i>
            Item removed from cart
        </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}


// Initialize cart display when cart.html loads
document.addEventListener('DOMContentLoaded', ()=> {

    displayCartItems();
    setupRemoveIcons();
});


/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    reset: false // Animation repeat
});

sr.reveal(`.main-content`, {transition: 1000, origin:'left'})
sr.reveal(`.footer_container`, {transition: 500, origin:'bottom'})