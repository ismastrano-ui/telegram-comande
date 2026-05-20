const kitchenOrdersDiv =
  document.getElementById("kitchenOrders");

const seenOrders =
  new Set();

const DRINK_KEYWORDS = [
  "acqua",
  "coca",
  "birra",
  "vino",
  "calice",
  "lete",
  "fanta",
  "sprite",
  "tea",
  "cocktail"
];

const FRIED_KEYWORDS = [
  "patate",
  "fritto",
  "panelle",
  "suppl",
  "crocche",
  "nuggets",
  "alette",
  "chips",
  "spicy",
  "fiori"
];

const DESSERT_KEYWORDS = [
  "tiramis",
  "cuore caldo",
  "dolce",
  "cheesecake"
];

function isDrink(itemName = "") {

  const lower =
    itemName.toLowerCase();

  return DRINK_KEYWORDS.some(
    keyword =>
      lower.includes(keyword)
  );
}

function isDessert(itemName = "") {

  const lower =
    itemName.toLowerCase();

  return DESSERT_KEYWORDS.some(
    keyword =>
      lower.includes(keyword)
  );
}

function isFried(itemName = "") {

  const lower =
    itemName.toLowerCase();

  return FRIED_KEYWORDS.some(
    keyword =>
      lower.includes(keyword)
  );
}

function getElapsedMinutes(createdAt) {

  if (!createdAt) return 0;

  const created =
    new Date(createdAt);

  const now =
    new Date();

  return Math.floor(
    (now - created) / 60000
  );
}

function getTimerClass(minutes) {

  if (minutes >= 20) {
    return "timer-red";
  }

  if (minutes >= 10) {
    return "timer-yellow";
  }

  return "timer-green";
}

function renderKitchenItems(items) {

  const filteredItems =
    items.filter(item =>
      !isDrink(item.name)
    );

  const fried =
    filteredItems.filter(item =>
      isFried(item.name)
    );

  const desserts =
    filteredItems.filter(item =>
      isDessert(item.name)
    );

  const pizzas =
    filteredItems.filter(item =>
      !isFried(item.name)
      && !isDessert(item.name)
    );

  let html = "";

  function renderSection(
    title,
    emoji,
    array
  ) {

    if (array.length === 0) return;

    html += `
      <div class="kitchen-section">

        <h3>
          ${emoji} ${title}
        </h3>
    `;

    array.forEach(item => {

      html += `
        <div class="kitchen-item">

          <strong>
            ${item.quantity}x ${item.name}
          </strong>
      `;

      if (item.modification) {

        html += `
          <div class="kitchen-note">
            ${item.modification
              .replace(/\n/g, "<br>")}
          </div>
        `;
      }

      html += `
        </div>
      `;
    });

    html += `
      </div>
    `;
  }

  renderSection(
    "Fritti",
    "🍟",
    fried
  );

  renderSection(
    "Pizze",
    "🍕",
    pizzas
  );

  renderSection(
    "Dolci",
    "🍰",
    desserts
  );

  return html;
}

function loadKitchenOrders() {

  db.collection("tables")
    .onSnapshot(snapshot => {

      kitchenOrdersDiv.innerHTML =
        "";

      snapshot.forEach(doc => {

        const table =
          doc.data();

        const tableId =
          doc.id;

        const orders =
          table.orders || [];

        orders.forEach(
          (order, index) => {

          if (order.kitchenDone)
            return;

          const filteredItems =
            (order.items || [])
            .filter(item =>
              !isDrink(item.name)
            );

          if (
            filteredItems.length === 0
          ) return;

          const orderId =
            `${tableId}_${index}`;

          const minutes =
            getElapsedMinutes(
              order.createdAt
            );

          const timerClass =
            getTimerClass(minutes);

          const isNew =
            !seenOrders.has(orderId);

          const card =
            document.createElement(
              "div"
            );

          card.className =
            `kitchen-card ${
              isNew
                ? "new-order"
                : ""
            }`;

          card.innerHTML = `

            <div class="kitchen-topbar">

              <div>

                <div class="kitchen-table">

                  🪑 Tavolo ${tableId}

                </div>

                <div class="kitchen-meta">

                  👤 ${
                    order.waiter || "N/D"
                  }

                  •

                  ${
                    order.type === "add"
                      ? "➕ AGGIUNTA"
                      : "🆕 NUOVA"
                  }

                </div>

              </div>

              <div class="
                kitchen-timer
                ${timerClass}
              ">
                ⏱ ${minutes} min
              </div>

            </div>

            ${renderKitchenItems(
              filteredItems
            )}

            <button
              class="done-button"
            >
              ✅ EVASA
            </button>

          `;

          card.onclick = () => {

            card.classList.remove(
              "new-order"
            );

            seenOrders.add(orderId);
          };

          const doneButton =
            card.querySelector(
              ".done-button"
            );

          doneButton.onclick =
            async (e) => {

            e.stopPropagation();

            order.kitchenDone =
              true;

            await db
              .collection("tables")
              .doc(tableId)
              .update({
                orders
              });
          };

          kitchenOrdersDiv
            .appendChild(card);
        });
      });
    });
}

loadKitchenOrders();

setInterval(
  loadKitchenOrders,
  30000
);