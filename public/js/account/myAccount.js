const editProfileForm = document.querySelector('#editProfileForm');
const editProfileBtn = document.querySelector('#editProfileBtn');
const personalDeatils = document.querySelector('#personalDeatils');


const ErrorMsg = document.querySelector('.ErrorMsg');
if (ErrorMsg) {
    editProfileForm.style.display = "block";
    personalDeatils.style.display = "none";
    editProfileBtn.innerText = 'Save';
} else {
    editProfileForm.style.display = "none";
    personalDeatils.style.display = "block";
}

editProfileBtn.addEventListener('click', () => {
    if (editProfileBtn.innerText == 'Edit profile') {
        editProfileForm.style.display = "block";
        personalDeatils.style.display = "none";
        editProfileBtn.innerText = 'Save';
    }
    else if (editProfileBtn.innerText == 'Save') {
        editProfileForm.submit();
    }
})
