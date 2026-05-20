const extraNameInput = document.getElementById("extraName");
const extraPriceInput = document.getElementById("extraPrice");
const extraCategoryInput = document.getElementById("extraCategory");
const addExtraButton = document.getElementById("addExtraButton");
const extrasListDiv = document.getElementById("extrasList");

async function addExtra() {
  const name = extraNameInput.value.trim();
  const price = Number(extraPriceInput.value.replace(",", "."));
  const category = extraCategoryInput.value.trim() || "Altro";

  if (!name) {
    alert("Inserisci il nome extra");
    return;
  }

  if (isNaN(price)) {
    alert("Prezzo non valido");
    return;
  }

  await db.collection("extras").add({
    name,
    price,
    category,
    active: true,
    createdAt: new Date().toISOString()
  });

  extraNameInput.value = "";
  extraPriceInput.value = "";
  extraCategoryInput.value = "";

  alert("Extra aggiunto ✅");
}

async function toggleExtra(id, active) {
  await db.collection("extras").doc(id).update({
    active: !active
  });
}

async function editExtra(id, extra) {
  const newName = prompt("Nome extra", extra.name);
  if (!newName) return;

  const newPriceRaw = prompt("Prezzo", extra.price);
  if (newPriceRaw === null) return;

  const newPrice = Number(String(newPriceRaw).replace(",", "."));

  if (isNaN(newPrice)) {
    alert("Prezzo non valido");
    return;
  }

  const newCategory = prompt("Categoria", extra.category || "Altro") || "Altro";

  await db.collection("extras").doc(id).update({
    name: newName.trim(),
    price: newPrice,
    category: newCategory.trim()
  });
}

function renderExtras(extras) {
  extrasListDiv.innerHTML = "";

  if (extras.length === 0) {
    extrasListDiv.innerHTML = "Nessun extra presente";
    return;
  }

  extras.forEach(extra => {
    const row = document.createElement("div");
    row.className = "menu-item";

    row.innerHTML = `
      <span>
        <strong>${extra.name}</strong><br>
        <small>${extra.category || "Altro"}</small><br>
        <strong>€${Number(extra.price || 0).toFixed(2)}</strong><br>
        <small>${extra.active ? "✅ Attivo" : "⛔ Disattivo"}</small>
      </span>

      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button onclick='editExtra("${extra.id}", ${JSON.stringify(extra).replace(/'/g, "&apos;")})'>
          ✏️
        </button>

        <button onclick="toggleExtra('${extra.id}', ${extra.active})">
          ${extra.active ? "Disattiva" : "Attiva"}
        </button>
      </div>
    `;

    extrasListDiv.appendChild(row);
  });
}

function loadExtras() {
  db.collection("extras")
    .onSnapshot(snapshot => {
      const extras = [];

      snapshot.forEach(doc => {
        extras.push({
          id: doc.id,
          ...doc.data()
        });
      });

      extras.sort((a, b) => {
        const cat = String(a.category || "").localeCompare(String(b.category || ""));
        if (cat !== 0) return cat;
        return String(a.name || "").localeCompare(String(b.name || ""));
      });

      renderExtras(extras);
    });
}

addExtraButton.addEventListener("click", addExtra);

loadExtras();