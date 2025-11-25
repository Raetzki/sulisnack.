let selectedCategory = null;

function selectCategory(event) {
    const btn = event.target;
    const cat = btn.dataset.cat;

    if (selectedCategory === cat) return;

    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    selectedCategory = cat;
}

document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", selectCategory);
});

document.getElementById("search-btn").addEventListener("click", async () => {
    const min = document.getElementById("min-price").value;
    const max = document.getElementById("max-price").value;

    console.log("Keresés:", selectedCategory, min, max);


    // await fetch(`./products.php?kategoria=${selectedCategory}&min=${min}&max=${max}`);
});

async function minden(){
    let products_container = document.getElementById("products-container")
    let errordiv = document.getElementById("error-div")


    try {
        let req = await fetch("./products.php/minden")
        let Data = await req.json();

        if(req.ok){
            for (const d of Data) {
                products_container.innerHTML += `
                ${d.foto}, ${d.nev}, ${d.leiras}, ${d.ar}`
            }
        }
        else{
            throw Data.valasz
        }
        

    } catch (error) {
        errordiv.hidden = false
        errordiv.innerHTML = Data.valasz;
        errordiv.className = "alert alert-danger"
    }
}

window.addEventListener("load", minden)


