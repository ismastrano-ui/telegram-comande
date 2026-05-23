const kitchenOrdersDiv = document.getElementById("kitchenOrders");
const enableSoundButton = document.getElementById("enableSoundButton");

let soundEnabled = false;
let audioContext = null;
let latestTables = [];

const seenOrders = new Set(
  JSON.parse(localStorage.getItem("kitchenSeenOrders") || "[]")
);

const HIDDEN_CATEGORIES = ["bevande", "birre", "vini", "coperti"];

const DRINK_KEYWORDS = [
  "acqua", "coca", "fanta", "sprite", "chinotto",
  "birra", "vino", "calice", "lete"
];

const FRIED_KEYWORDS = [
  "fritto", "patate", "panelle", "suppl", "spicy",
  "chips", "fiori", "fonduta", "nachos"
];

const DESSERT_KEYWORDS = [
  "tiramis", "cuore caldo", "churros", "semifreddo", "dolce"
];

enableSoundButton?.addEventListener("click", async () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  await audioContext.resume();
  soundEnabled = true;
  playNotificationSound();
  alert("Notifiche attivate 🔔");
});

function playNotificationSound(type = "new") {
  if (!soundEnabled || !audioContext) return;

  const now = audioContext.currentTime;

  function beep(time, frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.22;

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  if (type === "add") {
    beep(now, 720, 0.12);
    beep(now + 0.18, 720, 0.12);
  } else {
    beep(now, 880, 0.14);
    beep(now + 0.2, 1040, 0.16);
  }
}

function saveSeenOrders() {
  const limitedSeenOrders = [...seenOrders].slice(-100);

  localStorage.setItem(
    "kitchenSeenOrders",
    JSON.stringify(limitedSeenOrders)
  );
}

function isTakeawayOrder(table, order) {
  return (
    order.orderMode === "takeaway" ||
    table.orderMode === "takeaway" ||
    String(table.tableNumber || table.id || "").startsWith("ASPORTO")
  );
}

function getCustomerName(table, order) {
  return order.customerName || table.customerName || "";
}

function getPickupTime(table, order) {
  return order.pickupTime || table.pickupTime || "";
}

function isHiddenItem(item) {
  const category = String(item.category || "").toLowerCase().trim();
  const name = String(item.name || "").toLowerCase().trim();

  if (HIDDEN_CATEGORIES.includes(category)) return true;
  if (name.includes("coperto")) return true;

  return DRINK_KEYWORDS.some(keyword => name.includes(keyword));
}

function isFried(item) {
  const name = String(item.name || "").toLowerCase();
  return FRIED_KEYWORDS.some(keyword => name.includes(keyword));
}

function isDessert(item) {
  const name = String(item.name || "").toLowerCase();
  return DESSERT_KEYWORDS.some(keyword => name.includes(keyword));
}

function getCoperti(table) {
  let total = 0;

  (table.orders || []).forEach(order => {
    (order.items || []).forEach(item => {
      const name = String(item.name || "").toLowerCase();
      if (name.includes("coperto")) {
        total += Number(item.quantity || 0);
      }
    });
  });

  return total;
}

function getMinutes(createdAt) {
  if (!createdAt) return 0;
  return Math.max(0, Math.floor((new Date() - new Date(createdAt)) / 60000));
}

function timerClass(minutes) {
  if (minutes >= 20) return "timer-red";
  if (minutes >= 10) return "timer-yellow";
  return "timer-green";
}

function formatModification(text) {
  if (!text) return "";

  return String(text)
    .split("\n")
    .filter(Boolean)
    .map(line => {
      const clean = line
        .replace("+", "")
        .replace(/€\d+([.,]\d+)?/g, "")
        .trim()
        .toUpperCase();

      return `<span class="extra-badge">${clean}</span>`;
    })
    .join("");
}

function renderSection(title, emoji, items) {
  if (items.length === 0) return "";

  return `
    <div class="kitchen-section">
      <h3>${emoji} ${title}</h3>

      ${items.map(item => `
        <div class="kitchen-item">
          <strong>${item.quantity}x ${item.name}</strong>
          ${item.modification ? `
            <div class="kitchen-note">
              ${formatModification(item.modification)}
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function buildKitchenItems(items) {
  const visibleItems = (items || []).filter(item => !isHiddenItem(item));

  const fritti = visibleItems.filter(isFried);
  const dolci = visibleItems.filter(isDessert);
  const pizze = visibleItems.filter(item => !isFried(item) && !isDessert(item));

  return `
    ${renderSection("Fritti", "🍟", fritti)}
    ${renderSection("Pizze", "🍕", pizze)}
    ${renderSection("Dolci", "🍰", dolci)}
  `;
}

function renderKitchen() {
  kitchenOrdersDiv.innerHTML = "";

  const tableCards = [];

  latestTables.forEach(table => {
    const orders = table.orders || [];

    const pendingOrders = orders
      .map((order, orderIndex) => ({
        order,
        orderIndex,
        key: `${table.id}-${orderIndex}-${order.createdAt}-${order.modifiedAt || ""}`
      }))
      .filter(data => {
        if (data.order.kitchenDone) return false;

        const visibleItems = (data.order.items || [])
          .filter(item => !isHiddenItem(item));

        return visibleItems.length > 0;
      });

    if (pendingOrders.length === 0) return;

    const allVisibleItems = [];
    let hasAddition = false;

    pendingOrders.forEach(data => {
      const order = data.order;

      if (order.type === "add") {
        hasAddition = true;
      }

      (order.items || [])
        .filter(item => !isHiddenItem(item))
        .forEach(item => {
          allVisibleItems.push({
            ...item,
            orderType: order.type
          });
        });
    });

    const firstExitItems = allVisibleItems.filter(isFried);

    const pizzaItems = allVisibleItems.filter(item =>
      !isFried(item) && !isDessert(item)
    );

    const dessertItems = allVisibleItems.filter(isDessert);

    const firstOrder = pendingOrders[0].order;

    tableCards.push({
      table,
      pendingOrders,
      firstExitItems,
      pizzaItems,
      dessertItems,
      hasAddition,
      isNew: pendingOrders.some(data => !seenOrders.has(data.key)),
      minutes: getMinutes(firstOrder.createdAt),
      firstOrder
    });
  });

  tableCards.sort((a, b) => {
    if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
    return a.minutes - b.minutes;
  });

  if (tableCards.length === 0) {
    kitchenOrdersDiv.innerHTML = "Nessuna comanda pizzeria attiva";
    return;
  }

  tableCards.forEach(cardData => {
    const {
      table,
      pendingOrders,
      firstExitItems,
      pizzaItems,
      dessertItems,
      hasAddition,
      isNew,
      minutes,
      firstOrder
    } = cardData;

    const takeaway = isTakeawayOrder(table, firstOrder);
    const customerName = getCustomerName(table, firstOrder);
    const pickupTime = getPickupTime(table, firstOrder);
    const coperti = getCoperti(table);

    const firstExitDone = table.firstExitDone === true;

    const card = document.createElement("div");

    card.className = `
      kitchen-card
      grouped-kitchen-card
      ${isNew ? "new-order" : ""}
      ${takeaway ? "takeaway-order" : ""}
    `;

    card.innerHTML = `
      <div class="kitchen-compact-header">
        <div class="kitchen-main-info">
          <strong>
            ${takeaway ? "🥡 ASPORTO" : `🪑 ${table.tableNumber || table.id}`}
          </strong>

          ${!takeaway && coperti > 0 ? `<span>👥 ${coperti}</span>` : ""}

          ${takeaway && customerName ? `<span>👤 ${customerName}</span>` : ""}

          ${takeaway && pickupTime ? `<span>🕒 ${pickupTime}</span>` : ""}

          ${hasAddition ? `<span class="addition-inline-badge">➕ AGGIUNTA</span>` : ""}

          <span class="order-type-badge">
            ${pendingOrders.length} blocchi
          </span>
        </div>

        <div class="kitchen-timer ${timerClass(minutes)}">
          ⏱ ${minutes}m
        </div>
      </div>

      ${
        firstExitItems.length > 0
          ? `
            <div class="kitchen-section first-exit-section">
              <div class="section-title-row">
                <h3>🍟 PRIMA USCITA</h3>

                <button
                  class="first-exit-check ${firstExitDone ? "checked" : ""}"
                  onclick="markTableFirstExitDone('${table.id}')"
                >
                  ${firstExitDone ? "✅" : "☑️"}
                </button>
              </div>

              ${firstExitItems.map(item => `
                <div class="kitchen-item first-exit-item ${item.orderType === "add" ? "item-added" : ""}">
                  <strong>${item.quantity}x ${item.name}</strong>
                  ${item.orderType === "add" ? `<span class="small-addition-badge">aggiunta</span>` : ""}
                  ${item.modification ? `
                    <div class="kitchen-note">
                      ${formatModification(item.modification)}
                    </div>
                  ` : ""}
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

      ${
        pizzaItems.length > 0
          ? `
            <div class="kitchen-section">
              <h3>🍕 PIZZE</h3>

              ${pizzaItems.map(item => `
                <div class="kitchen-item ${item.orderType === "add" ? "item-added" : ""}">
                  <strong>${item.quantity}x ${item.name}</strong>
                  ${item.orderType === "add" ? `<span class="small-addition-badge">aggiunta</span>` : ""}
                  ${item.modification ? `
                    <div class="kitchen-note">
                      ${formatModification(item.modification)}
                    </div>
                  ` : ""}
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

      ${
        dessertItems.length > 0
          ? `
            <div class="kitchen-section">
              <h3>🍰 DOLCI</h3>

              ${dessertItems.map(item => `
                <div class="kitchen-item ${item.orderType === "add" ? "item-added" : ""}">
                  <strong>${item.quantity}x ${item.name}</strong>
                  ${item.orderType === "add" ? `<span class="small-addition-badge">aggiunta</span>` : ""}
                  ${item.modification ? `
                    <div class="kitchen-note">
                      ${formatModification(item.modification)}
                    </div>
                  ` : ""}
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

      <button
        class="done-button"
        onclick="markWholeTableKitchenDone('${table.id}')"
      >
        ✅ Comanda evasa
      </button>
    `;

    card.onclick = () => {
      pendingOrders.forEach(data => {
        seenOrders.add(data.key);
      });

      saveSeenOrders();
      card.classList.remove("new-order");
    };

    kitchenOrdersDiv.appendChild(card);
  });
}
async function markTableFirstExitDone(tableId) {
  const tableRef = db.collection("tables").doc(tableId);
  const doc = await tableRef.get();

  if (!doc.exists) return;

  await tableRef.update({
    firstExitDone: true,
    firstExitDoneAt: new Date().toISOString()
  });
}

async function markWholeTableKitchenDone(tableId) {
  const confirmDone = confirm("Segnare tutta la comanda come evasa?");
  if (!confirmDone) return;

  const tableRef = db.collection("tables").doc(tableId);
  const doc = await tableRef.get();

  if (!doc.exists) return;

  const table = doc.data();
  const orders = table.orders || [];

  const updatedOrders = orders.map(order => ({
    ...order,
    kitchenDone: true,
    kitchenDoneAt: new Date().toISOString()
  }));

  await tableRef.update({
    orders: updatedOrders,
    kitchenDoneAt: new Date().toISOString()
  });
}
async function markFirstExitDone(tableId, orderIndex) {
  const tableRef = db.collection("tables").doc(tableId);
  const doc = await tableRef.get();

  if (!doc.exists) return;

  const table = doc.data();
  const orders = table.orders || [];

  if (!orders[orderIndex]) return;

  orders[orderIndex].firstExitDone = true;
  orders[orderIndex].firstExitDoneAt = new Date().toISOString();

  await tableRef.update({ orders });
}

async function markKitchenOrderDone(tableId, orderIndex) {
  const confirmDone = confirm("Segnare questa comanda come evasa?");
  if (!confirmDone) return;

  const tableRef = db.collection("tables").doc(tableId);
  const doc = await tableRef.get();

  if (!doc.exists) return;

  const table = doc.data();
  const orders = table.orders || [];

  if (!orders[orderIndex]) return;

  orders[orderIndex].kitchenDone = true;
  orders[orderIndex].kitchenDoneAt = new Date().toISOString();

  await tableRef.update({ orders });
}

function loadKitchenOrders() {
  db.collection("tables")
    .where("status", "==", "open")
    .onSnapshot(snapshot => {
      const previousKeys = new Set(
        latestTables.flatMap(table =>
          (table.orders || []).map((order, index) =>
            `${table.id}-${index}-${order.createdAt}-${order.modifiedAt || ""}`
          )
        )
      );

      latestTables = [];

      snapshot.forEach(doc => {
        latestTables.push({
          id: doc.id,
          ...doc.data()
        });
      });

      latestTables.forEach(table => {
        (table.orders || []).forEach((order, index) => {
          if (order.kitchenDone) return;

          const visibleItems = (order.items || []).filter(item => !isHiddenItem(item));
          if (visibleItems.length === 0) return;

          const key = `${table.id}-${index}-${order.createdAt}-${order.modifiedAt || ""}`;

          if (!previousKeys.has(key) && !seenOrders.has(key)) {
            playNotificationSound(
              order.type === "add" ? "add" : "new"
            );
          }
        });
      });

      renderKitchen();
    });
}

loadKitchenOrders();

setInterval(renderKitchen, 60000);