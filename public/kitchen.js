const kitchenOrdersDiv = document.getElementById("kitchenOrders");
const enableSoundButton = document.getElementById("enableSoundButton");

let soundEnabled = false;
let knownOrderKeys = new Set();
let firstLoad = true;

const kitchenCategories = [
  "Stuzzicherie",
  "Fondute",
  "Novità",
  "Pizze Novus",
  "Evergreen",
  "Meneghine",
  "Dolci"
];

enableSoundButton.addEventListener("click", () => {
  soundEnabled = true;
  playNotificationSound();
  alert("Notifiche cucina attivate 🔔");
});

function playNotificationSound() {
  if (!soundEnabled) return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.15;

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
    audioContext.close();
  }, 250);
}

function isKitchenItem(item) {
  if (kitchenCategories.includes(item.category)) {
    return true;
  }

  const name = (item.name || "").toLowerCase();

  if (name.includes("acqua")) return false;
  if (name.includes("coca")) return false;
  if (name.includes("fanta")) return false;
  if (name.includes("sprite")) return false;
  if (name.includes("chinotto")) return false;
  if (name.includes("birra")) return false;
  if (name.includes("vino")) return false;
  if (name.includes("coperto")) return false;

  return true;
}

function formatTime(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderKitchenOrders(tables) {
  kitchenOrdersDiv.innerHTML = "";

  let hasOrders = false;

  tables.forEach(table => {
    const orders = table.orders || [];

    orders.forEach((order, orderIndex) => {
      if (order.kitchenDone) return;

      const kitchenItems = (order.items || []).filter(isKitchenItem);

      if (kitchenItems.length === 0) return;

      hasOrders = true;

      const card = document.createElement("div");
      card.className = "menu-item";

      let itemsHtml = "";

      kitchenItems.forEach(item => {
        itemsHtml += `
          <div style="margin-bottom:10px;">
            <strong>${item.quantity} x ${item.name}</strong>
            ${item.modification ? `<br><em>✏️ ${item.modification}</em>` : ""}
          </div>
        `;
      });

      card.innerHTML = `
        <span>
          <strong>🍽️ Tavolo ${table.tableNumber}</strong><br>
          <small>
            ${order.type === "add" ? "➕ Aggiunta" : "🍕 Nuova comanda"}
            - ${formatTime(order.createdAt)}
          </small>
          <hr>
          ${itemsHtml}
          ${order.notes ? `<br><small>📝 Note: ${order.notes}</small>` : ""}
        </span>

        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button onclick="markKitchenDone('${table.id}', ${orderIndex})">
            ✅ Evasa
          </button>
        </div>
      `;

      kitchenOrdersDiv.appendChild(card);
    });
  });

  if (!hasOrders) {
    kitchenOrdersDiv.innerHTML = "Nessuna comanda cucina attiva";
  }
}

function checkNewOrders(tables) {
  const currentKeys = new Set();

  tables.forEach(table => {
    const orders = table.orders || [];

    orders.forEach((order, orderIndex) => {
      if (order.kitchenDone) return;

      const kitchenItems = (order.items || []).filter(isKitchenItem);
      if (kitchenItems.length === 0) return;

      const key = `${table.id}-${orderIndex}-${order.createdAt}`;
      currentKeys.add(key);

      if (!firstLoad && !knownOrderKeys.has(key)) {
        playNotificationSound();
      }
    });
  });

  knownOrderKeys = currentKeys;
  firstLoad = false;
}

async function markKitchenDone(tableId, orderIndex) {
  const confirmDone = confirm("Segnare questa comanda come evasa?");

  if (!confirmDone) return;

  const tableRef = db.collection("tables").doc(tableId);
  const doc = await tableRef.get();

  if (!doc.exists) {
    alert("Tavolo non trovato");
    return;
  }

  const table = doc.data();
  const orders = table.orders || [];

  if (!orders[orderIndex]) {
    alert("Comanda non trovata");
    return;
  }

  orders[orderIndex].kitchenDone = true;
  orders[orderIndex].kitchenDoneAt = new Date().toISOString();

  await tableRef.update({
    orders: orders
  });

  alert("Comanda evasa ✅");
}

function loadKitchenOrders() {
  db.collection("tables")
    .where("status", "==", "open")
    .onSnapshot(snapshot => {
      const tables = [];

      snapshot.forEach(doc => {
        tables.push({
          id: doc.id,
          ...doc.data()
        });
      });

      tables.sort((a, b) => {
        return new Date(a.openedAt || 0) - new Date(b.openedAt || 0);
      });

      checkNewOrders(tables);
      renderKitchenOrders(tables);
    });
}

loadKitchenOrders();
