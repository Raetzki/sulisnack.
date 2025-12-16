function showGlobalAlert(message, type = "success", duration = 5000) {
  const container = document.getElementById("global-alerts") || document.body;
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} shadow-sm`;
  alert.style.marginBottom = "10px";
  alert.innerText = message;
  container.appendChild(alert);
  setTimeout(() => {
    alert.style.transition = "opacity 0.5s, transform 0.5s";
    alert.style.opacity = "0";
    alert.style.transform = "translateY(20px)";
    setTimeout(() => alert.remove(), 500);
  }, duration);
}

function getStatusColor(statusz_id) {
  switch (parseInt(statusz_id)) {
    case 1:
      return "#f8d7da";
    case 2:
      return "#fff3cd";
    case 3:
      return "#d4edda";
    default:
      return "#f8f9fa";
  }
}

async function changeOrderStatus(id, statusz_id, card) {
  try {
    const res = await fetch("./orders.php/change", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statusz_id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");

    card.style.backgroundColor = getStatusColor(statusz_id);
    showGlobalAlert("Státusz módosítva!", "success");

    if (statusz_id == 3) {
      setTimeout(() => {
        card.style.transition = "opacity 1s, transform 1s";
        card.style.opacity = "0";
        card.style.transform = "translateX(100%)";
        setTimeout(async () => {
          await deleteOrder(id);
        }, 1000);
      }, 5000);
    }
  } catch (err) {
    console.error(err);
    showGlobalAlert(err.message, "danger");
  }
}

async function deleteOrder(id) {
  try {
    const res = await fetch("./orders.php/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");
    showGlobalAlert("Rendelés törölve!", "success");
    await loadOrders();
  } catch (err) {
    console.error(err);
    showGlobalAlert(err.message, "danger");
  }
}

async function loadOrders() {
  try {
    const res = await fetch("./orders.php/query");
    if (!res.ok) throw new Error("Jelenleg nincsenek rendelések!");
    const orders = await res.json();

    const cardsContainer = document.getElementById("cards");
    cardsContainer.innerHTML = "";

    orders.forEach((order) => {
      const card = document.createElement("div");
      card.className =
        "card shadow-sm p-3 d-flex flex-row justify-content-between align-items-center";
      card.style.backgroundColor = getStatusColor(order.statusz_id);

      card.innerHTML = `
        <div>
          <strong>ID:</strong> ${order.id} <br>
          <strong>Dátum:</strong> ${order.datumido} <br>
          <strong>Termék:</strong> ${order.nev} <br>
          <strong>Ár:</strong> ${order.ar} Ft
        </div>
        <div class="d-flex gap-1 flex-column flex-md-row">
          <button class="btn btn-sm btn-danger delete-btn">Törlés</button>
          <button class="btn btn-sm btn-outline-danger status-btn" data-status="1">Feldolgozás alatt</button>
          <button class="btn btn-sm btn-outline-warning status-btn" data-status="2">Készítés alatt</button>
          <button class="btn btn-sm btn-outline-success status-btn" data-status="3">Kiadva</button>
        </div>
      `;

      cardsContainer.appendChild(card);

      card
        .querySelector(".delete-btn")
        .addEventListener("click", () => deleteOrder(order.id));
      card.querySelectorAll(".status-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          changeOrderStatus(order.id, btn.dataset.status, card)
        );
      });
    });

    applyFilters();
  } catch (error) {
    console.error(error);
    showGlobalAlert(error.message, "danger");
  }
}

function applyFilters() {
  const qId = document.getElementById("q-id").value.trim();
  const qName = document.getElementById("q-name").value.trim().toLowerCase();
  const qClass = document.getElementById("q-class").value.trim().toLowerCase();

  document.querySelectorAll("#cards .card").forEach((card) => {
    const text = card.innerText.toLowerCase();
    const match =
      (!qId || text.includes(qId)) &&
      (!qName || text.includes(qName)) &&
      (!qClass || text.includes(qClass));
    card.style.display = match ? "flex" : "none";
  });
}

function setupSearch() {
  document.getElementById("searchBtn").addEventListener("click", applyFilters);
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("q-id").value = "";
    document.getElementById("q-name").value = "";
    document.getElementById("q-class").value = "";
    applyFilters();
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadOrders();
  setupSearch();
});
