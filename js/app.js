"use strict";

function fetchMenuData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MENU_DATA), 400);
  });
}

let allItems = [];
let activeCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {
  initScrollReveal();
  initNavbar();
  initGreeting();
  initHamburger();
  initReviews();
  initRegistration();

  try {
    const data = await fetchMenuData();
    buildCatalog(data);
  } catch (e) {
    document.getElementById("menuGrid").innerHTML =
      '<p class="error">Failed to load menu. Please try again later.</p>';
  }

  const savedUser = localStorage.getItem("greenRootUser");
  if (savedUser) {
    updateNutritionistSection(JSON.parse(savedUser));
  }

  updateReviewInputVisibility();
});

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

function renderItems(items) {
  const grid = document.getElementById("menuGrid");
  if (!items.length) {
    grid.innerHTML =
      '<p class="no-results">No dishes found. Try a different search.</p>';
    return;
  }
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
        <div class="dish-meta" style="justify-content: center; margin-bottom: 15px;">
          <span class="dish-cal" style="font-weight: 600; color: var(--green-primary); font-size: 0.9rem;">🔥 ${
            item.calories
          } kcal</span>
        </div>
        <div class="dish-tags" style="justify-content: center;">
          ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

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

    renderItems(matches);

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
           <span class="search-price" style="color: var(--text-mid);">🔥 ${
             item.calories
           } kcal</span>
         </div>`
        )
        .join("");
      resultsBox.classList.remove("hidden");
    } else {
      resultsBox.classList.add("hidden");
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-section"))
      resultsBox.classList.add("hidden");
  });
}

function isImagePath(src) {
  return (
    src &&
    (src.includes("/") ||
      src.endsWith(".jpg") ||
      src.endsWith(".png") ||
      src.endsWith(".webp"))
  );
}

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
          <div class="dish-tags" style="margin-bottom:25px; justify-content: center;">
            ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <div style="text-align: center;">
            <button class="btn-primary"
                    onclick="event.stopPropagation(); this.closest('.modal-flip-container').classList.toggle('flipped')">
              📖 Read Recipe
            </button>
          </div>
          <div class="flip-hint">or click anywhere to flip</div>
        </div>

        <div class="modal-back">
          <div class="modal-icon" style="font-size: 3rem; margin-bottom: 0;">👨‍🍳</div>
          <div class="modal-cat">Recipe</div>
          <h2 class="modal-title" style="margin-bottom: 20px;">${item.name}</h2>
          <p class="modal-desc" style="font-size: 1rem; padding: 0 15px;">${recipeText}</p>
          <div style="text-align: center; margin-top: 30px;">
            <button class="btn-primary"
                    style="background: var(--green-pale); color: var(--green-primary);"
                    onclick="event.stopPropagation(); this.closest('.modal-flip-container').classList.toggle('flipped')">
              ← Back to Details
            </button>
          </div>
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

window.secretsUnlocked = false;

window.unlockSecrets = function () {
  if (window.secretsUnlocked) return;
  window.secretsUnlocked = true;

  MENU_DATA.categories.push(SECRET_MENU_DATA);

  const secretItems = SECRET_MENU_DATA.items.map((item) => ({
    ...item,
    categoryId: SECRET_MENU_DATA.id,
    categoryName: SECRET_MENU_DATA.name,
  }));
  allItems = [...allItems, ...secretItems];

  buildCategoryTabs(MENU_DATA.categories);

  document.getElementById("modalContent").innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-size: 4rem; margin-bottom: 10px;">🏆</div>
      <h2 style="font-family: 'Playfair Display', serif; color: var(--green-primary); margin-bottom: 15px;">Секрет Розблоковано!</h2>
      <p style="color: var(--text-mid); margin-bottom: 25px; line-height: 1.6;">
        Вітаємо! Ваша спритність у грі відкрила доступ до <strong>ексклюзивних секретних рецептів</strong>!
      </p>
      <button class="btn-primary" onclick="
        closeModal();
        document.getElementById('menu').scrollIntoView({behavior: 'smooth'});
        setTimeout(() => document.querySelector('.cat-tab[data-cat=\\'secrets\\']').click(), 400);
      ">
        Переглянути рецепти
      </button>
    </div>
  `;
  document.getElementById("modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

function openRegModal() {
  document.getElementById("regModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeRegModal() {
  document.getElementById("regModal").classList.add("hidden");
  document.body.style.overflow = "";
}

function initRegistration() {
  ["openRegBtn", "mainRegBtn"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openRegModal);
  });

  const closeBtn = document.getElementById("closeRegModal");
  const overlay = document.getElementById("regModalOverlay");
  if (closeBtn) closeBtn.addEventListener("click", closeRegModal);
  if (overlay) overlay.addEventListener("click", closeRegModal);

  const submitBtn = document.getElementById("regSubmitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const name = document.getElementById("regName").value.trim();
      const weight = document.getElementById("regWeight").value.trim();
      const goal = document.getElementById("regGoal").value;
      const errEl = document.getElementById("regError");

      if (!name || !weight) {
        errEl.style.display = "block";
        return;
      }
      errEl.style.display = "none";

      const userData = { name, weight, goal };
      localStorage.setItem("greenRootUser", JSON.stringify(userData));

      closeRegModal();
      updateNutritionistSection(userData);
      updateReviewInputVisibility();
      setTimeout(() => {
        document
          .getElementById("nutritionist")
          .scrollIntoView({ behavior: "smooth" });
      }, 300);
    });
  }

  const resetBtn = document.getElementById("resetUserBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const savedUser = JSON.parse(localStorage.getItem("greenRootUser"));
      if (savedUser) {
        document.getElementById("regName").value = savedUser.name;
        document.getElementById("regWeight").value = savedUser.weight;
        document.getElementById("regGoal").value = savedUser.goal;
      }
      openRegModal();
    });
  }
}

function getRecommendations(goal) {
  const items = MENU_DATA.categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryName: cat.name }))
  );

  let filtered;
  if (goal === "gain") {
    filtered = items.filter(
      (item) => item.tags.includes("high-protein") || item.calories >= 400
    );
  } else if (goal === "lose") {
    filtered = items.filter(
      (item) => item.calories < 300 || item.tags.includes("detox")
    );
  } else {
    filtered = items.filter(
      (item) => item.calories >= 300 && item.calories <= 450
    );
  }

  return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
}

function updateNutritionistSection(user) {
  document.getElementById("nutriGuest").classList.add("hidden");
  document.getElementById("nutriPersonal").classList.remove("hidden");

  document.getElementById("userNameDisplay").textContent = user.name + "'s";

  const navUser = document.querySelector(".nav-user");
  if (navUser) {
    navUser.innerHTML = `<span style="font-weight: 600; color: var(--green-primary); font-size: 0.95rem;">👋 Привіт, ${user.name}</span>`;
  }

  updateReviewInputVisibility();

  const goalLabels = {
    gain: "gaining muscle mass 🏋️",
    lose: "losing weight 🥗",
    balance: "maintaining balance 🏃",
  };
  document.getElementById("personalAdvice").textContent = `${
    user.name
  }, based on your weight (${user.weight} kg), here are the best dishes for ${
    goalLabels[user.goal]
  }:`;

  const recommendations = getRecommendations(user.goal);
  const dishesEl = document.getElementById("recommendedDishes");

  if (!recommendations.length) {
    dishesEl.innerHTML = "<p>No matching dishes found.</p>";
    return;
  }

  dishesEl.innerHTML = recommendations
    .map(
      (item) => `
    <div onclick="openModal('${item.id}')"
         style="display:flex; align-items:center; gap:14px; background:white; padding:14px 16px;
                border-radius:14px; border-left:4px solid var(--green-primary);
                box-shadow:0 2px 12px rgba(0,0,0,0.07); cursor:pointer;
                transition: transform 0.2s, box-shadow 0.2s;"
         onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)'"
         onmouseout="this.style.transform='';this.style.boxShadow='0 2px 12px rgba(0,0,0,0.07)'">
      <div style="font-size:2rem; min-width:44px; text-align:center;">
        ${
          isImagePath(item.image)
            ? `<img src="${item.image}" alt="${item.name}" style="width:44px;height:44px;border-radius:10px;object-fit:cover;">`
            : item.image
        }
      </div>
      <div style="flex:1;">
        <div style="font-weight:700; font-size:0.95rem; color:#2b3a2e;">${
          item.name
        }</div>
        <div style="font-size:0.82rem; color:#777; margin-top:2px;">${
          item.categoryName
        }</div>
      </div>
      <div style="text-align:right; white-space:nowrap;">
        <div style="font-weight:700; color:var(--green-primary);">🔥 ${
          item.calories
        } kcal</div>
        <div style="font-size:0.8rem; color:#888;">💪 ${
          item.protein
        } protein</div>
      </div>
    </div>
  `
    )
    .join("");

  const avgCal = Math.round(
    recommendations.reduce((s, i) => s + i.calories, 0) / recommendations.length
  );
  const avgProt =
    recommendations.reduce((s, i) => s + parseInt(i.protein), 0) /
    recommendations.length;
  const avgFat =
    recommendations.reduce((s, i) => s + parseInt(i.fat), 0) /
    recommendations.length;

  document.getElementById("statCalories").textContent = avgCal;
  document.getElementById("statProtein").textContent =
    Math.round(avgProt) + "g";
  document.getElementById("statFat").textContent = Math.round(avgFat) + "g";
}

function initGreeting() {
  function greet(name) {
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

  document.getElementById("footerGreetBtn").addEventListener("click", () => {
    greet(document.getElementById("footerName").value.trim());
  });
  document.getElementById("footerName").addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      greet(document.getElementById("footerName").value.trim());
  });
}

function initHamburger() {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("nav-links");
  btn.addEventListener("click", () => {
    links.classList.toggle("open");
    btn.classList.toggle("active");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.classList.remove("active");
    })
  );
}

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
  document
    .querySelectorAll("#hero .reveal")
    .forEach((el) => el.classList.add("visible"));
}

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
    span.addEventListener("mouseover", (e) =>
      highlightStars(parseInt(e.target.dataset.val))
    );
    span.addEventListener("mouseout", () => highlightStars(currentRating));
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
      let name = "Guest";
      const savedUser = localStorage.getItem("greenRootUser");

      if (savedUser) {
        name = JSON.parse(savedUser).name;
      } else {
        name = document.getElementById("reviewName").value.trim() || "Guest";
      }
      if (!text) {
        alert("Please write a comment!");
        return;
      }
      addReview({ name, text, rating: currentRating, avatar: currentAvatar });
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
  document.querySelectorAll("#starRating span").forEach((span) => {
    span.style.color =
      parseInt(span.dataset.val) <= rating ? "#f5a623" : "#ccc";
  });
}

function addReview(review) {
  reviews.push(review);
  if (reviews.length > 4) reviews.shift();
  localStorage.setItem("nutriReviews", JSON.stringify(reviews));
  renderReviews();
}

function renderReviews() {
  const container = document.getElementById("heroReviews");
  if (!container) return;
  container.innerHTML = "";

  if (!reviews.length) {
    container.innerHTML = `
      <div class="no-reviews-msg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center; z-index: 10;">
        <p style="margin-bottom: 12px; font-weight: 600; color: #2b3a2e;">No comments yet!</p>
        <a href="#reviews-form-section" class="btn-primary" style="font-size: 0.8rem; padding: 10px 20px; display: inline-block; text-decoration: none;">
          Be the first! 👇
        </a>
      </div>`;
    return;
  }

  reviews.forEach((rev, index) => {
    const card = document.createElement("div");
    card.className = `review-card review-pos-${index + 1}`;
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
function updateReviewInputVisibility() {
  const savedUser = localStorage.getItem("greenRootUser");
  const nameInput = document.getElementById("reviewName");

  if (nameInput) {
    if (savedUser) {
      nameInput.style.display = "none";
    } else {
      nameInput.style.display = "block";
    }
  }
}
