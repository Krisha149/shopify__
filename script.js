
let isLoggedIn = false;
let cartCount = 0;
let users = JSON.parse(localStorage.getItem('users')) || []; // Store users in localStorage


const products = [
    { id: 1, name: "Flower Pot", price: 350.0, image: "images/img1.avif" },
    { id: 2, name: "Door", price: 1000.0, image: "images/img2.avif" },
    { id: 3, name: "Furniture", price: 1500.0, image: "images/img3.avif" },
    { id: 4, name: "Furniture with Chair", price: 2250.0, image: "images/img4.avif" },
    { id: 5, name: "Computer", price: 90000.0, image: "images/img5.avif" },
    { id: 6, name: "Bag", price: 450.0, image: "images/img6.avif" },
    { id: 7, name: "Suit", price: 750.0, image: "images/img7.avif" },
    { id: 8, name: "Clothes", price: 1150.0, image: "images/img8.avif" },
    { id: 9, name: "Door2", price: 2250.0, image: "images/img9.avif" },
    { id: 10, name: "Window1", price: 1250.0, image: "images/img10.avif" },
    { id: 11, name: "Window2", price: 1940.0, image: "images/img11.avif" },
    { id: 12, name: "Makeup", price: 1120.0, image: "images/img12.avif" },
];

let cartItems = []; // Clone the initial cart items

const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const epayAmountElement = document.getElementById('epay-amount');
const orderTotalElement = document.getElementById('order-total');
const clearCartButton = document.getElementById('clear-cart');
const giftWrapElement = document.getElementById('gift-wrap');
const discountCouponElement = document.getElementById('discount-coupon');



// Update Cart Display
function updateCartDisplay() {
    document.getElementById('cart-count').innerText = cartCount;

}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return; // Prevent error if gallery is not found
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="200" height="200">
            <p>${product.name}</p>
            <p> ₹${product.price}</p>
            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        `;
        gallery.appendChild(productDiv);
    });
}

function handleAddToCart(event) {
    const productId = event.target.dataset.productId;
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
        cartItems.push(product);
        cartCount++;
        document.getElementById('cart-count').innerText = cartCount;
        alert(`${product.name} has been added to your cart.`);
    }
}

function handleCartButton() {
    if (!isLoggedIn) {
        document.getElementById('signin-popup').style.display = 'flex';
    } else {
        document.getElementById('cart-page').style.display = 'flex';
        renderCartItems();
    }
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <p>${item.name}</p>
            <p> ₹${item.price}</p>
            <button class="remove-btn" data-id="${item.id}">Remove from Cart</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
    updateSubtotal();
}

function updateSubtotal() {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    updateOrderTotal(subtotal);
}

function updateOrderTotal(subtotal) {
    const epayAmount = Math.floor(Math.random() * 50) + 10; // Random between 10-50
    epayAmountElement.textContent = `₹${epayAmount.toFixed(2)}`
    giftWrapElement.textContent = `₹${epayAmount.toFixed(2)}`;

    const orderTotal = subtotal + epayAmount;
    orderTotalElement.textContent = `₹${orderTotal.toFixed(2)}`;
    // orderTotal;
}

// Handle product removal
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        cartItems = cartItems.filter((item) => item.id !== productId);

        // Update cartCount after removal
        cartCount = cartItems.length;
        document.getElementById('cart-count').innerText = cartCount;
        renderCartItems();
    }
});

clearCartButton.addEventListener('click', () => {
    cartItems = [];
    cartCount = 0;  // Reset cart count
    updateCartDisplay(); // Update the displayed cart count
    document.getElementById('cart-count').innerText = cartCount;
    renderCartItems();
    resetTotals();  // Reset all amounts to zero
});

function handleRemoveFromCart(event) {
    const productId = event.target.dataset.productId;
    const productIndex = cartItems.findIndex(p => p.id === parseInt(productId));
    if (productIndex !== -1) {
        cartItems.splice(productIndex, 1);
        cartCount--;
        document.getElementById('cart-count').innerText = cartCount;
        renderCartItems(); // Refresh cart items display
    }
}

function closePopup() {
    document.getElementById('signin-popup').style.display = 'none';
    document.getElementById('signup-popup').style.display = 'none';
}

// Handle Cart Button Click
document.getElementById('cart-button').addEventListener('click', () => {
    if (cartItems.length > 0) {
        document.getElementById('cart-page').style.display = 'block';
    } else {
        alert('Your cart is empty!');
    }
});

// Handle Pay Now Button Click
document.getElementById('pay-now-button').addEventListener('click', () => {
    const form = document.getElementById('checkout-form');
    if (form.checkValidity()) {
        alert('Payment successful!');
        generateDiscountCoupon(); // Generate coupon after successful payment
        cartItems = [];
        cartCount = 0;
        updateCartDisplay();
        resetTotals();  // Reset all amounts to zero
        document.getElementById('cart-page').style.display = 'none';
    } else {
        alert('Please fill out all required fields.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (savedUsers.length > 0) users = savedUsers;

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });


    document.getElementById('cart-button').addEventListener('click', handleCartButton);

    // Sign In Form Submission
    document.getElementById('signin-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            isLoggedIn = true;
            document.getElementById('user-name').innerText = `Welcome, ${user.firstName} ${user.lastName}`;
            alert("Sign in successful!");
            closePopup();
            document.getElementById('cart-page').style.display = 'flex';
            renderCartItems();
        } else {
            alert("This account is not registered. Please sign up.");
        }
    });

    // Show Sign Up Popup
    document.getElementById('show-signup').addEventListener('click', () => {
        closePopup();
        document.getElementById('signup-popup').style.display = 'flex';
    });

    // Sign Up Form Submission
    document.getElementById('signup-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const firstName = event.target[0].value;
        const lastName = event.target[1].value;
        const email = event.target[2].value;
        const password = event.target[3].value;


        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert("This email is already registered. Please sign in.");
            closePopup();
            document.getElementById('signin-popup').style.display = 'flex'; // Show sign-in popup
            return;
        }

        const newuser = { firstName, lastName, email, password };
        users.push(newuser);
        localStorage.setItem('users', JSON.stringify(users)); // Save user data to localStorage
        alert("Sign up successful! You can now sign in.");
        closePopup();
    });
    // Show Sign In Popup
    document.getElementById('show-signin').addEventListener('click', () => {
        closePopup();
        document.getElementById('signin-popup').style.display = 'flex';
    });

    // Close popup when clicking outside of it
    window.onclick = function (event) {
        if (event.target.className === 'popup') {
            closePopup();
        }
    };
});

// Call calculateTotal whenever the cart page is loaded
document.addEventListener('DOMContentLoaded', calculateTotal);

// Example function to add items to the cart
function addItemToCart(item) {
    cartItems.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    calculateTotal(); // Update totals whenever an item is added
}

// Calculate Total Price and E-Pay
function calculateTotal() {
    const subtotal = cartItems1.reduce((total, item) => total + item.price, 0);
    const epay = subtotal * 0.05; // 5% E-Pay tax
    const total = subtotal + epay;

    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('epay-amount').textContent = `₹${epay.toFixed(2)}`;
    document.getElementById('order-total').textContent = `₹${total.toFixed(2)}`;
}

// Example: Adding an item to the cart (dynamically)
function addItemToCart(itemName, itemPrice) {
    const cartItems = document.getElementById("cart-items");
    const newItem = document.createElement("div");
    newItem.classList.add("cart-items");
    newItem.innerHTML = `
    <span>${itemName}</span>
    <span class="item-price">${itemPrice.toFixed(2)}</span>
  `;
    cartItems.appendChild(newItem);

    // Recalculate total after adding the item
    calculateTotal();
}

// Function to Reset Totals to Zero
function resetTotals() {
    subtotalElement.textContent = '₹0.00';
    epayAmountElement.textContent = '₹0.00';
    giftWrapElement.textContent = '₹0.00';
    orderTotalElement.textContent = '₹0.00';
}

// Generate Discount Coupon
function generateDiscountCoupon() {
    alert(`Congratulations! You have received a discount coupon.`)
    discountCouponElement.style.display = 'block';
}

