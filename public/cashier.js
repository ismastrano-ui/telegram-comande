const cashierStatsDiv = document.getElementById("cashierStats");
const cashierOpenTablesDiv = document.getElementById("cashierOpenTables");
const cashierClosedTablesDiv = document.getElementById("cashierClosedTables");
const clearDayButton = document.getElementById("clearDayButton");
const refreshButton = document.getElementById("refreshButton");
const backupButton = document.getElementById("backupButton");

function isToday(dateString) {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function formatTime(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

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

function getLastWaiter(table) {
  const orders = table.orders || [];
  const lastOrder = orders[orders.length - 1];

  return lastOrder?.waiter || "N/D";
}

function calculateTheForkDiscount(table) {
  const excludedCategories = [
    "bevande",
    "birre",
    "vini",
    "coperti"
  ];

  const excludedKeywords = [
    "coperto",
    "acqua",
    "coca",
    "fanta",
    "sprite",
    "chinotto",
    "birra",
    "vino",
    "calice",
    "lete",
    "menabrea",
    "messina",
    "forst",
    "carlsberg",
    "kronenbourg",
    "grimbergen",
    "semedorato",
    "rallo",
    "purato",
    "funaro",
    "feudo",
    "etna"
  ];

  let discountableTotal = 0;

  (table.orders || []).forEach(order => {
    (order.items || []).forEach(item => {
      const name = String(item.name || "").toLowerCase();
      const category = String(item.category || "").toLowerCase();

      const excludedByCategory = excludedCategories.includes(category);

      const excludedByName = excludedKeywords.some(keyword =>
        name.includes(keyword)
      );

      if (!excludedByCategory && !excludedByName) {
        discountableTotal +=
          Number(item.price || 0) * Number(item.quantity || 0);
      }
    });
  });

  return discountableTotal * 0.20;
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
      summary += `${item.quantity} x ${item.name} - €${(item.price * item.quantity).toFixed(2)}\n`;

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

async function showOpenDetail(tableNumber) {
  const doc = await db.collection("tables").doc(tableNumber).get();

  if (!doc.exists) {
    alert("Tavolo non trovato");
    return;
  }

  alert(buildTableSummary(tableNumber, doc.data()));
}

async function showClosedDetail(closedId) {
  const doc = await db.collection("closedTables").doc(closedId).get();

  if (!doc.exists) {
    alert("Tavolo chiuso non trovato");
    return;
  }

  const table = doc.data();
  alert(buildTableSummary(table.tableNumber, table));
}

async function closeTableFromCashier(tableNumber) {
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
    alert("Errore durante la chiusura");
    return;
  }

  await db.collection("closedTables").add({
    ...table,
    tableNumber: tableNumber,
    status: "closed",
    closedAt: new Date().toISOString()
  });

  await db.collection("tables").doc(tableNumber).delete();

  alert(`Tavolo ${tableNumber} chiuso ✅`);
}

async function clearTodayClosedTables() {
  const firstConfirm = confirm("Vuoi svuotare i tavoli chiusi di oggi?");
  if (!firstConfirm) return;

  const secondConfirm = confirm("Confermi? L’operazione elimina lo storico chiuso di oggi dalla cassa.");
  if (!secondConfirm) return;

  const snapshot = await db.collection("closedTables").get();
  const batch = db.batch();

  snapshot.forEach(doc => {
    const table = doc.data();

    if (isToday(table.closedAt)) {
      batch.delete(doc.ref);
    }
  });

  await batch.commit();

  alert("Tavoli chiusi di oggi svuotati ✅");
}

clearDayButton.addEventListener("click", clearTodayClosedTables);

refreshButton.addEventListener(
  "click",
  loadCashierData
);

backupButton.addEventListener(
  "click",
  createBackup
);
async function createBackup() {

  const confirmBackup =
    confirm(
      "Creare backup completo dei dati?"
    );

  if (!confirmBackup) return;

  try {

    const openSnapshot =
      await db
        .collection("tables")
        .get();

    const closedSnapshot =
      await db
        .collection("closedTables")
        .get();

    const openTables = [];
    const closedTables = [];

    openSnapshot.forEach(doc => {

      openTables.push({
        id: doc.id,
        ...doc.data()
      });
    });

    closedSnapshot.forEach(doc => {

      closedTables.push({
        id: doc.id,
        ...doc.data()
      });
    });

    await db
      .collection("backups")
      .add({

        createdAt:
          new Date().toISOString(),

        openTables,
        closedTables

      });

    alert(
      "Backup completato ✅"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Errore durante backup"
    );
  }
}
function renderStats(openTables, closedTodayTables) {
  cashierStatsDiv.innerHTML = `
    <div class="cashier-stat-grid">
      <div class="cashier-stat">
        <small>Incasso oggi</small>
        <strong id="revenueValue">••••</strong>
        <button onclick="unlockRevenue()" style="margin-top:6px;">
          🔐 Mostra
        </button>
      </div>

      <div class="cashier-stat">
        <small>Tavoli aperti</small>
        <strong>${openTables.length}</strong>
      </div>

      <div class="cashier-stat">
        <small>Tavoli chiusi</small>
        <strong>${closedTodayTables.length}</strong>
      </div>
    </div>
  `;
}

function renderOpenTables(openTables) {
  cashierOpenTablesDiv.innerHTML = "";

  if (openTables.length === 0) {
    cashierOpenTablesDiv.innerHTML = "Nessun tavolo aperto";
    return;
  }

  openTables.sort((a, b) => Number(a.tableNumber) - Number(b.tableNumber));

  openTables.forEach(table => {
    const orders = table.orders || [];
    const coperti = getCopertiFromOrders(orders);
    const waiter = getLastWaiter(table);

    const card = document.createElement("div");
    card.className = "cashier-table-card open";

    card.innerHTML = `
      <div class="cashier-table-main">
        <div>
          ${
  String(table.tableNumber || "").startsWith("ASPORTO")
    ? `<strong>🥡 ASPORTO</strong>`
    : `<strong>🔴 Tavolo ${table.tableNumber}</strong>`
}

${
  !String(table.tableNumber || "").startsWith("ASPORTO")
    && coperti > 0
      ? `<small>👥 ${coperti} coperti</small>`
      : ""
}

<small>
  👤 ${
    String(table.tableNumber || "").startsWith("ASPORTO")
      ? (table.customerName || "Cliente")
      : waiter
  }
</small>

${
  String(table.tableNumber || "").startsWith("ASPORTO")
    && table.pickupTime
      ? `<small>🕒 ${table.pickupTime}</small>`
      : ""
}

<small>⏱️ ${getElapsedTime(table.openedAt)}</small>
        </div>

        <div class="cashier-total">
          €${Number(table.total || 0).toFixed(2)}
        </div>
      </div>

      <div class="cashier-actions">
        <button onclick="showOpenDetail('${table.tableNumber}')">📜 Dettaglio</button>
        <button onclick="applyTheForkDiscount('${table.tableNumber}')">
  🏷️ -20%
</button>
        <button class="danger" onclick="closeTableFromCashier('${table.tableNumber}')">💰 Chiudi</button>
      </div>
    `;

    cashierOpenTablesDiv.appendChild(card);
  });
}

function renderClosedTables(closedTodayTables) {
  cashierClosedTablesDiv.innerHTML = "";

  if (closedTodayTables.length === 0) {
    cashierClosedTablesDiv.innerHTML = "Nessun tavolo chiuso oggi";
    return;
  }

  closedTodayTables.sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt));

  closedTodayTables.forEach(table => {
    const orders = table.orders || [];
    const coperti = getCopertiFromOrders(orders);
    const waiter = getLastWaiter(table);

    const card = document.createElement("div");
    card.className = "cashier-table-card closed";

    card.innerHTML = `
      <div class="cashier-table-main">
        <div>
          ${
  String(table.tableNumber || "").startsWith("ASPORTO")
    ? `<strong>🥡 ASPORTO</strong>`
    : `<strong>✅ Tavolo ${table.tableNumber}</strong>`
}

${
  !String(table.tableNumber || "").startsWith("ASPORTO")
    && coperti > 0
      ? `<small>👥 ${coperti} coperti</small>`
      : ""
}

<small>
  👤 ${
    String(table.tableNumber || "").startsWith("ASPORTO")
      ? (table.customerName || "Cliente")
      : waiter
  }
</small>

${
  String(table.tableNumber || "").startsWith("ASPORTO")
    && table.pickupTime
      ? `<small>🕒 ${table.pickupTime}</small>`
      : ""
}

<small>🕒 ${formatTime(table.closedAt)}</small>
        </div>

        <div class="cashier-total">
          €${Number(table.total || 0).toFixed(2)}
        </div>
      </div>

      <div class="cashier-actions">
        <button onclick="showClosedDetail('${table.id}')">📜 Dettaglio</button>
      </div>
    `;

    cashierClosedTablesDiv.appendChild(card);
  });
}
function unlockRevenue() {

  const code =
    prompt("Inserisci codice");

  if (code !== "2002") {

    alert("Codice non valido");

    return;
  }

  db.collection("closedTables")
    .get()
    .then(snapshot => {

      let revenueToday = 0;

      snapshot.forEach(doc => {

        const table = doc.data();

        if (isToday(table.closedAt)) {

          revenueToday +=
            Number(table.total || 0);
        }
      });

      const revenueValue =
        document.getElementById(
          "revenueValue"
        );

      if (revenueValue) {

        revenueValue.textContent =
          `€${revenueToday.toFixed(2)}`;
      }
    });
}

async function applyTheForkDiscount(tableNumber) {

  const doc =
    await db
      .collection("tables")
      .doc(tableNumber)
      .get();

  if (!doc.exists) {

    alert("Tavolo non trovato");

    return;
  }

  const table = doc.data();

  if (table.theForkDiscountApplied) {

    alert(
      "Sconto The Fork già applicato"
    );

    return;
  }

  const discount =
    calculateTheForkDiscount(table);

  if (discount <= 0) {

    alert(
      "Nessun prodotto scontabile"
    );

    return;
  }

  const confirmDiscount =
    confirm(
      `Applicare sconto The Fork di €${discount.toFixed(2)} ?`
    );

  if (!confirmDiscount) return;

  const newTotal =
    Math.max(
      0,
      Number(table.total || 0)
      - discount
    );

  await db
    .collection("tables")
    .doc(tableNumber)
    .update({

      total: newTotal,

      theForkDiscountApplied: true,

      theForkDiscountValue:
        discount

    });

  alert(
    `Sconto The Fork applicato ✅\nNuovo totale: €${newTotal.toFixed(2)}`
  );
}

async function loadCashierData() {
  cashierOpenTablesDiv.innerHTML = "Caricamento tavoli aperti...";
  cashierClosedTablesDiv.innerHTML = "Caricamento tavoli chiusi...";

  const openSnapshot = await db.collection("tables")
    .where("status", "==", "open")
    .get();

  const closedSnapshot = await db.collection("closedTables").get();

  const openTables = [];
  const closedTodayTables = [];

  openSnapshot.forEach(doc => {
    openTables.push({
      id: doc.id,
      ...doc.data()
    });
  });

  closedSnapshot.forEach(doc => {
    const table = {
      id: doc.id,
      ...doc.data()
    };

    if (isToday(table.closedAt)) {
      closedTodayTables.push(table);
    }
  });

  renderStats(openTables, closedTodayTables);
  renderOpenTables(openTables);
  renderClosedTables(closedTodayTables);
}

db.collection("tables").onSnapshot(loadCashierData);
db.collection("closedTables").onSnapshot(loadCashierData);

loadCashierData();