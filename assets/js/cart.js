document.addEventListener('DOMContentLoaded', () => {
    // Select all quantity controls
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

    // Select all remove icons
    const removeIcons = document.querySelectorAll('.remove-icon');

    removeIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const cartItem = icon.closest('.cart-item');
            if (cartItem) {
                cartItem.remove();
                updateCartSummary();
            }
        });
    });

    // Promo code functionality
    const promoCodeInput = document.querySelector('.promo-code .input');
    const applyButton = document.querySelector('.promo-code .apply-button');
    let isPromoCodeApplied = false;

    applyButton.addEventListener('click', () => {
        const promoCode = promoCodeInput.value.trim().toLowerCase();
        if (promoCode === 'webtech') {
            isPromoCodeApplied = true;
            updateCartSummary();
            alert('Promo code applied successfully! You now get a 40% discount.');
        } else {
            isPromoCodeApplied = false;
            alert('Invalid promo code. Please try again.');
        }
    });

    // Checkout button functionality
    const checkoutButton = document.querySelector('.checkout-button');
    const cartItemsContainer = document.querySelector('.cart-items');

    checkoutButton.addEventListener('click', () => {
        // Show the popup
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <ion-icon name="checkmark-outline" style="font-size: 60px; color: white;"></ion-icon>
            <p style="margin-top: 10px;">Purchase completed!</p>
        `;

        // Add the popup to the body
        document.body.appendChild(popup);

        // Hide the popup after 3 seconds
        setTimeout(() => {
            popup.remove();
        }, 3000);

        // Replace cart content with the basket icon
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message" style="text-align: center; padding: 20px;">
                <ion-icon name="basket-outline" style="font-size: 60px; color: rgba(189, 138, 65, 1);"></ion-icon>
                <p style="font-size: 18px; color: #333; margin-top: 10px; font-family: Arial, Helvetica, sans-serif;
                }">Your cart is now empty.</p>
            </div>
        `;

        // Update the cart summary
        updateCartSummary();
    });

    // Function to update the cart summary
    function updateCartSummary() {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const priceElement = item.querySelector('.item-price');
            if (priceElement) {
                const price = parseFloat(priceElement.textContent.replace('RM', ''));
                subtotal += price;
            }
        });

        // Update subtotal
        const subtotalElement = document.querySelector('.summary-item .value:not(.discount)');
        if (subtotalElement) {
            subtotalElement.textContent = `RM ${subtotal.toFixed(2)}`;
        }

        // Update discount
        const discountElement = document.querySelector('.summary-item .value.discount');
        let discountRate = 0.20;
        if (isPromoCodeApplied) {
            discountRate = 0.40; // Total 40% discount
        }
        const discount = subtotal * discountRate;
        if (discountElement) {
            discountElement.textContent = `-RM ${discount.toFixed(2)}`;
        }

        // Update total
        const deliveryFee = 5; // Fixed delivery fee
        const totalElement = document.querySelector('.summary-item.total .value');
        if (totalElement) {
            totalElement.textContent = `RM ${(subtotal - discount + deliveryFee).toFixed(2)}`;
        }
    }

    // Initial cart summary update
    updateCartSummary();
});
