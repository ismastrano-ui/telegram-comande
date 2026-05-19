const menu = {
  "Coperti": [
    { name: "Coperto", price: 2.00 }
  ],

  "Pizze Novus": [
    { name: "Margherita", price: 7.00 },
    { name: "Nnamurata", price: 12.50 },
    { name: "Baciata", price: 12.50 },
    { name: "Carbonara", price: 10.50 }
  ],

  "Bevande": [
    { name: "Acqua Naturale", price: 2.50 },
    { name: "Coca-cola 33cl", price: 2.50 },
    { name: "Coca-cola 1L", price: 5.50 }
  ],

  "Birre": [
    { name: "Messina Cristalli", price: 5.00 },
    { name: "Tennent's", price: 6.00 }
  ],

  "Dolci": [
    { name: "Tiramisù", price: 5.00 }
  ]
};

const cart = [];
let currentCategory = "Pizze Novus";
let orderType = "new";

const menuDiv = document.getElementById("menu");
const cartDiv = document.getElementById("cart");
const categoriesDiv = document.querySelector(".categories");
const openTablesDiv = document.getElementById("openTables");

function renderCategories() {
  categoriesDiv.innerHTML = "";

  Object.keys(menu).forEach(category => {
    const button = document.createElement("button");

    button.textContent = category;

    button.onclick = () => {
      currentCategory = category;
      renderMenu();
    };

    categoriesDiv.appendChild(button);
  });
}

function renderMenu() {
  menuDiv.innerHTML = "";

  menu[currentCategory].forEach(item => {
    const row = document.createElement("div");

    row.className = "menu-item";

    row.innerHTML = `
      <span>
        ${item.name}<br>
        <strong>€${item.price.toFixed(2)}</strong>
      </span>

      <button onclick="addToCart('${item.name}', ${item.price})">
        +
      </button>
    `;

    menuDiv.appendChild(row);
  });
}

function addToCart(name, price) {
  const existingItem = cart.find(
    item =>
      item.name === name &&
      !item.modification
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      modification: ""
    });
  }

  renderCart();
}

function editModification(index) {
  const currentModification =
    cart[index].modification || "";

  const newModification = prompt(
    `Inserisci modifica per ${cart[index].name}`,
    currentModification
  );

  if (newModification !== null) {
    cart[index].modification =
      newModification.trim();

    renderCart();
  }
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

function renderCart() {
  if (cart.length === 0) {
    cartDiv.innerHTML =
      "Nessun prodotto inserito";

    return;
  }

  let total = 0;

  cartDiv.innerHTML = "";

  cart.forEach((item, index) => {
    const lineTotal =
      item.price * item.quantity;

    total += lineTotal;

    const modificationText =
      item.modification
        ? `<br><em>Modifica: ${item.modification}</em>`
        : "";

    cartDiv.innerHTML += `
      <div class="menu-item">
        <span>
          ${item.name} x${item.quantity}<br>
          <strong>€${lineTotal.toFixed(2)}</strong>
          ${modificationText}
        </span>

        <div style="display:flex; gap:5px; flex-wrap:wrap;">
          <button onclick="decreaseItem(${index})">-</button>

          <button onclick="addToCart('${item.name}', ${item.price})">
            +
          </button>

          <button onclick="editModification(${index})">
            Modifica
          </button>

          <button onclick="removeItem(${index})">
            x
          </button>
        </div>
      </div>
    `;
  });

  cartDiv.innerHTML += `
    <hr>
    <strong>Totale: €${total.toFixed(2)}</strong>
  `;
}

async function loadOpenTables() {

  openTablesDiv.innerHTML =
    "Caricamento tavoli...";

  const snapshot = await db
    .collection("tables")
    .where("status", "==", "open")
    .get();

  if (snapshot.empty) {

    openTablesDiv.innerHTML =
      "Nessun tavolo aperto";

    return;
  }

  openTablesDiv.innerHTML = "";

  snapshot.forEach(doc => {

    const table = doc.data();

    const tableCard =
      document.createElement("div");

    tableCard.className = "menu-item";

    tableCard.innerHTML = `
      <span>
        🔴 Tavolo ${table.tableNumber}<br>
        <strong>€${table.total.toFixed(2)}</strong>
      </span>

      <div style="display:flex; gap:5px;">
        <button onclick="selectTable('${table.tableNumber}')">
          Apri
        </button>

        <button onclick="closeTable('${table.tableNumber}')">
          Chiudi
        </button>
      </div>
    `;

    openTablesDiv.appendChild(tableCard);
  });
}

function selectTable(tableNumber) {

  document.getElementById("tableNumber").value =
    tableNumber;

  orderType = "add";

  addOrderBtn.classList.add("active");
  newOrderBtn.classList.remove("active");

  alert(`Tavolo ${tableNumber} selezionato`);
}

async function closeTable(tableNumber) {

  const confirmClose = confirm(
    `Chiudere il tavolo ${tableNumber}?`
  );

  if (!confirmClose) return;

  await db
    .collection("tables")
    .doc(tableNumber)
    .update({
      status: "closed"
    });

  loadOpenTables();
}

const newOrderBtn =
  document.getElementById("newOrderBtn");

const addOrderBtn =
  document.getElementById("addOrderBtn");

newOrderBtn.addEventListener("click", () => {

  orderType = "new";

  newOrderBtn.classList.add("active");

  addOrderBtn.classList.remove("active");
});

addOrderBtn.addEventListener("click", () => {

  orderType = "add";

  addOrderBtn.classList.add("active");

  newOrderBtn.classList.remove("active");
});

document
  .getElementById("sendOrder")
  .addEventListener("click", async () => {

    const table =
      document.getElementById("tableNumber").value;

    const notes =
      document.getElementById("notes").value;

    if (!table) {
      alert("Inserisci il numero del tavolo");
      return;
    }

    if (cart.length === 0) {
      alert("Il carrello è vuoto");
      return;
    }

    const total = cart.reduce((sum, item) => {
      return (
        sum +
        item.price * item.quantity
      );
    }, 0);

    const response = await fetch(
      "/send-order",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          table,
          notes,
          cart,
          total,
          orderType
        })
      }
    );

    const result =
      await response.json();

    if (result.success) {

      const tableRef =
        db.collection("tables").doc(table);

      const existingDoc =
        await tableRef.get();

      let existingOrders = [];

      if (existingDoc.exists) {
        existingOrders =
          existingDoc.data().orders || [];
      }

      const newOrder = {
        type: orderType,
        createdAt: new Date().toISOString(),
        items: cart.map(item => ({ ...item })),
        notes: notes,
        total: total
      };

      const updatedOrders = [
        ...existingOrders,
        newOrder
      ];

      const updatedTotal =
        updatedOrders.reduce((sum, order) => {
          return sum + order.total;
        }, 0);

      await tableRef.set({
        tableNumber: table,
        updatedAt: new Date().toISOString(),
        orders: updatedOrders,
        total: updatedTotal,
        status: "open"
      });

      alert(
        "Ordine inviato correttamente ✅"
      );

      cart.length = 0;

      document.getElementById("notes").value =
        "";

      renderCart();

      loadOpenTables();

    } else {

      alert(
        "Errore durante l'invio dell'ordine"
      );
    }
  });

renderCategories();
renderMenu();
renderCart();
loadOpenTables();
