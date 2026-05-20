const waiterCodes = {
  "1111": "Marco",
  "2222": "Luca",
  "3333": "Admin",
  "4444": "Isma"
};

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
    { name: "Sprite 33cl", price: 2.50 }
  ]
};

const cart = [];
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

function showMainApp() {
  loginScreen.style.display = "none";
  mainApp.style.display = "block";

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
  const code = accessCodeInput.value.trim();

  if (!waiterCodes[code]) {
    alert("Codice non valido");
    return;
  }

  loggedWaiter = waiterCodes[code];
  localStorage.setItem("loggedWaiter", loggedWaiter);
  showMainApp();
});

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
    const button = document.createElement("button");
    button.textContent = category;

    button.onclick = () => {
      currentCategory = category;
      searchInput.value = "";
      searchQuery = "";
      renderMenu();
    };

    categoriesDiv.appendChild(button);
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
    row.className = "menu-item";

    const info = document.createElement("span");
    info.innerHTML = `
      ${item.name}<br>
      <small>${item.category}</small><br>
      <strong>€${item.price.toFixed(2)}</strong>
    `;

    const button = document.createElement("button");
    button.textContent = "➕";
    button.onclick = () => addToCart(item.name, item.price, item.category);

    row.appendChild(info);
    row.appendChild(button);
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

  if (item.quantity > 1) {
    const applyAll = confirm(
      `Questo prodotto ha quantità ${item.quantity}.\n\nVuoi applicare l'extra a tutti i pezzi?\n\nOK = a tutti\nAnnulla = solo a 1 pezzo`
    );

    if (!applyAll) {
      item.quantity -= 1;

      cart.push({
        name: item.name,
        basePrice: item.basePrice || item.price,
        price: item.basePrice || item.price,
        category: item.category,
        quantity: 1,
        modification: item.modification || "",
        extras: []
      });

      renderCart();
      addExtra(cart.length - 1);
      return;
    }
  }

  const extraName = prompt("Nome extra / aggiunta", "Bufala");

  if (!extraName) return;

  const extraPriceRaw = prompt(`Prezzo extra "${extraName}"`, "2");

  if (extraPriceRaw === null) return;

  const extraPrice = Number(String(extraPriceRaw).replace(",", "."));

  if (isNaN(extraPrice)) {
    alert("Prezzo non valido");
    return;
  }

  if (!item.extras) {
    item.extras = [];
  }

  item.extras.push({
    name: extraName.trim(),
    price: extraPrice
  });

  item.price = Number(item.price || 0) + extraPrice;

  renderCart();
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
  if (!item.extras || item.extras.length === 0) return "";

  return item.extras
    .map((extra, extraIndex) => {
      return `<br><em>➕ ${extra.name} €${Number(extra.price || 0).toFixed(2)}
        <button onclick="removeExtra(${itemIndex}, ${extraIndex})" style="padding:4px 6px;font-size:12px;">x</button>
      </em>`;
    })
    .join("");
}

function buildCombinedModification(item) {
  const parts = [];

  if (item.extras && item.extras.length > 0) {
    item.extras.forEach(extra => {
      parts.push(`+ ${extra.name} €${Number(extra.price || 0).toFixed(2)}`);
    });
  }

  if (item.modification) {
    parts.push(item.modification);
  }

  return parts.join("\n");
}

function updateSmartBar(total = 0, totalItems = 0) {
  const table = document.getElementById("tableNumber").value || "-";
  const mode = orderType === "add" ? "Aggiunta" : "Nuova";

  smartBarInfo.innerHTML = `
    🪑 Tavolo ${table} · ${mode}<br>
    🛒 ${totalItems} articoli | €${total.toFixed(2)}
  `;
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

    const extrasText = getExtrasText(item, index);

    const modificationText = item.modification
      ? `<br><em>✏️ ${item.modification}</em>`
      : "";

    cartDiv.innerHTML += `
      <div class="menu-item">
        <span>
          ${item.name} x${item.quantity}<br>
          <small>${item.category}</small><br>
          <small>Prezzo unitario: €${Number(item.price || 0).toFixed(2)}</small><br>
          <strong>€${lineTotal.toFixed(2)}</strong>
          ${extrasText}
          ${modificationText}
        </span>

        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button onclick="decreaseItem(${index})">➖</button>
          <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.basePrice || item.price}, '${item.category.replace(/'/g, "\\'")}')">➕</button>
          <button onclick="addExtra(${index})">➕ Extra</button>
          <button onclick="editModification(${index})">✏️</button>
          <button onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>
    `;
  });

  cartDiv.innerHTML += `<hr><strong>Totale carrello: €${total.toFixed(2)}</strong>`;
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

    const tableCard = document.createElement("div");
    tableCard.className = "menu-item";

    tableCard.innerHTML = `
      <span>
        🔴 Tavolo ${table.tableNumber}
        ${coperti > 0 ? `— 👥 ${coperti}` : ""}<br>
        👤 ${waiter}<br>
        <strong>€${Number(table.total || 0).toFixed(2)}</strong><br>
        <small>⏱️ aperto da ${getElapsedTime(table.openedAt)}</small>
      </span>

      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button onclick="selectTable('${table.tableNumber}')">➕ Aggiunta</button>
        <button onclick="showTableHistory('${table.tableNumber}')">📜 Storico</button>
        <button onclick="editTable('${table.tableNumber}')">✏️ Modifica</button>
        <button onclick="closeTable('${table.tableNumber}')">💰 Chiudi</button>
      </div>
    `;

    openTablesDiv.appendChild(tableCard);
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
  const tableRef = db.collection("tables").doc(tableNumber);
  const doc = await tableRef.get();

  if (!doc.exists) {
    alert("Tavolo non trovato");
    return;
  }

  const table = doc.data();
  const orders = table.orders || [];

  if (orders.length === 0) {
    alert("Nessun ordine da modificare");
    return;
  }

  const selected = prompt(buildEditableTableText(tableNumber, table));

  if (!selected) return;

  const parts = selected.split("-");

  if (parts.length !== 2) {
    alert("Formato non valido. Esempio corretto: 0-1");
    return;
  }

  const orderIndex = Number(parts[0]);
  const itemIndex = Number(parts[1]);

  if (
    isNaN(orderIndex) ||
    isNaN(itemIndex) ||
    !orders[orderIndex] ||
    !orders[orderIndex].items ||
    !orders[orderIndex].items[itemIndex]
  ) {
    alert("Riga non trovata");
    return;
  }

  const item = orders[orderIndex].items[itemIndex];

  const action = prompt(
    `Modifica: ${item.quantity} x ${item.name}\n\n` +
    `1 = Aumenta quantità\n` +
    `2 = Diminuisci quantità\n` +
    `3 = Elimina prodotto\n` +
    `4 = Aggiungi extra/prezzo\n` +
    `5 = Modifica nota\n\n` +
    `Scrivi il numero dell'azione:`
  );

  if (!action) return;

  if (action === "1") {
    item.quantity = Number(item.quantity || 0) + 1;
  }

  else if (action === "2") {
    item.quantity = Number(item.quantity || 0) - 1;

    if (item.quantity <= 0) {
      const confirmDelete = confirm("Quantità arrivata a zero. Eliminare prodotto?");
      if (confirmDelete) {
        orders[orderIndex].items.splice(itemIndex, 1);
      } else {
        item.quantity = 1;
      }
    }
  }

  else if (action === "3") {
    const confirmDelete = confirm(`Eliminare ${item.name} dalla comanda?`);
    if (!confirmDelete) return;

    orders[orderIndex].items.splice(itemIndex, 1);
  }

  else if (action === "4") {
    const extraName = prompt("Nome extra / aggiunta", "Bufala");
    if (!extraName) return;

    const extraPriceRaw = prompt(`Prezzo extra "${extraName}"`, "2");
    if (extraPriceRaw === null) return;

    const extraPrice = Number(String(extraPriceRaw).replace(",", "."));

    if (isNaN(extraPrice)) {
      alert("Prezzo non valido");
      return;
    }

    item.price = Number(item.price || 0) + extraPrice;

    const extraText = `+ ${extraName.trim()} €${extraPrice.toFixed(2)}`;

    if (item.modification) {
      item.modification += `\n${extraText}`;
    } else {
      item.modification = extraText;
    }
  }

  else if (action === "5") {
    const newNote = prompt("Nuova nota prodotto", item.modification || "");

    if (newNote !== null) {
      item.modification = newNote.trim();
    }
  }

  else {
    alert("Azione non valida");
    return;
  }

  orders[orderIndex].items = (orders[orderIndex].items || []).filter(item => {
    return Number(item.quantity || 0) > 0;
  });

  orders[orderIndex].total = recalculateOrderTotal(orders[orderIndex]);
  orders[orderIndex].kitchenDone = false;
  orders[orderIndex].modifiedAt = new Date().toISOString();
  orders[orderIndex].modifiedBy = loggedWaiter || "N/D";

  const cleanedOrders = orders.filter(order => {
    return (order.items || []).length > 0;
  });

  const updatedTotal = recalculateTableTotal(cleanedOrders);

  await tableRef.update({
    orders: cleanedOrders,
    total: updatedTotal,
    updatedAt: new Date().toISOString()
  });

  alert("Comanda modificata correttamente ✅");

  loadOpenTables();
  renderTableMap();
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

  const table = document.getElementById("tableNumber").value;
  const notes = document.getElementById("notes").value;

  if (!table) {
    alert("Inserisci il numero del tavolo");
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
      waiter: loggedWaiter
    })
  });

  const result = await response.json();

  if (result.success) {
    const tableRef = db.collection("tables").doc(table);
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
      createdAt: new Date().toISOString(),
      items: cartForSend.map(item => ({ ...item })),
      notes: notes,
      total: total,
      kitchenDone: false
    };

    const updatedOrders = [...existingOrders, newOrder];

    const updatedTotal = updatedOrders.reduce((sum, order) => {
      return sum + Number(order.total || 0);
    }, 0);

    await tableRef.set({
      tableNumber: table,
      openedAt: openedAt,
      updatedAt: new Date().toISOString(),
      orders: updatedOrders,
      total: updatedTotal,
      status: "open"
    });

    alert("Ordine inviato correttamente ✅");

    cart.length = 0;
    document.getElementById("notes").value = "";

    if (orderType === "new") {
      document.getElementById("tableNumber").value = "";
    }

    renderCart();
    loadOpenTables();
    renderTableMap();

  } else {
    alert("Errore durante l'invio dell'ordine");
  }
});

setInterval(() => {
  if (loggedWaiter) {
    loadOpenTables();
    renderTableMap();
  }
}, 60000);