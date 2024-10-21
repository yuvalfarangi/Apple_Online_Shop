const colorRadioButtons = Array.from(document.querySelectorAll(".colorRadioButton"));
const product_img = document.querySelector('#imgItem');
const imgSrcForm = document.querySelector('#image_src')

const imgSrc = product_img.src;
let currentChar;
let imgIndex;

for (imgIndex = imgSrc.length - 1; imgIndex >= 0; imgIndex--) {
    currentChar = imgSrc[imgIndex];
    if (currentChar == ".") break;
}

function checkImageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}

colorRadioButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
        const btn = event.target;
        const selectedColor = btn.value;
        const newImgSrc = imgSrc.slice(0, imgIndex) + "_" + selectedColor + imgSrc.slice(imgIndex, imgSrc.length);

        const imgExists = await checkImageExists(newImgSrc);

        if (imgExists) {
            product_img.src = newImgSrc;
            imgSrcForm.value = newImgSrc;
        }
        else {
            product_img.src = imgSrc;
        }
    });
});

