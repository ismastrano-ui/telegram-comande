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
  localStorage.setItem("kitchenSeenOrders", JSON.stringify([...seenOrders]));
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

  const cards = [];

  latestTables.forEach(table => {
    const orders = table.orders || [];
    const coperti = getCoperti(table);

    orders.forEach((order, orderIndex) => {
      if (order.kitchenDone) return;

      const visibleItems = (order.items || []).filter(item => !isHiddenItem(item));
      if (visibleItems.length === 0) return;

      const key = `${table.id}-${orderIndex}-${order.createdAt}-${order.modifiedAt || ""}`;
      const isNew = !seenOrders.has(key);
      const minutes = getMinutes(order.createdAt);

      cards.push({
        key,
        table,
        order,
        orderIndex,
        coperti,
        isNew,
        minutes
      });
    });
  });

  cards.sort((a, b) => {
    if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
    if (a.order.type !== b.order.type) return a.order.type === "new" ? -1 : 1;
    return new Date(a.order.createdAt || 0) - new Date(b.order.createdAt || 0);
  });

  if (cards.length === 0) {
    kitchenOrdersDiv.innerHTML = "Nessuna comanda pizzeria attiva";
    return;
  }

  cards.forEach(cardData => {
    const { key, table, order, orderIndex, coperti, isNew, minutes } = cardData;

    const takeaway = isTakeawayOrder(table, order);
    const customerName = getCustomerName(table, order);
    const pickupTime = getPickupTime(table, order);

    const card = document.createElement("div");

    card.className = `
      kitchen-card
      ${isNew ? "new-order" : ""}
      ${order.type === "add" ? "addition-order" : ""}
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

          <span>👨‍🍳 ${order.waiter || "N/D"}</span>

          <span class="order-type-badge">
            ${order.type === "add" ? "➕ AGGIUNTA" : "🆕 NUOVA"}
          </span>
        </div>

        <div class="kitchen-timer ${timerClass(minutes)}">
          ⏱ ${minutes}m
        </div>
      </div>

      ${buildKitchenItems(order.items || [])}

      <button class="done-button">
        ✅ EVASA
      </button>
    `;

    card.onclick = () => {
      seenOrders.add(key);
      saveSeenOrders();
      card.classList.remove("new-order");
    };

    card.querySelector(".done-button").onclick = async event => {
      event.stopPropagation();

      const confirmDone = confirm("Segnare questa comanda come evasa?");
      if (!confirmDone) return;

      const tableRef = db.collection("tables").doc(table.id);
      const doc = await tableRef.get();

      if (!doc.exists) return;

      const freshTable = doc.data();
      const orders = freshTable.orders || [];

      if (!orders[orderIndex]) return;

      orders[orderIndex].kitchenDone = true;
      orders[orderIndex].kitchenDoneAt = new Date().toISOString();

      await tableRef.update({ orders });
    };

    kitchenOrdersDiv.appendChild(card);
  });
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

setInterval(renderKitchen, 30000);