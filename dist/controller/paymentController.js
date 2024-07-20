"use strict";
// let paymentForm = document.getElementById('paymentForm');
// paymentForm.addEventListener("submit", payWithPaystack, false);
// function payWithPaystack(e: any) {
//   e.preventDefault();
//   let handler = PaystackPop.setup({
//     key: 'pk_test_xxxxxxxxxx', // Replace with your public key
//     email: document.getElementById("email-address").value,
//     amount: document.getElementById("amount").value * 100,
//     ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
//     // label: "Optional string that replaces customer email"
//     onClose: function(){
//       alert('Window closed.');
//     },
//     callback: function(response){
//       let message = 'Payment complete! Reference: ' + response.reference;
//       alert(message);
//     }
//   });
//   handler.openIframe();
// }
// const paymentForm = document.getElementById('paymentForm') as HTMLFormElement;
// paymentForm.addEventListener("submit", payWithPaystack, false);
// function payWithPaystack(e: Event) {
//   e.preventDefault();
//   const email = document.getElementById("email-address").value;
//   const amount = parseInt(document.getElementById("amount").value, 10) * 100;
//   const handler = PaystackPop.setup({
//     key: 'pk_test_xxxxxxxxxx', // Replace with your public key
//     email,
//     amount,
//     ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Replace with a real reference
//     onClose: () => {
//       alert('Window closed.');
//     },
//     callback: (response: any) => {
//       const message = 'Payment complete! Reference: ' + response.reference;
//       alert(message);
//     }
//   });
//   handler.openIframe();
// }
