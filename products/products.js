let products_container = document.getElementById("products-container");
let errordiv = document.getElementById("errordiv");
let kivalasztottKategoria = "";

function selectCategory(event) {
  const btn = event.target;
  const cat = btn.dataset.cat;

  if (kivalasztottKategoria === cat) return;

  document
    .querySelectorAll(".category-btn")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
  kivalasztottKategoria = cat;
}

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", selectCategory);
});

async function minden() {
  try {
    let req = await fetch("./products.php/minden");
    let Data = await req.json();
    //console.log(Data)
    /////////////////////////////////////////////////////////////
    //ki kel egesziteni hogy a kartya az adott termek id-jet valahogy tartalmazza a kosarba rakashoz
    //////////////////////////////////////////////////////////////
    if (req.ok) {
      errordiv.hidden = true;
      for (const d of Data) {
        products_container.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 mb-3">
                    <div class="card shadow-sm h-100">
                        <img src="${d.foto}" class="card-img-top" alt="${d.nev}">
                        <div class="card-body d-flex flex-column">
                            <h5 id="product-name" class="card-title">${d.nev}</h5>
                            <p class="card-text">${d.leiras}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fw-bold">${d.ar} Ft</span>
                                <button id="to-cart" class="btn btn-sm" id="${d.id}">Kosárba</button>
                            </div>
                        </div>
                    </div>
                </div>`;
      }
    } else {
      products_container.innerHTML = "";
      throw Data.valasz;
    }
  } catch (error) {
    errordiv.hidden = false;
    errordiv.innerHTML = error;
    errordiv.className = "alert alert-danger";
  }
}

async function szures() {
  const min = document.getElementById("min-price").value;
  const max = document.getElementById("max-price").value;

  console.log("Keresés:", kivalasztottKategoria, min, max);

  try {
    console.log("valami");
    let req = await fetch(
      `./products.php/szures?kategoria=${kivalasztottKategoria}&min=${min}&max=${max}`
    );
    let Data = await req.json();

    if (req.ok) {
      console.log("valami");
      errordiv.hidden = true;
      products_container.innerHTML = "";

      for (const d of Data) {
        products_container.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 mb-3">
                    <div class="card shadow-sm h-100">
                        <img src="${d.foto}" class="card-img-top" alt="${d.nev}">
                        <div class="card-body d-flex flex-column">
                            <h5 id="product-name" class="card-title">${d.nev}</h5>
                            <p class="card-text">${d.leiras}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fw-bold">${d.ar} Ft</span>
                                <button id="to-cart" class="btn btn-primary btn-sm">Kosárba</button>
                            </div>
                        </div>
                    </div>
                </div>`;
      }
    } else {
      products_container.innerHTML = "";
      throw Data.valasz;
    }
  } catch (error) {
    errordiv.hidden = false;
    errordiv.innerHTML = error;
    errordiv.className = "alert alert-danger";
  }
}

window.addEventListener("load", minden);
document.getElementById("search-btn").addEventListener("click", szures);
