const validPins = [
  "1111",
  "2222",
  "3333",
  "4444"
];

let loggedWaiter = localStorage.getItem("loggedWaiter") || "";

const menu = {
  "⚡ Veloci": [
    { name: "Coperto", price: 2.00 },
    { name: "Margherita", price: 7.00 },
    { name: "Patate fritte", price: 3.00 },
    { name: "Acqua Naturale", price: 2.50 },
    { name: "Acqua Lete", price: 2.50 },
    { name: "Coca-cola 33cl", price: 2.50 },
    { name: "Coca-cola Zero 33cl", price: 2.50 }
  ],

  "Coperti": [
    { name: "Coperto", price: 2.00 }
  ],

  "Stuzzicherie": [
    { name: "Mix Fritto", price: 7.90 },
    { name: "Petali di Patate", price: 4.50 },
    { name: "Panelle", price: 4.50 },
    { name: "Supplì", price: 5.00 },
    { name: "Fiori di zucca", price: 5.00 },
    { name: "Spicy Crunchy", price: 4.50 },
    { name: "Patate fritte", price: 3.00 }
  ],

  "Fondute": [
    { name: "Fonduta classica con nachos", price: 6.50 },
    { name: "Fonduta classica con patatine e spicy crunchy", price: 8.50 },
    { name: "Fonduta pistacchio con nachos", price: 7.00 },
    { name: "Fonduta pistacchio con patatine e spicy crunchy", price: 8.50 },
    { name: "Fonduta funghi e cipolletta con nachos", price: 7.00 },
    { name: "Fonduta funghi e cipolletta con patatine e spicy crunchy", price: 8.50 },
    { name: "Fonduta gorgonzola con nachos", price: 7.00 },
    { name: "Fonduta gorgonzola con patatine e spicy crunchy", price: 8.50 }
  ],

  "Novità": [
    { name: "Micelio", price: 11.50 },
    { name: "Sweet pumpkin", price: 12.00 }
  ],

  "Pizze Novus": [
    { name: "Sinfonia Di Funghi", price: 13.00 },
    { name: "Nerano", price: 11.50 },
    { name: "Nnamurata", price: 12.50 },
    { name: "Baciata", price: 12.50 },
    { name: "Equilibrio", price: 13.00 },
    { name: "Coppa e Miele", price: 12.50 },
    { name: "Carbonara", price: 10.50 },
    { name: "Provola e Patate", price: 12.50 },
    { name: "Autunno In Zucca", price: 12.50 },
    { name: "Bruma", price: 10.50 },
    { name: "HoneyMoon", price: 13.50 },
    { name: "Feelin’ hot", price: 11.50 },
    { name: "Pistacchio 2.0", price: 13.50 }
  ],

  "Evergreen": [
  { name: "Napulè", price: 10.50 },
  { name: "Margherita", price: 7.00 },
  { name: "Rossa", price: 4.50 },
  { name: "Biancaneve", price: 5.00 },
  { name: "Rucoletta", price: 12.50 },
  { name: "Crudo", price: 13.00 },
  { name: "Gorgonzola e Pere", price: 10.50 },
  { name: "Rustica", price: 10.50 },
  { name: "Caliente", price: 10.50 },
  { name: "Pistacchio", price: 11.50 },
  { name: "Marinara", price: 5.50 },
  { name: "Norma", price: 8.50 },
  { name: "Vegetariana", price: 11.50 },
  { name: "Caramellata", price: 10.50 }
],

  "Meneghine": [
    { name: "N.1", price: 5.50 },
    { name: "N.2", price: 6.00 },
    { name: "N.3", price: 6.50 },
    { name: "N.4", price: 6.50 },
    { name: "N.5", price: 6.50 }
  ],

  "Dolci": [
    { name: "Tiramisù", price: 5.00 },
    { name: "Cuore Caldo", price: 6.90 },
    { name: "Churros", price: 5.00 },
    { name: "Churros per 2", price: 8.00 },
    { name: "Semifreddo Amaro del Capo", price: 5.50 }
  ],

  "Vini": [
    { name: "Rallo, Il Principe - bottiglia", price: 15.00 },
    { name: "Rallo, Il Principe - calice", price: 5.00 },
    { name: "Rallo, Carta D'Oro - bottiglia", price: 15.00 },
    { name: "Rallo, Carta D'Oro - calice", price: 5.00 },
    { name: "Purato Nero d'Avola DOC - bottiglia", price: 17.00 },
    { name: "Purato Nero d'Avola DOC - calice", price: 5.00 },
    { name: "Purato Catarratto Pinot Grigio - bottiglia", price: 17.00 },
    { name: "Purato Catarratto Pinot Grigio - calice", price: 5.00 },
    { name: "Funaro Nero d'Avola-Syrah-Merlot", price: 29.00 },
    { name: "Feudo Luparello Nero d'Avola-Syrah", price: 27.00 },
    { name: "Puglisi Altus Etna Rosso DOC", price: 29.00 }
  ],

  "Birre": [
    { name: "Trappe Dubbel", price: 6.50 },
    { name: "Menabrea Gazeuse", price: 4.90 },
    { name: "Menabrea Premium Lager 66cl", price: 7.90 },
    { name: "Menabrea Ambrata 33cl", price: 5.50 },
    { name: "Hop House 33cl", price: 5.90 },
    { name: "Brooklyn Stonewall Inn IPA 33cl", price: 5.50 },
    { name: "FORST 1857 33cl", price: 3.90 },
    { name: "Forst SIXTUS 33cl", price: 5.50 },
    { name: "Carlsberg Pilsner 33cl", price: 3.90 },
    { name: "Kronenbourg Blanc 33cl", price: 3.80 },
    { name: "Grimbergen Blanche 33cl", price: 5.50 },
    { name: "Birra dello Stretto Chiara 33cl", price: 4.00 },
    { name: "Birra dello Stretto Rossa 33cl", price: 5.50 },
    { name: "Spina Messina Cristalli di Sale 20cl", price: 3.50 },
    { name: "Spina Messina Cristalli di Sale 40cl", price: 6.00 },
    { name: "Semedorato 66cl", price: 5.90 }
  ],

"Bevande": [
  { name: "Acqua Naturale", price: 2.50 },
  { name: "Acqua Lete", price: 2.50 },
  { name: "Coca-cola 1L", price: 5.50 },
  { name: "Coca-cola 33cl", price: 2.50 },
  { name: "Coca-cola Zero 1L", price: 5.50 },
  { name: "Coca-cola Zero 33cl", price: 2.50 },
  { name: "Fanta 33cl", price: 2.50 },
  { name: "Chinotto 33cl", price: 3.50 },
  { name: "Sprite 33cl", price: 2.50 },
  { name: "Amaro Unnimaffissu", price: 4.00 },
  { name: "Spina Amara", price: 4.00 },
  { name: "Unicum", price: 4.00 },
  { name: "Caffè", price: 1.50 }
]
};

menu["Tranci"] = [
  ...menu["Novità"],
  ...menu["Pizze Novus"],
  ...menu["Evergreen"]
].map(pizza => ({
  name: `Trancio ${pizza.name}`,
  price: Number((pizza.price / 2).toFixed(2))
}));

const cart = [];
let orderMode = "table";
let currentCategory = "⚡ Veloci";
let orderType = "new";
let searchQuery = "";

const TOTAL_TABLES = 15;

const loginScreen = document.getElementById("loginScreen");
const mainApp = document.getElementById("mainApp");
const loggedUserDiv = document.getElementById("loggedUser");
const accessCodeInput = document.getElementById("accessCode");
const loginButton = document.getElementById("loginButton");

const menuDiv = document.getElementById("menu");
const cartDiv = document.getElementById("cart");
const categoriesDiv = document.querySelector(".categories");
const openTablesDiv = document.getElementById("openTables");
const searchInput = document.getElementById("searchInput");
const tableMapDiv = document.getElementById("tableMap");
const smartBarInfo = document.getElementById("smartBarInfo");
const tableModeButton =
  document.getElementById(
    "tableModeButton"
  );

const takeawayModeButton =
  document.getElementById(
    "takeawayModeButton"
  );

const takeawayCard =
  document.getElementById(
    "takeawayCard"
  );

const customerNameInput =
  document.getElementById(
    "customerName"
  );

const pickupTimeInput =
  document.getElementById(
    "pickupTime"
  );

const tableNumberInput =
  document.getElementById(
    "tableNumber"
  );

async function showMainApp() {
  loginScreen.style.display = "none";
  mainApp.style.display = "block";

  await loadExtras();

  loggedUserDiv.innerHTML = `
    <section class="card">
      👤 Operatore: <strong>${loggedWaiter}</strong>
      <button onclick="logoutWaiter()" style="margin-top:10px;">Esci</button>
    </section>
  `;

  renderCategories();
  renderMenu();
  renderCart();
  loadOpenTables();
  renderTableMap();
}

function logoutWaiter() {
  localStorage.removeItem("loggedWaiter");
  loggedWaiter = "";
  mainApp.style.display = "none";
  loginScreen.style.display = "block";
}

if (loggedWaiter) {
showMainApp();
}

loginButton.addEventListener("click", () => {
  const pin = accessCodeInput.value.trim();
  const waiterName = document.getElementById("waiterName").value.trim();

  if (!validPins.includes(pin)) {
    alert("PIN non valido");
    return;
  }

  if (!waiterName) {
    alert("Inserisci nome operatore");
    return;
  }

  loggedWaiter = waiterName;
  localStorage.setItem("loggedWaiter", loggedWaiter);
  showMainApp();
});
tableModeButton.onclick = () => {

  orderMode = "table";

  tableModeButton.classList.add(
    "active-mode-button"
  );

  takeawayModeButton.classList.remove(
    "active-mode-button"
  );

  takeawayCard.classList.add(
    "hidden"
  );

  tableNumberInput.classList.remove(
    "hidden"
  );
};

takeawayModeButton.onclick = () => {

  orderMode = "takeaway";

  takeawayModeButton.classList.add(
    "active-mode-button"
  );

  tableModeButton.classList.remove(
    "active-mode-button"
  );

  takeawayCard.classList.remove(
    "hidden"
  );

  tableNumberInput.classList.add(
    "hidden"
  );
};

function getElapsedTime(openedAt) {
  if (!openedAt) return "0m";

  const opened = new Date(openedAt);
  const now = new Date();
  const diffMinutes = Math.max(0, Math.floor((now - opened) / 60000));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function getCopertiFromOrders(orders) {
  let coperti = 0;

  (orders || []).forEach(order => {
    (order.items || []).forEach(item => {
      const name = String(item.name || "").toLowerCase();

      if (name.includes("coperto")) {
        coperti += Number(item.quantity || 0);
      }
    });
  });

  return coperti;
}

function recalculateOrderTotal(order) {
  return (order.items || []).reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);
}

function recalculateTableTotal(orders) {
  return (orders || []).reduce((sum, order) => {
    return sum + Number(order.total || 0);
  }, 0);
}

function renderCategories() {
  categoriesDiv.innerHTML = "";

  Object.keys(menu).forEach(category => {
    const section = document.createElement("div");
    section.className = "category-accordion";

    const isActive = currentCategory === category;

    section.innerHTML = `
      <button class="category-header ${isActive ? "active-category-header" : ""}">
        <span>${category}</span>
        <span>${isActive ? "▲" : "▼"}</span>
      </button>
    `;

    section.querySelector("button").onclick = () => {
      currentCategory = category;
      searchInput.value = "";
      searchQuery = "";
      renderCategories();
      renderMenu();
    };

    categoriesDiv.appendChild(section);
  });
}

function getAllProducts() {
  const products = [];

  Object.keys(menu).forEach(category => {
    menu[category].forEach(item => {
      products.push({ ...item, category });
    });
  });

  return products;
}

function renderMenu() {
  menuDiv.innerHTML = "";

  let itemsToShow = [];

  if (searchQuery.trim()) {
    itemsToShow = getAllProducts().filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    itemsToShow = menu[currentCategory].map(item => ({
      ...item,
      category: currentCategory
    }));
  }

  if (itemsToShow.length === 0) {
    menuDiv.innerHTML = "Nessun prodotto trovato";
    return;
  }

  itemsToShow.forEach(item => {
    const row = document.createElement("div");
    row.className = "menu-item compact-product";

    row.innerHTML = `
      <span>
        <strong>${item.name}</strong>
        <small>${item.category}</small>
      </span>

      <div class="product-actions">
        <strong>€${item.price.toFixed(2)}</strong>
        <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.category.replace(/'/g, "\\'")}')">
          ➕
        </button>
      </div>
    `;

    menuDiv.appendChild(row);
  });
}

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderMenu();
});

function addToCart(name, price, category) {
  const existingItem = cart.find(
    item =>
      item.name === name &&
      item.category === category &&
      !item.modification &&
      (!item.extras || item.extras.length === 0)
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      basePrice: price,
      price,
      category,
      quantity: 1,
      modification: "",
      extras: []
    });
  }

  renderCart();
}

function editModification(index) {
  const currentModification = cart[index].modification || "";

  const newModification = prompt(
    `Inserisci nota/modifica per ${cart[index].name}`,
    currentModification
  );

  if (newModification !== null) {
    cart[index].modification = newModification.trim();
    renderCart();
  }
}

function addExtra(index) {
  const item = cart[index];

  if (!item) return;

  const modal = document.getElementById("extrasModal");
  const extrasList = document.getElementById("extrasList");
  const closeButton = document.getElementById("closeExtrasModal");
  const confirmButton = document.getElementById("confirmExtrasButton");

  modal.classList.remove("hidden");
  extrasList.innerHTML = "";
  const searchExtraInput = document.createElement("input");
searchExtraInput.type = "text";
searchExtraInput.placeholder = "Cerca extra...";
searchExtraInput.className = "extra-search-input";

extrasList.appendChild(searchExtraInput);

  let selectedExtras = [];
  let removedIngredients = [];

function renderExtrasOptions(filter = "") {
  const selectedExtraNames =
    selectedExtras.map(e => e.name);

  const removedNames =
    removedIngredients.map(e => e.name);

  extrasList
    .querySelectorAll(".extra-option")
    .forEach(el => el.remove());

  EXTRAS
    .filter(extra =>
      extra.name.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(extra => {
      const div = document.createElement("div");
      div.className = "extra-option";

      if (selectedExtraNames.includes(extra.name)) {
        div.classList.add("selected");
      }

      if (removedNames.includes(extra.name)) {
        div.classList.add("removed");
      }

      div.innerHTML = `
        <div>
          <strong>${extra.name}</strong><br>
          <small>+ €${Number(extra.price || 0).toFixed(2)}</small>
        </div>

        <div class="extra-choice-buttons">
          <button type="button" class="extra-add-btn">
            ➕
          </button>

          <button type="button" class="extra-remove-btn">
            ➖
          </button>
        </div>
      `;

      div.querySelector(".extra-add-btn").onclick = event => {
        event.stopPropagation();

        removedIngredients =
          removedIngredients.filter(e => e.name !== extra.name);

        const selected =
          selectedExtras.find(e => e.name === extra.name);

        if (selected) {
          selectedExtras =
            selectedExtras.filter(e => e.name !== extra.name);
        } else {
          selectedExtras.push(extra);
        }

        renderExtrasOptions(searchExtraInput.value);
      };

      div.querySelector(".extra-remove-btn").onclick = event => {
        event.stopPropagation();

        selectedExtras =
          selectedExtras.filter(e => e.name !== extra.name);

        const removed =
          removedIngredients.find(e => e.name === extra.name);

        if (removed) {
          removedIngredients =
            removedIngredients.filter(e => e.name !== extra.name);
        } else {
          removedIngredients.push(extra);
        }

        renderExtrasOptions(searchExtraInput.value);
      };

      extrasList.appendChild(div);
    });
}

searchExtraInput.addEventListener("input", () => {
  renderExtrasOptions(searchExtraInput.value);
});

renderExtrasOptions();
  closeButton.onclick = () => {
    modal.classList.add("hidden");
  };

confirmButton.onclick = () => {
  if (
    selectedExtras.length === 0 &&
    removedIngredients.length === 0
  ) {
    modal.classList.add("hidden");
    return;
  }

  const extraTotal = selectedExtras.reduce((sum, extra) => {
    return sum + Number(extra.price || 0);
  }, 0);

  const removedToSave = removedIngredients.map(extra => ({
    name: extra.name
  }));

  const applyToAll =
    Number(item.quantity || 1) <= 1
      ? true
      : confirm(`Applicare modifiche a tutte le ${item.quantity} pizze?`);

  if (!applyToAll && Number(item.quantity || 1) > 1) {
    item.quantity = Number(item.quantity || 1) - 1;

    const newItem = {
      ...item,
      quantity: 1,
      price: Number(item.price || 0) + extraTotal,
      extras: [
        ...(item.extras || []),
        ...selectedExtras.map(extra => ({
          name: extra.name,
          price: Number(extra.price || 0)
        }))
      ],
      removedIngredients: [
        ...(item.removedIngredients || []),
        ...removedToSave
      ]
    };

    cart.splice(index + 1, 0, newItem);
  } else {
    if (!item.extras) item.extras = [];
    if (!item.removedIngredients) item.removedIngredients = [];

    selectedExtras.forEach(extra => {
      item.extras.push({
        name: extra.name,
        price: Number(extra.price || 0)
      });
    });

    removedToSave.forEach(extra => {
      item.removedIngredients.push({
        name: extra.name
      });
    });

    item.price = Number(item.price || 0) + extraTotal;
  }

  modal.classList.add("hidden");
  renderCart();
};
}
function removeExtra(itemIndex, extraIndex) {
  const item = cart[itemIndex];

  if (!item || !item.extras || !item.extras[extraIndex]) return;

  const extra = item.extras[extraIndex];

  item.price = Number(item.price || 0) - Number(extra.price || 0);
  item.extras.splice(extraIndex, 1);

  renderCart();
}

function decreaseItem(index) {
  cart[index].quantity -= 1;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function getExtrasText(item, itemIndex) {
  let html = "";

  if (item.extras && item.extras.length > 0) {
    html += item.extras
      .map((extra, extraIndex) => {
        return `<br><em>➕ ${extra.name} €${Number(extra.price || 0).toFixed(2)}
          <button onclick="removeExtra(${itemIndex}, ${extraIndex})" style="padding:4px 6px;font-size:12px;">x</button>
        </em>`;
      })
      .join("");
  }

  if (item.removedIngredients && item.removedIngredients.length > 0) {
    html += item.removedIngredients
      .map(ingredient => {
        return `<br><em class="removed-ingredient">➖ senza ${ingredient.name}</em>`;
      })
      .join("");
  }

  return html;
}

function buildCombinedModification(item) {
  const parts = [];

  if (item.extras && item.extras.length > 0) {
    item.extras.forEach(extra => {
      parts.push(`+ ${extra.name} €${Number(extra.price || 0).toFixed(2)}`);
    });
  }
  if (
  item.removedIngredients &&
  item.removedIngredients.length > 0
) {
  item.removedIngredients.forEach(ingredient => {
    parts.push(`- senza ${ingredient.name}`);
  });
}

  if (item.modification) {
    const cleanNote = String(item.modification)
      .split("\n")
      .filter(line => !line.trim().startsWith("+"))
      .join("\n")
      .trim();

    if (cleanNote) {
      parts.push(cleanNote);
    }
  }

  return parts.join("\n");
}

function updateSmartBar(total = 0, totalItems = 0) {

  const table =
    document.getElementById("tableNumber").value || "-";

  const mode =
    orderType === "add"
      ? "➕ Aggiunta"
      : "🆕 Nuova";

  smartBarInfo.innerHTML = `
    🪑 ${table} · ${mode}<br>
    🛒 ${totalItems} articoli | €${total.toFixed(2)}
  `;

  const mobileInfo =
    document.getElementById("mobileBottomInfo");

  if (mobileInfo) {

    mobileInfo.innerHTML = `
      ${
        orderMode === "takeaway"
          ? "🥡 ASPORTO"
          : `🪑 ${table}`
      }
      · 🛒 ${totalItems}
      · €${total.toFixed(2)}
    `;
  }
}

function renderCart() {
  if (cart.length === 0) {
    cartDiv.innerHTML = "Nessun prodotto inserito";
    updateSmartBar(0, 0);
    return;
  }

  let total = 0;
  let totalItems = 0;
  cartDiv.innerHTML = "";

  cart.forEach((item, index) => {
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
    total += lineTotal;
    totalItems += Number(item.quantity || 0);

    cartDiv.innerHTML += `
      <div class="cart-row">
        <div class="cart-info">
          <strong>${item.quantity}x ${item.name}</strong>
          <small>€${lineTotal.toFixed(2)}</small>
          ${getExtrasText(item, index)}
          ${item.modification ? `<em>✏️ ${item.modification}</em>` : ""}
        </div>

        <div class="cart-actions">
          <button onclick="decreaseItem(${index})">➖</button>
          <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.basePrice || item.price}, '${item.category.replace(/'/g, "\\'")}')">➕</button>
          <button onclick="addExtra(${index})">Extra</button>
          <button onclick="editModification(${index})">✏️</button>
          <button onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>
    `;
  });

  cartDiv.innerHTML += `
    <div class="cart-total">
      Totale: €${total.toFixed(2)}
    </div>
  `;

  updateSmartBar(total, totalItems);
}

async function renderTableMap() {
  if (!tableMapDiv) return;

  tableMapDiv.innerHTML = "";

  const snapshot = await db
    .collection("tables")
    .where("status", "==", "open")
    .get();

  const openTables = {};

  snapshot.forEach(doc => {
    const table = doc.data();
    openTables[String(table.tableNumber)] = table;
  });

  for (let i = 1; i <= TOTAL_TABLES; i++) {
    const tableNumber = String(i);
    const table = openTables[tableNumber];
    const isOpen = Boolean(table);

    const button = document.createElement("button");
    button.className = `table-button ${isOpen ? "table-open" : "table-free"}`;

    button.innerHTML = `
      ${isOpen ? "🔴" : "🟢"} ${i}
      ${isOpen ? `<br><small>${getElapsedTime(table.openedAt)}</small>` : ""}
    `;

    button.onclick = () => {
      document.getElementById("tableNumber").value = tableNumber;

      if (isOpen) {
        orderType = "add";
        addOrderBtn.classList.add("active");
        newOrderBtn.classList.remove("active");
      } else {
  orderType = "new";
  newOrderBtn.classList.add("active");
  addOrderBtn.classList.remove("active");

  const covers = prompt("Quanti coperti?");

  if (covers && Number(covers) > 0) {
    cart.push({
      name: "Coperto",
      basePrice: 2,
      price: 2,
      category: "Coperti",
      quantity: Number(covers),
      modification: "",
      extras: []
    });
  }
}

      renderCart();
    };

    tableMapDiv.appendChild(button);
  }
}

async function loadOpenTables() {
  openTablesDiv.innerHTML = "Caricamento tavoli...";

  const snapshot = await db
    .collection("tables")
    .where("status", "==", "open")
    .get();

  if (snapshot.empty) {
    openTablesDiv.innerHTML = "Nessun tavolo aperto";
    return;
  }

  openTablesDiv.innerHTML = "";

  snapshot.forEach(doc => {
    const table = doc.data();
    const orders = table.orders || [];
    const coperti = getCopertiFromOrders(orders);
    const lastOrder = orders[orders.length - 1];
    const waiter = lastOrder?.waiter || "N/D";

    const isTakeaway =
      table.orderMode === "takeaway" ||
      String(table.tableNumber || "").startsWith("ASPORTO");

    const title = isTakeaway
      ? "🥡 ASPORTO"
      : `🪑 ${table.tableNumber}`;

    const mainName = isTakeaway
      ? (table.customerName || lastOrder?.customerName || "Cliente")
      : waiter;

    const pickupTime = table.pickupTime || lastOrder?.pickupTime || "";

    const card = document.createElement("div");
    card.className = `open-mini-card ${isTakeaway ? "takeaway-mini-card" : ""}`;

    card.innerHTML = `
      <div class="open-mini-main">
        <div>
          <strong>${title}</strong>
          ${!isTakeaway && coperti > 0 ? `<span>👥 ${coperti}</span>` : ""}
          ${isTakeaway && pickupTime ? `<span>🕒 ${pickupTime}</span>` : ""}
        </div>

        <strong class="open-mini-total">
          €${Number(table.total || 0).toFixed(2)}
        </strong>
      </div>

      <div class="open-mini-sub">
        <span>👤 ${mainName}</span>
        <span>⏱️ ${getElapsedTime(table.openedAt)}</span>
      </div>

      <div class="open-mini-actions">
        ${isTakeaway ? "" : `<button onclick="selectTable('${table.tableNumber}')">➕</button>`}
        <button onclick="showTableHistory('${table.tableNumber}')">📜</button>
        <button onclick="editTable('${table.tableNumber}')">✏️</button>
        <button onclick="closeTable('${table.tableNumber}')">💰</button>
      </div>
    `;

    openTablesDiv.appendChild(card);
  });
}

function selectTable(tableNumber) {
  document.getElementById("tableNumber").value = tableNumber;

  orderType = "add";
  addOrderBtn.classList.add("active");
  newOrderBtn.classList.remove("active");

  renderCart();
}

function buildTableSummary(tableNumber, table) {
  const orders = table.orders || [];
  const coperti = getCopertiFromOrders(orders);

  let summary = `TAVOLO ${tableNumber}`;
  if (coperti > 0) summary += ` — ${coperti} coperti`;
  summary += `\n\n`;

  orders.forEach((order, index) => {
    summary += `ORDINE ${index + 1} - ${order.type === "add" ? "Aggiunta" : "Nuova comanda"}\n`;
    summary += `👤 Cameriere: ${order.waiter || "N/D"}\n`;

    (order.items || []).forEach(item => {
      summary += `${item.quantity} x ${item.name} - €${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}\n`;

      if (item.modification) {
        summary += `   ✏️ ${item.modification}\n`;
      }
    });

    if (order.notes) {
      summary += `Note: ${order.notes}\n`;
    }

    summary += `Totale ordine: €${Number(order.total || 0).toFixed(2)}\n\n`;
  });

  summary += `TOTALE FINALE: €${Number(table.total || 0).toFixed(2)}`;

  return summary;
}

async function showTableHistory(tableNumber) {
  const doc = await db.collection("tables").doc(tableNumber).get();

  if (!doc.exists) {
    alert("Tavolo non trovato");
    return;
  }

  alert(buildTableSummary(tableNumber, doc.data()));
}

function buildEditableTableText(tableNumber, table) {
  const orders = table.orders || [];
  let text = `✏️ MODIFICA TAVOLO ${tableNumber}\n\n`;

  orders.forEach((order, orderIndex) => {
    text += `ORDINE ${orderIndex + 1} - ${order.type === "add" ? "Aggiunta" : "Nuova comanda"}\n`;
    text += `👤 ${order.waiter || "N/D"}\n\n`;

    (order.items || []).forEach((item, itemIndex) => {
      text += `[${orderIndex}-${itemIndex}] ${item.quantity} x ${item.name} - €${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}\n`;

      if (item.modification) {
        text += `✏️ ${item.modification}\n`;
      }

      text += "\n";
    });

    text += "--------------------\n\n";
  });

  text += "Scrivi il codice riga da modificare, es. 0-1";

  return text;
}

async function editTable(tableNumber) {

  const modal =
    document.getElementById("editModal");

  const modalTitle =
    document.getElementById("editModalTitle");

  const modalBody =
    document.getElementById("editModalBody");

  const closeButton =
    document.getElementById("closeEditModal");

  modal.classList.remove("hidden");

  modalTitle.innerHTML =
    `✏️ Modifica Tavolo ${tableNumber}`;

  closeButton.onclick = () => {
    modal.classList.add("hidden");
  };

  const tableRef =
    db.collection("tables").doc(tableNumber);

  const doc =
    await tableRef.get();

  if (!doc.exists) {

    modalBody.innerHTML =
      "Tavolo non trovato";

    return;
  }

  const table =
    doc.data();

  const orders =
    table.orders || [];

  if (orders.length === 0) {

    modalBody.innerHTML =
      "Nessuna comanda";

    return;
  }

  modalBody.innerHTML = "";

  orders.forEach((order, orderIndex) => {

    const orderDiv =
      document.createElement("div");

    orderDiv.className =
      "edit-order-block";

    orderDiv.innerHTML = `
      <strong>
        ${
          order.type === "add"
            ? "➕ Aggiunta"
            : "🆕 Nuova comanda"
        }
      </strong>
      <br>
      👤 ${order.waiter || "N/D"}
    `;

    (order.items || []).forEach((item, itemIndex) => {

      const itemDiv =
        document.createElement("div");

      itemDiv.className =
        "edit-item";

      itemDiv.innerHTML = `

        <strong>
          ${item.quantity} x ${item.name}
        </strong>

        <br>

        <small>
          €${(
            Number(item.price || 0) *
            Number(item.quantity || 0)
          ).toFixed(2)}
        </small>

        ${
          item.modification
            ? `
              <br>
              <em>
                ✏️ ${item.modification}
              </em>
            `
            : ""
        }

        <div class="edit-actions">

          <button
            onclick="increaseItemRealtime(
              '${tableNumber}',
              ${orderIndex},
              ${itemIndex}
            )"
          >
            ➕
          </button>

          <button
            onclick="decreaseItemRealtime(
              '${tableNumber}',
              ${orderIndex},
              ${itemIndex}
            )"
          >
            ➖
          </button>

          <button
            onclick="deleteItemRealtime(
              '${tableNumber}',
              ${orderIndex},
              ${itemIndex}
            )"
          >
            🗑️
          </button>

          <button
            onclick="addExtraRealtime(
              '${tableNumber}',
              ${orderIndex},
              ${itemIndex}
            )"
          >
            ➕ Extra
          </button>

          <button
            onclick="editNoteRealtime(
              '${tableNumber}',
              ${orderIndex},
              ${itemIndex}
            )"
          >
            ✏️ Nota
          </button>

        </div>
      `;

      orderDiv.appendChild(itemDiv);
    });

    modalBody.appendChild(orderDiv);
  });
}
async function updateTableAfterEdit(tableNumber, orders) {
  const tableRef = db.collection("tables").doc(tableNumber);

  const cleanedOrders = orders
    .map(order => {
      order.items = (order.items || []).filter(item => Number(item.quantity || 0) > 0);
      order.total = recalculateOrderTotal(order);
      order.kitchenDone = false;
      order.modifiedAt = new Date().toISOString();
      order.modifiedBy = loggedWaiter || "N/D";
      return order;
    })
    .filter(order => (order.items || []).length > 0);

  const updatedTotal = recalculateTableTotal(cleanedOrders);

  await tableRef.update({
    orders: cleanedOrders,
    total: updatedTotal,
    updatedAt: new Date().toISOString()
  });

  loadOpenTables();
  renderTableMap();
  editTable(tableNumber);
}

async function getTableOrders(tableNumber) {
  const tableRef = db.collection("tables").doc(tableNumber);
  const doc = await tableRef.get();

  if (!doc.exists) {
    alert("Tavolo non trovato");
    return null;
  }

  return doc.data().orders || [];
}

async function increaseItemRealtime(tableNumber, orderIndex, itemIndex) {
  const orders = await getTableOrders(tableNumber);
  if (!orders) return;

  orders[orderIndex].items[itemIndex].quantity =
    Number(orders[orderIndex].items[itemIndex].quantity || 0) + 1;

  await updateTableAfterEdit(tableNumber, orders);
}

async function decreaseItemRealtime(tableNumber, orderIndex, itemIndex) {
  const orders = await getTableOrders(tableNumber);
  if (!orders) return;

  const item = orders[orderIndex].items[itemIndex];

  item.quantity = Number(item.quantity || 0) - 1;

  if (item.quantity <= 0) {
    const confirmDelete = confirm("Quantità a zero. Eliminare il prodotto?");
    if (confirmDelete) {
      orders[orderIndex].items.splice(itemIndex, 1);
    } else {
      item.quantity = 1;
    }
  }

  await updateTableAfterEdit(tableNumber, orders);
}

async function deleteItemRealtime(tableNumber, orderIndex, itemIndex) {
  const confirmDelete = confirm("Eliminare questo prodotto?");
  if (!confirmDelete) return;

  const orders = await getTableOrders(tableNumber);
  if (!orders) return;

  orders[orderIndex].items.splice(itemIndex, 1);

  await updateTableAfterEdit(tableNumber, orders);
}

let EXTRAS = [];

async function loadExtras() {

  try {

    const snapshot = await db
      .collection("extras")
      .where("active", "==", true)
      .get();

    EXTRAS = [];

    snapshot.forEach(doc => {

      EXTRAS.push(doc.data());

    });

    console.log("Extra caricati:", EXTRAS);

  } catch (error) {

    console.error(
      "Errore caricamento extra:",
      error
    );
  }
}
async function addExtraRealtime(
  tableNumber,
  orderIndex,
  itemIndex
) {

  const orders =
    await getTableOrders(tableNumber);

  if (!orders) return;

  const item =
    orders[orderIndex].items[itemIndex];

  const modal =
    document.getElementById("extrasModal");

  const extrasList =
    document.getElementById("extrasList");

  const closeButton =
    document.getElementById("closeExtrasModal");

  const confirmButton =
    document.getElementById("confirmExtrasButton");

  modal.classList.remove("hidden");

  extrasList.innerHTML = "";

  let selectedExtras = [];

  EXTRAS.forEach(extra => {

    const div =
      document.createElement("div");

    div.className =
      "extra-option";

    div.innerHTML = `
      <div>
        <strong>${extra.name}</strong>
        <br>
        <small>
          + €${extra.price.toFixed(2)}
        </small>
      </div>
    `;

    div.onclick = () => {

      const alreadySelected =
        selectedExtras.find(
          e => e.name === extra.name
        );

      if (alreadySelected) {

        selectedExtras =
          selectedExtras.filter(
            e => e.name !== extra.name
          );

        div.classList.remove("selected");

      } else {

        selectedExtras.push(extra);

        div.classList.add("selected");
      }
    };

    extrasList.appendChild(div);
  });

  closeButton.onclick = () => {
    modal.classList.add("hidden");
  };

  confirmButton.onclick =
    async () => {

      if (selectedExtras.length === 0) {
        modal.classList.add("hidden");
        return;
      }

      let totalExtraPrice = 0;

      let extraText = "";

      selectedExtras.forEach(extra => {

        totalExtraPrice += extra.price;

        extraText +=
          `+ ${extra.name} €${extra.price.toFixed(2)}\n`;
      });

      item.price =
        Number(item.price || 0)
        + totalExtraPrice;

      if (item.modification) {

        item.modification +=
          "\n" + extraText;

      } else {

        item.modification =
          extraText;
      }

      modal.classList.add("hidden");

      await updateTableAfterEdit(
        tableNumber,
        orders
      );
    };
}

async function editNoteRealtime(tableNumber, orderIndex, itemIndex) {
  const orders = await getTableOrders(tableNumber);
  if (!orders) return;

  const item = orders[orderIndex].items[itemIndex];

  const newNote = prompt("Modifica nota prodotto", item.modification || "");

  if (newNote === null) return;

  item.modification = newNote.trim();

  await updateTableAfterEdit(tableNumber, orders);
}
async function archiveAndCloseTable(tableNumber, table) {
  const closedAt = new Date().toISOString();

  await db.collection("closedTables").add({
    ...table,
    tableNumber: tableNumber,
    status: "closed",
    closedAt: closedAt
  });

  await db.collection("tables").doc(tableNumber).delete();
}

async function closeTable(tableNumber) {
  const doc = await db.collection("tables").doc(tableNumber).get();

  if (!doc.exists) {
    alert("Tavolo non trovato");
    return;
  }

  const table = doc.data();
  const summary = buildTableSummary(tableNumber, table);

  const confirmClose = confirm(
    `${summary}\n\nConfermare chiusura tavolo?`
  );

  if (!confirmClose) return;

  const response = await fetch("/close-table", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      table: tableNumber,
      total: table.total,
      summary
    })
  });

  const result = await response.json();

  if (!result.success) {
    alert("Errore durante l'invio della chiusura alla cassa");
    return;
  }

  await archiveAndCloseTable(tableNumber, table);

  alert(`Tavolo ${tableNumber} chiuso correttamente ✅`);

  loadOpenTables();
  renderTableMap();
}

const newOrderBtn = document.getElementById("newOrderBtn");
const addOrderBtn = document.getElementById("addOrderBtn");

newOrderBtn.addEventListener("click", () => {
  orderType = "new";
  newOrderBtn.classList.add("active");
  addOrderBtn.classList.remove("active");
  renderCart();
});

addOrderBtn.addEventListener("click", () => {
  orderType = "add";
  addOrderBtn.classList.add("active");
  newOrderBtn.classList.remove("active");
  renderCart();
});

document.getElementById("tableNumber").addEventListener("input", () => {
  renderCart();
});


document.getElementById("sendOrder").addEventListener("click", async () => {
  if (!loggedWaiter) {
    alert("Effettua il login");
    return;
  }

  const isTakeaway = orderMode === "takeaway";

  const tableInput = document.getElementById("tableNumber").value.trim();
  const notes = document.getElementById("notes").value;

  const customerName = customerNameInput.value.trim();
  const pickupTime = pickupTimeInput.value;

  let table = isTakeaway ? `ASPORTO-${Date.now()}` : tableInput;

  if (!isTakeaway && !table) {
    alert("Inserisci il numero del tavolo");
    return;
  }

  if (isTakeaway && !customerName) {
    alert("Inserisci il nome cliente");
    return;
  }

  if (cart.length === 0) {
    alert("Il carrello è vuoto");
    return;
  }

  const cartForSend = cart.map(item => ({
    ...item,
    modification: buildCombinedModification(item)
  }));

  const total = cartForSend.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  const response = await fetch("/send-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      table,
      notes,
      cart: cartForSend,
      total,
      orderType,
      waiter: loggedWaiter,
      orderMode,
      customerName: isTakeaway ? customerName : "",
      pickupTime: isTakeaway ? pickupTime : ""
    })
  });

  const result = await response.json();

  if (!result.success) {
    alert("Errore durante l'invio ordine");
    return;
  }

  const tableRef = db.collection("tables").doc(String(table));
  const existingDoc = await tableRef.get();

  let existingOrders = [];
  let openedAt = new Date().toISOString();

  if (existingDoc.exists && existingDoc.data().status === "open") {
    existingOrders = existingDoc.data().orders || [];
    openedAt = existingDoc.data().openedAt || openedAt;
  }

  const newOrder = {
    waiter: loggedWaiter,
    type: orderType,
    orderMode,
    customerName: isTakeaway ? customerName : "",
    pickupTime: isTakeaway ? pickupTime : "",
    createdAt: new Date().toISOString(),
    items: cartForSend.map(item => ({ ...item })),
    notes,
    total,
    kitchenDone: false
  };

  const updatedOrders = [...existingOrders, newOrder];

  const updatedTotal = updatedOrders.reduce((sum, order) => {
    return sum + Number(order.total || 0);
  }, 0);

  await tableRef.set({
    tableNumber: table,
    openedAt,
    updatedAt: new Date().toISOString(),
    orders: updatedOrders,
    total: updatedTotal,
    status: "open",
    orderMode,
    customerName: isTakeaway ? customerName : "",
    pickupTime: isTakeaway ? pickupTime : ""
  });

  alert("Ordine inviato ✅");

  cart.length = 0;
  document.getElementById("notes").value = "";

  if (!isTakeaway && orderType === "new") {
    document.getElementById("tableNumber").value = "";
  }

  if (isTakeaway) {
    customerNameInput.value = "";
    pickupTimeInput.value = "";
  }

  renderCart();
  loadOpenTables();
  renderTableMap();
});
document.getElementById(
  "mobileSendButton"
).onclick = () => {

  document.getElementById(
    "sendOrder"
  ).click();
};
const nativeSearchButton =
  document.getElementById("nativeSearchButton");

nativeSearchButton.onclick = () => {
  searchInput.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  searchInput.focus();
};

const navMenu =
  document.getElementById("navMenu");

const navCart =
  document.getElementById("navCart");

const navTables =
  document.getElementById("navTables");

function setActiveNav(tab) {
  document
    .querySelectorAll(".nav-tab")
    .forEach(btn =>
      btn.classList.remove("active-nav")
    );

  tab.classList.add("active-nav");
}

if (navMenu) {
  navMenu.onclick = () => {
    setActiveNav(navMenu);
    menuDiv.scrollIntoView({ behavior: "smooth" });
  };
}

if (navCart) {
  navCart.onclick = () => {
    setActiveNav(navCart);
    cartDiv.scrollIntoView({ behavior: "smooth" });
  };
}

if (navTables) {
  navTables.onclick = () => {
    setActiveNav(navTables);
    openTablesDiv.scrollIntoView({ behavior: "smooth" });
  };
}