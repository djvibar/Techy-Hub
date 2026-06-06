// =========================
// SHOPPING CART FUNCTIONS
// =========================

let cart = JSON.parse(localStorage.getItem("TechyHubCart")) || [];

// Add Product to Cart
function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });
    localStorage.setItem("TechyHubCart", JSON.stringify(cart));
    alert(name + " added to cart!");
    updateCartCount();
}

// Add to Cart with Quantity
function addToCartWithQty(btn, name, price) {
    const qtySpan = btn.previousElementSibling.querySelector(".qty");
    const qty = parseInt(qtySpan.textContent);
    for (let i = 0; i < qty; i++) {
        cart.push({ name: name, price: price });
    }
    localStorage.setItem("TechyHubCart", JSON.stringify(cart));
    alert(qty + "x " + name + " added to cart!");
    updateCartCount();
}

// =========================
// QUANTITY CONTROLS
// =========================

function increaseQty(btn) {
    let qty = btn.parentElement.querySelector(".qty");
    qty.innerText = parseInt(qty.innerText) + 1;
}

function decreaseQty(btn) {
    let qty = btn.parentElement.querySelector(".qty");
    let current = parseInt(qty.innerText);
    if (current > 1) {
        qty.innerText = current - 1;
    }
}

// =========================
// DISPLAY CART ITEMS
// =========================

function displayCart() {
    const cartContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartContainer || !cartTotal) return;

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.innerText = "₱0.00";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>₱${item.price.toLocaleString()}</p>
                </div>
                <button
                    onclick="removeItem(${index})"
                    style="
                        background:red;
                        color:white;
                        border:none;
                        padding:8px 12px;
                        border-radius:6px;
                        cursor:pointer;
                    "
                >
                    Remove
                </button>
            </div>
        `;
    });

    cartTotal.innerText = "₱" + total.toLocaleString();
}

// =========================
// REMOVE ITEM
// =========================

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("TechyHubCart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// =========================
// CLEAR CART
// =========================

function clearCart() {
    const confirmClear = confirm("Are you sure you want to clear your cart?");
    if (!confirmClear) return;
    cart = [];
    localStorage.setItem("TechyHubCart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// =========================
// CHECKOUT — Opens Address Modal
// =========================

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // Show address modal instead of placing order immediately
    const modal = document.getElementById("checkoutModal");
    if (modal) modal.style.display = "flex";
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    if (modal) modal.style.display = "none";
}

function confirmCheckout() {
    const fullName   = document.getElementById("co-fullname").value.trim();
    const phone      = document.getElementById("co-phone").value.trim();
    const street     = document.getElementById("co-street").value.trim();
    const barangay   = document.getElementById("co-barangay").value.trim();
    const city       = document.getElementById("co-city").value.trim();
    const province   = document.getElementById("co-province").value.trim();
    const zipCode    = document.getElementById("co-zip").value.trim();
    const notes      = document.getElementById("co-notes").value.trim();

    if (!fullName || !phone || !street || !barangay || !city || !province || !zipCode) {
        alert("Please fill in all required fields.");
        return;
    }

    const address = `${street}, ${barangay}, ${city}, ${province} ${zipCode}`;

    const orders = JSON.parse(localStorage.getItem("TechyHubOrders")) || [];
    const total  = cart.reduce((sum, item) => sum + item.price, 0);

    const order = {
        id: "ORD-" + Date.now(),
        date: new Date().toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        items: [...cart],
        total: total,
        status: "Processing 📦",
        customer: {
            name:    fullName,
            phone:   phone,
            address: address,
            notes:   notes || "None"
        }
    };

    orders.push(order);
    localStorage.setItem("TechyHubOrders", JSON.stringify(orders));

    closeCheckoutModal();

    alert(
        "✅ Order placed successfully!\n\n" +
        "Order ID: " + order.id + "\n" +
        "Delivering to: " + address + "\n\n" +
        "Use your Order ID on the Tracking page to follow your order."
    );

    cart = [];
    localStorage.setItem("TechyHubCart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// =========================
// PRODUCT SEARCH
// =========================

function searchProducts() {
    const input = document.getElementById("searchInput");
    if (!input) return;
    const filter = input.value.toLowerCase();
    const products = document.querySelectorAll(".searchable");
    products.forEach(product => {
        const text = product.textContent.toLowerCase();
        if (text.includes(filter)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// =========================
// LOAD CART AUTOMATICALLY
// =========================

document.addEventListener("DOMContentLoaded", () => {
    displayCart();
    updateCartCount();
    loadProfile();
    loadWishlist();
    loadOrderStats();
});

// =========================
// DARK MODE
// =========================

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
    );
}

window.addEventListener("load", () => {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
});

// =========================
// WISHLIST
// =========================

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function addToWishlist(name) {
    if (wishlist.includes(name)) {
        alert(name + " is already in your wishlist!");
        return;
    }
    wishlist.push(name);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(name + " added to wishlist!");
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    loadWishlist();
    loadOrderStats();
}

function loadWishlist() {
    const container = document.getElementById("wishlistItems");
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="wishlist-empty">
                <p style="font-size:48px;">❤️</p>
                <h3>Your wishlist is empty!</h3>
                <p>Start adding your favorites today.</p>
                <a href="products.html" class="btn-primary" style="display:inline-block;margin-top:15px;">
                    Browse Products
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    wishlist.forEach((item, index) => {
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>❤️ ${item}</h3>
                </div>
                <button
                    onclick="removeFromWishlist(${index})"
                    style="
                        background:#dc2626;
                        color:white;
                        border:none;
                        padding:8px 14px;
                        border-radius:6px;
                        cursor:pointer;
                    "
                >
                    Remove
                </button>
            </div>
        `;
    });
}

// =========================
// FAQ
// =========================

function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    if (answer.style.display === "block") {
        answer.style.display = "none";
    } else {
        answer.style.display = "block";
    }
}

// =========================
// ORDER TRACKING
// =========================

function trackOrder() {
    const raw    = document.getElementById("trackingNumber").value.trim().toUpperCase();
    const result = document.getElementById("trackingResult");

    if (!raw) {
        result.innerHTML = "<p style='color:orange;'>⚠️ Please enter your Order ID.</p>";
        return;
    }

    const orders = JSON.parse(localStorage.getItem("TechyHubOrders")) || [];
    const order  = orders.find(o => o.id.toUpperCase() === raw);

    if (!order) {
        result.innerHTML = `
            <div style="margin-top:16px;padding:14px;border:2px solid #ef4444;border-radius:10px;background:#1a0000;">
                <p style="color:#ef4444;">❌ Order ID <strong>${raw}</strong> was not found.</p>
                <p style="color:#94a3b8;font-size:0.85rem;margin-top:6px;">
                    Please check the Order ID from your checkout confirmation and try again.
                </p>
            </div>`;
        return;
    }

    const steps = ["Processing 📦", "Shipped ✈️", "Out for Delivery 🚚", "Delivered ✅"];
    const statusColors = {
        "Processing 📦":       "#f97316",
        "Shipped ✈️":          "#38bdf8",
        "Out for Delivery 🚚": "#4ade80",
        "Delivered ✅":        "#a78bfa"
    };

    const status      = order.status || "Processing 📦";
    const color       = statusColors[status] || "#e2e8f0";
    const currentStep = steps.indexOf(status);
    const productList = order.items.map(i => i.name).join(", ");

    const stepHTML = steps.map((step, idx) => {
        const done    = idx <= currentStep;
        const current = idx === currentStep;
        return `
            <div style="display:flex;align-items:center;gap:10px;margin:8px 0;">
                <span style="font-size:1.1rem;">${done ? "✅" : "⬜"}</span>
                <span style="
                    color:${done ? color : "#4b5563"};
                    font-weight:${current ? "700" : "400"};
                    font-size:${current ? "1rem" : "0.9rem"};
                ">${step}${current ? " ← Current" : ""}</span>
            </div>`;
    }).join("");

    const addressHTML = order.customer ? `
        <p style="color:#64748b;font-size:0.82rem;margin-top:4px;">
            📍 Delivering to: <strong style="color:#cbd5e1;">${order.customer.address}</strong>
        </p>` : "";

    result.innerHTML = `
        <div style="
            margin-top:24px;
            padding:22px;
            border:2px solid ${color};
            border-radius:14px;
            background:#0f172a;
            box-shadow:0 0 18px ${color}33;
        ">
            <h3 style="color:${color};margin-bottom:6px;">📦 ${productList}</h3>
            <p style="color:#94a3b8;font-size:0.85rem;margin-bottom:2px;">
                Order ID: <strong style="color:#e2e8f0;">${order.id}</strong>
            </p>
            <p style="color:#64748b;font-size:0.8rem;margin-bottom:2px;">Placed on: ${order.date}</p>
            <p style="color:#64748b;font-size:0.8rem;margin-bottom:2px;">
                Total: <strong style="color:#e2e8f0;">₱${order.total.toLocaleString()}</strong>
            </p>
            ${addressHTML}
            <p style="margin:14px 0 18px;">
                Status: <strong style="color:${color};">${status}</strong>
            </p>
            <hr style="border-color:#1e293b;margin-bottom:14px;">
            <p style="color:#64748b;font-size:0.8rem;margin-bottom:10px;">ORDER PROGRESS</p>
            ${stepHTML}
        </div>`;
}

// =========================
// REGISTER USER
// =========================

function registerUser() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }
    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Registration Successful!");
    window.location.href = "login.html";
}

// =========================
// LOGIN USER
// =========================

function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email === email && user.password === password) {
        alert("Login Successful!");
        window.location.href = "profile.html";
    } else {
        alert("Invalid Email or Password");
    }
}

// =========================
// NEWSLETTER
// =========================

function subscribeNewsletter() {
    const email = document.getElementById("newsletterEmail").value;
    if (email === "") {
        alert("Please enter your email.");
        return;
    }
    alert("Thank you for subscribing, " + email + "!");
}

// =========================
// CONTACT FORM
// =========================

function submitContact() {
    alert("Thank you for reaching out! We'll get back to you soon. 📩");
}

// =========================
// CHATBOT
// =========================

function sendChat() {
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");
    if (!input || input.value === "") return;
    messages.innerHTML += `<p><strong>You:</strong> ${input.value}</p>`;
    const reply = getBotReply(input.value);
    messages.innerHTML += `<p><strong>Bot:</strong> ${reply}</p>`;
    input.value = "";
    messages.scrollTop = messages.scrollHeight;
}

function getBotReply(message) {
    const msg = message.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi")) return "Hi! How can I help you?";
    if (msg.includes("price")) return "Check our Products page for prices!";
    if (msg.includes("shipping")) return "We ship nationwide!";
    if (msg.includes("return")) return "Returns accepted within 7 days.";
    if (msg.includes("payment")) return "We accept GCash, Maya, and cards.";
    return "Sorry, I don't understand. Please contact support.";
}

// =========================
// CHATBOT MINIMIZE
// =========================

let chatbotMinimized = false;

function toggleChatbot() {
    const body = document.getElementById("chatMessages");
    const inputArea = document.getElementById("chatbotInputArea");
    const toggleBtn = document.getElementById("chatbotToggle");

    if (!body || !inputArea || !toggleBtn) return;

    chatbotMinimized = !chatbotMinimized;

    if (chatbotMinimized) {
        body.style.display = "none";
        inputArea.style.display = "none";
        toggleBtn.textContent = "+";
        toggleBtn.title = "Expand";
    } else {
        body.style.display = "block";
        inputArea.style.display = "flex";
        toggleBtn.textContent = "−";
        toggleBtn.title = "Minimize";
    }
}

// =========================
// QUICK VIEW MODAL
// =========================

function openModal(name, price) {
    document.getElementById("modalTitle").innerText = name;
    document.getElementById("modalPrice").innerText = "₱" + price.toLocaleString();
    document.getElementById("productModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
}

// =========================
// LOAD PROFILE
// =========================

function loadProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const nameEl = document.getElementById("profileName");
    const emailEl = document.getElementById("profileEmail");
    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;
}

// =========================
// ORDER HISTORY
// =========================

function loadOrderStats() {
    const orders = JSON.parse(localStorage.getItem("TechyHubOrders")) || [];
    const statEl = document.getElementById("orderCount");
    if (statEl) statEl.innerText = orders.length;

    const wishlistStatEl = document.getElementById("wishlistCount");
    if (wishlistStatEl) wishlistStatEl.innerText = wishlist.length;
}

function showOrderHistory() {
    const orders = JSON.parse(localStorage.getItem("TechyHubOrders")) || [];
    const modal = document.getElementById("orderHistoryModal");
    const body = document.getElementById("orderHistoryBody");

    if (!modal || !body) return;

    if (orders.length === 0) {
        body.innerHTML = "<p style='text-align:center;color:#6b7280;'>No orders yet. Start shopping!</p>";
    } else {
        body.innerHTML = "";
        [...orders].reverse().forEach(order => {
            const itemsList = order.items.map(i =>
                `<li>${i.name} — ₱${i.price.toLocaleString()}</li>`
            ).join("");
            const addressLine = order.customer
                ? `<p style="font-size:0.82rem;color:#6b7280;margin-top:4px;">📍 ${order.customer.address}</p>`
                : "";
            const statusLine = order.status
                ? `<p style="font-size:0.82rem;margin-top:4px;">Status: <strong>${order.status}</strong></p>`
                : "";
            body.innerHTML += `
                <div class="order-history-card">
                    <div class="order-history-header">
                        <span class="order-id">📦 ${order.id}</span>
                        <span class="order-date">${order.date}</span>
                    </div>
                    <ul class="order-items-list">${itemsList}</ul>
                    ${addressLine}
                    ${statusLine}
                    <div class="order-history-total">
                        Total: <strong>₱${order.total.toLocaleString()}</strong>
                    </div>
                </div>
            `;
        });
    }

    modal.style.display = "flex";
}

function closeOrderHistory() {
    const modal = document.getElementById("orderHistoryModal");
    if (modal) modal.style.display = "none";
}

// =========================
// LOGOUT
// =========================

function logoutUser() {
    localStorage.removeItem("user");
    alert("You have been logged out.");
    window.location.href = "login.html";
}

// =========================
// CART COUNTER
// =========================

function updateCartCount() {
    const count = document.getElementById("cartCount");
    if (!count) return;
    count.innerText = cart.length;
}

// =========================
// WELCOME MESSAGE
// =========================

window.addEventListener("load", () => {
    if (!sessionStorage.getItem("welcomeShown")) {
        alert("Welcome to TechyHub Tech Store!");
        sessionStorage.setItem("welcomeShown", true);
    }
});

// =========================
// SCROLL TO TOP
// =========================

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
    const btn = document.getElementById("topBtn");
    if (!btn) return;
    if (window.scrollY > 300) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});
