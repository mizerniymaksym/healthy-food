/* =============================================
   NutriSite — app.js
   Catalog rendering, search, greeting, modal
   ============================================= */

"use strict";

// ── Simulated AJAX fetch (replace URL with real server in production) ──
function fetchMenuData() {
  return new Promise((resolve) => {
    // Simulates network latency as if loading from server
    setTimeout(() => resolve(MENU_DATA), 400);
  });
}

// ── State ──
let allItems = [];
let activeCategory = "all";

// ── Init ──
document.addEventListener("DOMContentLoaded", async () => {
  initScrollReveal();
  initNavbar();
  initGreeting();
  initHamburger();
  initReviews();

  try {
    const data = await fetchMenuData();
    buildCatalog(data);
  } catch (e) {
    document.getElementById("menuGrid").innerHTML =
      '<p class="error">Failed to load menu. Please try again later.</p>';
  }
});

// ── Build full catalog from JSON ──
function buildCatalog(data) {
  allItems = data.categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryId: cat.id,
      categoryName: cat.name,
    }))
  );

  buildCategoryTabs(data.categories);
  renderItems(allItems);
  initSearch();
}

// ── Category tabs ──
function buildCategoryTabs(categories) {
  const tabs = document.getElementById("catTabs");
  tabs.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "cat-tab active";
  allBtn.textContent = "🍽️ All";
  allBtn.dataset.cat = "all";
  allBtn.addEventListener("click", () => filterByCategory("all", allBtn));
  tabs.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "cat-tab";
    btn.textContent = cat.name;
    btn.dataset.cat = cat.id;
    btn.addEventListener("click", () => filterByCategory(cat.id, btn));
    tabs.appendChild(btn);
  });
}

function filterByCategory(catId, clickedBtn) {
  activeCategory = catId;
  document
    .querySelectorAll(".cat-tab")
    .forEach((b) => b.classList.remove("active"));
  clickedBtn.classList.add("active");

  const filtered =
    catId === "all" ? allItems : allItems.filter((i) => i.categoryId === catId);

  renderItems(filtered);
}

// ── Render cards ──
// ── Render cards ──
function renderItems(items) {
  const grid = document.getElementById("menuGrid");
  if (!items.length) {
    grid.innerHTML =
      '<p class="no-results">No dishes found. Try a different search.</p>';
    return;
  }

  // Звичайні картки, які відкривають модалку при кліку
  grid.innerHTML = items
    .map(
      (item) => `
       <div class="dish-card" onclick="openModal('${item.id}')">
         <div class="dish-icon${
           isImagePath(item.image) ? " dish-icon--photo" : ""
         }">
           ${
             isImagePath(item.image)
               ? `<img src="${item.image}" alt="${item.name}">`
               : item.image
           }
         </div>
         <div class="dish-info">
           <div class="dish-cat">${item.categoryName}</div>
           <h3 class="dish-name">${item.name}</h3>
           <p class="dish-desc">${item.description}</p>
           <div class="dish-meta">
             <span class="dish-cal">🔥 ${item.calories} kcal</span>
             <span class="dish-price">${item.price}</span>
           </div>
           <div class="dish-tags">
             ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
           </div>
         </div>
       </div>
     `
    )
    .join("");
}

// ── Search ──
function initSearch() {
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      resultsBox.classList.add("hidden");
      renderItems(
        activeCategory === "all"
          ? allItems
          : allItems.filter((i) => i.categoryId === activeCategory)
      );
      return;
    }

    const matches = allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((t) => t.includes(query)) ||
        item.categoryName.toLowerCase().includes(query)
    );

    // Inline highlight in grid
    renderItems(matches);

    // Dropdown suggestion
    if (matches.length && query.length >= 2) {
      resultsBox.innerHTML = matches
        .slice(0, 5)
        .map(
          (item) =>
            `<div class="search-item" onclick="openModal('${item.id}')">
             <span class="search-thumb">${
               isImagePath(item.image)
                 ? `<img src="${item.image}" alt="${item.name}">`
                 : item.image
             }</span>
             <span><strong>${item.name}</strong> <small>${
              item.categoryName
            }</small></span>
             <span class="search-price">${item.price}</span>
           </div>`
        )
        .join("");
      resultsBox.classList.remove("hidden");
    } else {
      resultsBox.classList.add("hidden");
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-section")) {
      resultsBox.classList.add("hidden");
    }
  });
}

// ── Helper: check if image field is a file path ──
function isImagePath(src) {
  return (
    src &&
    (src.includes("/") ||
      src.endsWith(".jpg") ||
      src.endsWith(".png") ||
      src.endsWith(".webp"))
  );
}

// ── Modal ──
function openModal(itemId) {
  const item = allItems.find((i) => i.id === itemId);
  if (!item) return;

  const recipeText =
    item.recipe ||
    "Mix fresh ingredients, season with herbs and olive oil, and enjoy a healthy meal!";

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-flip-container" onclick="this.classList.toggle('flipped')">
      <div class="modal-flip-inner">
        
        <div class="modal-front">
           <div class="modal-icon${
             isImagePath(item.image) ? " modal-icon--photo" : ""
           }">
             ${
               isImagePath(item.image)
                 ? `<img src="${item.image}" alt="${item.name}">`
                 : item.image
             }
           </div>
           <div class="modal-cat">${item.categoryName}</div>
           <h2 class="modal-title">${item.name}</h2>
           <p class="modal-desc">${item.description}</p>
           <div class="modal-macros">
             <div class="macro"><span class="macro-val">🔥 ${
               item.calories
             }</span><span class="macro-lbl">Calories</span></div>
             <div class="macro"><span class="macro-val">💪 ${
               item.protein
             }</span><span class="macro-lbl">Protein</span></div>
             <div class="macro"><span class="macro-val">🥑 ${
               item.fat
             }</span><span class="macro-lbl">Fat</span></div>
           </div>
           <div class="dish-tags" style="margin-bottom:20px; justify-content: center;">
             ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
           </div>
           <div class="modal-price">${item.price}</div>
           
           <div style="text-align: center;">
             <button class="btn-primary" onclick="event.stopPropagation(); closeModal()">Order Now →</button>
           </div>
           <div class="flip-hint">↺ Click anywhere to see the recipe</div>
        </div>

        <div class="modal-back">
           <div class="modal-icon" style="font-size: 3rem; margin-bottom: 0;">👨‍🍳</div>
           <div class="modal-cat">Recipe</div>
           <h2 class="modal-title" style="margin-bottom: 20px;">${
             item.name
           }</h2>
           
           <p class="modal-desc" style="font-size: 1rem; padding: 0 15px;">${recipeText}</p>
           
           <div style="text-align: center; margin-top: 30px;">
             <button class="btn-primary" style="background: var(--green-pale); color: var(--green-primary);" onclick="event.stopPropagation(); closeModal()">Close</button>
           </div>
           <div class="flip-hint">↺ Click anywhere to flip back</div>
        </div>

      </div>
    </div>
  `;
  document.getElementById("modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.body.style.overflow = "";
}

// ── Greeting ──
function initGreeting() {
  function greet(inputId) {
    const name = document.getElementById(inputId).value.trim();
    if (!name) return;
    const greetings = [
      `👋 Hello, ${name}! Welcome to NutriSite — eat well, live well!`,
      `🌿 Hey ${name}! Ready to discover your perfect healthy meal?`,
      `🥗 Greetings, ${name}! Your nutrition journey starts here!`,
    ];
    const msg = greetings[Math.floor(Math.random() * greetings.length)];
    const banner = document.getElementById("greetBanner");
    document.getElementById("greetText").textContent = msg;
    banner.classList.remove("hidden");
    banner.classList.add("animate-in");
    setTimeout(() => banner.classList.add("hidden"), 5000);
  }

  document
    .getElementById("greetBtn")
    .addEventListener("click", () => greet("userName"));
  document.getElementById("userName").addEventListener("keydown", (e) => {
    if (e.key === "Enter") greet("userName");
  });

  document
    .getElementById("footerGreetBtn")
    .addEventListener("click", () => greet("footerName"));
  document.getElementById("footerName").addEventListener("keydown", (e) => {
    if (e.key === "Enter") greet("footerName");
  });
}

// ── Hamburger ──
function initHamburger() {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("nav-links");
  btn.addEventListener("click", () => {
    links.classList.toggle("open");
    btn.classList.toggle("active");
  });
  // close on link click
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.classList.remove("active");
    })
  );
}

// ── Scroll Reveal ──
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  // Hero visible immediately
  document
    .querySelectorAll("#hero .reveal")
    .forEach((el) => el.classList.add("visible"));
}

// ── Navbar active link on scroll ──
function initNavbar() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  });
}
let reviews = JSON.parse(localStorage.getItem("nutriReviews")) || [];
let currentRating = 5;
let currentAvatar = "👨";

function initReviews() {
  const avatarBtns = document.querySelectorAll(".avatar-btn");
  avatarBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      avatarBtns.forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      currentAvatar = e.currentTarget.dataset.avatar;
    });
  });

  const starSpans = document.querySelectorAll("#starRating span");

  starSpans.forEach((span) => {
    span.addEventListener("mouseover", (e) => {
      const hoverValue = parseInt(e.target.dataset.val);
      highlightStars(hoverValue);
    });

    span.addEventListener("mouseout", () => {
      highlightStars(currentRating);
    });

    span.addEventListener("click", (e) => {
      currentRating = parseInt(e.target.dataset.val);
      highlightStars(currentRating);
    });
  });

  highlightStars(currentRating);

  const submitBtn = document.getElementById("submitReviewBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const text = document.getElementById("reviewText").value.trim();
      const nameInput = document.getElementById("reviewName").value.trim();
      const userName = nameInput ? nameInput : "Guest";

      if (!text) {
        alert("Please write a comment!");
        return;
      }

      addReview({
        name: userName,
        text: text,
        rating: currentRating,
        avatar: currentAvatar,
      });

      document.getElementById("reviewText").value = "";
      document.getElementById("reviewName").value = "";
      currentRating = 5;
      highlightStars(currentRating);

      document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
    });
  }

  renderReviews();
}

function highlightStars(rating) {
  const starSpans = document.querySelectorAll("#starRating span");
  starSpans.forEach((span) => {
    if (parseInt(span.dataset.val) <= rating) {
      span.style.color = "#f5a623";
    } else {
      span.style.color = "#ccc";
    }
  });
}

function addReview(review) {
  reviews.push(review);

  if (reviews.length > 4) {
    reviews.shift();
  }

  localStorage.setItem("nutriReviews", JSON.stringify(reviews));

  renderReviews();
}

function renderReviews() {
  const container = document.getElementById("heroReviews");
  if (!container) return;

  container.innerHTML = "";

  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="no-reviews-msg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center; z-index: 10;">
        <p style="margin-bottom: 12px; font-weight: 600; color: #2b3a2e;">No comments yet!</p>
        <a href="#reviews-form-section" class="btn-primary" style="font-size: 0.8rem; padding: 10px 20px; display: inline-block; text-decoration: none;">
          Be the first! 👇
        </a>
      </div>
    `;
    return;
  }

  reviews.forEach((rev, index) => {
    const card = document.createElement("div");

    const positionClass = `review-pos-${index + 1}`;

    card.className = `review-card ${positionClass}`;

    const starsHtml = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);

    card.innerHTML = `
      <div class="review-avatar">
        <span class="avatar-icon" style="font-size: 1rem; display: flex; justify-content: center; align-items: center;">${rev.avatar}</span>
        <span class="review-name">${rev.name}</span>
      </div>
      <div class="stars" style="color: #f5a623; margin-bottom: 4px; font-size: 0.8rem;">${starsHtml}</div>
      <p class="review-text">${rev.text}</p>
    `;
    container.appendChild(card);
  });
}
