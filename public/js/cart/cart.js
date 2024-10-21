document.addEventListener('DOMContentLoaded', () => {


    const form1next = document.querySelector('#form1next');
    const form2previous = document.querySelector('#form2previous');
    const form2next = document.querySelector('#form2next');
    const form3previous = document.querySelector('#form3previous');
    const backToHome = document.querySelector('#backToHome');

    const cartView = document.querySelector('#cartView');
    const shipment = document.querySelector('#shipment');
    const payment = document.querySelector('#payment');
    const paymentApproved = document.querySelector('#paymentApproved');
    const paymentFailed = document.querySelector('#paymentFailed');
    const mainDiv = document.querySelector('#main');

    shipment.style.display = "none";
    payment.style.display = "none";
    paymentApproved.style.display = "none";
    paymentFailed.style.display = "none";

    //check if login
    const loggedInUser = document.querySelector('#loggedInUser');
    if (!loggedInUser) {
        form1next.addEventListener('click', () => {
            window.location.href = '/account';
        });
    }
    else {
        const shipmentErrorMsg = document.querySelector('#shipmentErrorMsg');

        //---------------------sections transition-----------------------

        form1next.addEventListener('click', () => {
            shipment.style.display = "block";
            payment.style.display = "none";
            cartView.style.display = "none";
        });
        form2previous.addEventListener('click', () => {
            shipment.style.display = "none";
            payment.style.display = "none";
            cartView.style.display = "block";
        });
        form2next.addEventListener('click', () => {

            let formValidation = true;
            //validation shipment
            const firstname = mainForm.firstName.value;
            const lastName = mainForm.lastName.value;
            const Address = mainForm.Address.value;
            const email = mainForm.email.value;
            const phoneNumber = mainForm.phoneNumber.value;

            if (phoneNumber.length != 10) { formValidation = false;; shipmentErrorMsg.innerHTML = "Phone number must contain 10 digits" }
            if (!/^\d+$/.test(phoneNumber)) { formValidation = false;; shipmentErrorMsg.innerHTML = "Phone number must contain only digits" }
            if (!phoneNumber) { formValidation = false; shipmentErrorMsg.innerHTML = "Phone number is required" }
            if (!/^[^@]+@[^@]+$/.test(email)) { formValidation = false; shipmentErrorMsg.innerHTML = "Email must follow the pattern: Example@Apple.com"; }
            if (!email) { formValidation = false; shipmentErrorMsg.innerHTML = "Email is required" }
            if (!Address) { formValidation = false; shipmentErrorMsg.innerHTML = "Adress is required" }
            if (!lastName) { formValidation = false; shipmentErrorMsg.innerHTML = "Last name is required" }
            if (!firstname) { formValidation = false; shipmentErrorMsg.innerHTML = "First name is required" }

            if (formValidation) {
                shipment.style.display = "none";
                payment.style.display = "block";
                cartView.style.display = "none";
            }
        });
        form3previous.addEventListener('click', () => {
            shipment.style.display = "block";
            payment.style.display = "none";
            cartView.style.display = "none";
        });
        backToHome.addEventListener('click', () => {
            window.location.href = "/";
        })


        //-----------------------empty cart form------------------------- 
        const emptyCartBtn = document.querySelector('#emptyCartBtn');
        const emptyCartForm = document.querySelector('#emptyCartForm');
        emptyCartForm.addEventListener('submit', async (event) => {
            event.preventDefault();
        })
        emptyCartBtn.addEventListener('click', () => {
            console.log("emptyCartBtn clicked")
            emptyCartForm.submit();
        })



        //----------------------payment form------------------------
        const mainForm = document.querySelector('#mainForm');
        mainForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Gather form data
            const formData = {
                products: JSON.parse(document.querySelector('input[name="products"]').value),
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                Address: document.getElementById('Adress').value,
                email: document.getElementById('email').value,
                userID: document.querySelector('input[name="userID"]').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                OrderNotes: document.getElementById('OrderNotes').value
            };

            try {
                const response = await fetch('/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const result = await response.text();
                    alert(result); // Handle success
                } else {
                    alert('Error submitting order: ' + response.statusText); // Handle error
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error submitting order: ' + error.message); // Handle fetch error
            }
        })

        const paymentForm = document.querySelector('#paymentForm')
        paymentForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            let formValidation = true;
            const CreditCardNumber = paymentForm.CreditCardNumber.value;
            const date = paymentForm.date.value;
            const CVV = paymentForm.CVV.value;
            const costumerID = paymentForm.costumerID.value;

            if (CVV.length != 3) { formValidation = false;; paymentErrorMsg.innerHTML = "CVV must contain 3 digits" }
            if (!/^\d+$/.test(CVV)) { formValidation = false; paymentErrorMsg.innerHTML = "CVV must contain only digits" }
            if (!CVV) { formValidation = false; paymentErrorMsg.innerHTML = "Credit card CVV is required" }
            if (!date) { formValidation = false; paymentErrorMsg.innerHTML = "Credit card expiry date is required" }
            if (!/^\d+$/.test(CreditCardNumber)) { formValidation = false; paymentErrorMsg.innerHTML = "Credit card number must contain only digits" }
            if (!CreditCardNumber) { formValidation = false; paymentErrorMsg.innerHTML = "Credit card number is required" }
            if (costumerID.length != 9) { formValidation = false;; paymentErrorMsg.innerHTML = "ID must contain 9 digits" }
            if (!/^\d+$/.test(costumerID)) { formValidation = false; paymentErrorMsg.innerHTML = "ID must contain only digits" }
            if (!costumerID) { formValidation = false; paymentErrorMsg.innerHTML = "ID is required" }

            if (formValidation) {
                const formData = new URLSearchParams(new FormData(this)).toString(); // Send as URL-encoded string

                try {
                    const response = await fetch('/orders/payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: formData,
                    });

                    const result = await response.json();

                    // Handle the result
                    if (result.paymentSuccess) {
                        payment.style.display = "none";
                        paymentApproved.style.display = "block";
                        mainForm.submit();
                    } else {
                        paymentFailed.style.display = "block";
                        payment.style.display = "none";
                        mainDiv.style.display = "none";
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    }

});