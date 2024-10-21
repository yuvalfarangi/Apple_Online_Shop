const loginSection = document.querySelector('#login');
const signupSection = document.querySelector('#signup');
const switchToSigupBtn = document.querySelector('#switchToSigup');
const switchToLoginBtn = document.querySelector('#switchToLogin');


//check if the form is re renderd
const signUpErrorMsgs = document.querySelector('#signUpErrorMsgs')
if (signUpErrorMsgs) {
    loginSection.style.display = "none";
    signupSection.style.display = "block";
}
else {
    loginSection.style.display = "block";
    signupSection.style.display = "none";
}

switchToLoginBtn.addEventListener('click', () => {
    loginSection.style.display = "block";
    signupSection.style.display = "none";
});
switchToSigupBtn.addEventListener('click', () => {
    loginSection.style.display = "none";
    signupSection.style.display = "block";
});

const signUpForm = document.querySelector('#signUpForm');
const signUpErrorMsg = document.querySelector('#signUpErrorMsg')
const signupbtn = document.querySelector('#signup')

signupbtn.addEventListener('click', async () => {

    console.log('signupbtn clicked')

})
