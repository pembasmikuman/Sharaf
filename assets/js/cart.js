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
        }); 
        
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

 // Add this function before the promo code event listener
function showPopup(message, isError = false) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    if (isError) {
        popup.style.backgroundColor = '#ff4444';
        popup.style.color = 'white';
    } else {
        popup.style.backgroundColor = '#4CAF50';
        popup.style.color = 'white';
    }
    
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '15px 25px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    popup.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Add this CSS for the animation
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);

});

function updateCartSummary() {
    let subtotal = 0;
    const cartItems = document.querySelectorAll('.cart-item');
    
    // Calculate subtotal from cart items
    cartItems.forEach(item => {
        const priceElement = item.querySelector('.item-price');
        if (priceElement) {
            const price = parseFloat(priceElement.textContent.replace('RM', ''));
            subtotal += price;
        }
    });

    // Update subtotal
    const subtotalElement = document.querySelector('.summary-item .value');
    if (subtotalElement) {
        subtotalElement.textContent = `RM ${subtotal.toFixed(2)}`;
    }

    // Handle discount section
    const discountItem = document.querySelector('.summary-item:has(.discount-label)');
    const discountElement = document.querySelector('.summary-item .value.discount');
    const discountLabel = document.querySelector('.discount-label');
    
    // Hide discount section by default
    if (discountItem) discountItem.style.display = 'none';
    
    // Show and update discount only if promo code is applied
    if (isPromoCodeApplied) {
        if (discountItem) discountItem.style.display = 'flex';
        const discount = subtotal * 0.40;
        if (discountElement) {
            discountElement.textContent = `-RM ${discount.toFixed(2)}`;
        }
        if (discountLabel) {
            discountLabel.textContent = 'Discount (-40%)';
        }
    }

    // Fixed delivery fee
    const deliveryFee = subtotal > 0 ? 5 : 0;

    // Update total
    const totalElement = document.querySelector('.summary-item.total .value');
    if (totalElement) {
        const discount = isPromoCodeApplied ? (subtotal * 0.40) : 0;
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

const checkoutButton = document.querySelector('.checkout-button');
const cartItemsContainer = document.querySelector('.cart-items');

checkoutButton.addEventListener('click', () => {
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    
    // Show success popup
    showPopup('Purchase completed!');
    
    // Empty cart container
    cartItemsContainer.innerHTML = '';
    
    // Reset cart summary
    updateCartSummary();
});

function showPopup(message, isError = false) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        background-color: ${isError ? '#ff4444' : '#4CAF50'};
        color: white;
        animation: slideIn 0.3s ease-out;
    `;
    
    popup.textContent = message;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
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

    popup.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        background-color: ${isError ? '#ff4444' : '#4CAF50'};
        color: white;
        animation: slideIn 0.3s ease-out;
    `;

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