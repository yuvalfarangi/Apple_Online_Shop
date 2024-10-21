//filtering

let categoryButtons = Array.from(document.querySelectorAll(".nav-category-bitmap"));
console.dir(categoryButtons);

let productsSections = Array.from(document.querySelectorAll("section"));

categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {

        const id = btn.id.split("bitmapFor").pop();
        let selectedCategorySection = document.querySelector("#" + id);

        let allProductsSections = Array.from(document.querySelectorAll(".productsSection"));

        for (let seccion of allProductsSections) {
            seccion.style.display = "none";
            seccion.style.visibility = "hidden";
        }
        selectedCategorySection.style.display = "block";
        selectedCategorySection.style.visibility = "visible";
    })
})

