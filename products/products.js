let selectedCategory = null;

document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;

        // Ha ugyanarra kattint, marad aktív – nem kell toggolni
        if (selectedCategory === cat) {
            return;
        }

        // Minden gomb inaktiválása
        document.querySelectorAll(".category-btn").forEach((b) => {
            b.classList.remove("active");
        });

        // Aktuális gomb aktiválása
        btn.classList.add("active");
        selectedCategory = cat;

        console.log("Kiválasztott kategória:", selectedCategory);
    });
});

document.getElementById("search-btn").addEventListener("click", () => {
    

    // majd:
    // fetch(`/api/products?cat=${selectedCategory}&min=${min}&max=${max}`)
});