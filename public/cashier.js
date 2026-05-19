const cashierStatsDiv =
  document.getElementById("cashierStats");

const cashierOpenTablesDiv =
  document.getElementById("cashierOpenTables");

const cashierClosedTablesDiv =
  document.getElementById("cashierClosedTables");

const clearDayButton =
  document.getElementById("clearDayButton");

function isToday(dateString) {

  if (!dateString) return false;

  const date =
    new Date(dateString);

  const today =
    new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function formatTime(dateString) {

  if (!dateString) return "";

  return new Date(dateString)
    .toLocaleTimeString(
      "it-IT",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
}

function buildTableSummary(
  tableNumber,
  table
) {

  const orders =
    table.orders || [];

  let summary =
    `TAVOLO ${tableNumber}\n\n`;

  orders.forEach((order, index) => {

    summary +=
      `ORDINE ${index + 1}\n`;

    summary +=
      `👤 Cameriere: ${order.waiter || "N/D"}\n`;

    summary +=
      `${order.type === "add" ? "➕ Aggiunta" : "🍕 Nuova comanda"}\n\n`;

    order.items.forEach(item => {

      summary +=
        `${item.quantity} x ${item.name}\n`;

      if (item.modification) {

        summary +=
          `✏️ ${item.modification}\n`;
      }
    });

    if (order.notes) {

      summary +=
        `📝 ${order.notes}\n`;
    }

    summary +=
      `\n💰 Totale ordine: €${Number(order.total || 0).toFixed(2)}\n`;

    summary += "\n------------------\n\n";
  });

  summary +=
    `💰 TOTALE TAVOLO: €${Number(table.total || 0).toFixed(2)}`;

  return summary;
}

async function showCashierDetail(
  tableNumber
) {

  const doc =
    await db
      .collection("tables")
      .doc(tableNumber)
      .get();

  if (!doc.exists) {

    alert("Tavolo non trovato");

    return;
  }

  alert(
    buildTableSummary(
      tableNumber,
      doc.data()
    )
  );
}

async function closeTableFromCashier(
  tableNumber
) {

  const doc =
    await db
      .collection("tables")
      .doc(tableNumber)
      .get();

  if (!doc.exists) {

    alert("Tavolo non trovato");

    return;
  }

  const table =
    doc.data();

  const summary =
    buildTableSummary(
      tableNumber,
      table
    );

  const confirmClose =
    confirm(
      `${summary}\n\nConfermare chiusura tavolo?`
    );

  if (!confirmClose) return;

  await db
    .collection("tables")
    .doc(tableNumber)
    .update({
      status: "closed",
      closedAt:
        new Date().toISOString()
    });

  alert(
    `Tavolo ${tableNumber} chiuso ✅`
  );
}

async function clearTodayTables() {

  const firstConfirm =
    confirm(
      "Vuoi davvero svuotare i tavoli chiusi di oggi?"
    );

  if (!firstConfirm) return;

  const secondConfirm =
    confirm(
      "Operazione irreversibile. Confermare?"
    );

  if (!secondConfirm) return;

  const snapshot =
    await db
      .collection("tables")
      .where("status", "==", "closed")
      .get();

  const batch =
    db.batch();

  snapshot.forEach(doc => {

    const table =
      doc.data();

    if (isToday(table.closedAt)) {

      batch.delete(doc.ref);
    }
  });

  await batch.commit();

  alert(
    "Giornata svuotata ✅"
  );
}

clearDayButton.addEventListener(
  "click",
  clearTodayTables
);

function renderCashier(tables) {

  let revenueToday = 0;

  let openCount = 0;

  let closedTodayCount = 0;

  cashierOpenTablesDiv.innerHTML = "";

  cashierClosedTablesDiv.innerHTML = "";

  const openTables = [];

  const closedTodayTables = [];

  tables.forEach(table => {

    if (table.status === "open") {

      openCount += 1;

      openTables.push(table);
    }

    if (
      table.status === "closed" &&
      isToday(table.closedAt)
    ) {

      closedTodayCount += 1;

      revenueToday +=
        Number(table.total || 0);

      closedTodayTables.push(table);
    }
  });

  cashierStatsDiv.innerHTML = `
    <div class="menu-item">
      <span>
        💰 Incasso oggi
      </span>

      <strong>
        €${revenueToday.toFixed(2)}
      </strong>
    </div>

    <div class="menu-item">
      <span>
        🔴 Tavoli aperti
      </span>

      <strong>
        ${openCount}
      </strong>
    </div>

    <div class="menu-item">
      <span>
        ✅ Tavoli chiusi oggi
      </span>

      <strong>
        ${closedTodayCount}
      </strong>
    </div>
  `;

  if (openTables.length === 0) {

    cashierOpenTablesDiv.innerHTML =
      "Nessun tavolo aperto";

  } else {

    openTables.sort((a, b) =>
      Number(a.tableNumber) -
      Number(b.tableNumber)
    );

    openTables.forEach(table => {

      const lastOrder =
        table.orders?.[
          table.orders.length - 1
        ];

      const waiter =
        lastOrder?.waiter || "N/D";

      const card =
        document.createElement("div");

      card.className =
        "menu-item";

      card.innerHTML = `
        <span>
          🔴 Tavolo ${table.tableNumber}<br>

          👤 ${waiter}<br>

          <strong>
            €${Number(table.total || 0).toFixed(2)}
          </strong>
        </span>

        <div style="display:flex; gap:6px; flex-wrap:wrap;">

          <button onclick="showCashierDetail('${table.tableNumber}')">
            📜 Dettaglio
          </button>

          <button onclick="closeTableFromCashier('${table.tableNumber}')">
            💰 Chiudi
          </button>

        </div>
      `;

      cashierOpenTablesDiv.appendChild(
        card
      );
    });
  }

  if (closedTodayTables.length === 0) {

    cashierClosedTablesDiv.innerHTML =
      "Nessun tavolo chiuso oggi";

  } else {

    closedTodayTables.sort((a, b) =>
      new Date(b.closedAt) -
      new Date(a.closedAt)
    );

    closedTodayTables.forEach(table => {

      const card =
        document.createElement("div");

      card.className =
        "menu-item";

      card.innerHTML = `
        <span>
          ✅ Tavolo ${table.tableNumber}<br>

          <small>
            Chiuso alle ${formatTime(table.closedAt)}
          </small><br>

          <strong>
            €${Number(table.total || 0).toFixed(2)}
          </strong>
        </span>

        <div style="display:flex; gap:6px; flex-wrap:wrap;">

          <button onclick="showCashierDetail('${table.tableNumber}')">
            📜 Dettaglio
          </button>

        </div>
      `;

      cashierClosedTablesDiv.appendChild(
        card
      );
    });
  }
}

function loadCashierData() {

  db.collection("tables")
    .onSnapshot(snapshot => {

      const tables = [];

      snapshot.forEach(doc => {

        tables.push({
          id: doc.id,
          ...doc.data()
        });
      });

      renderCashier(tables);
    });
}

loadCashierData();
