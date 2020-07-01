'use strict';


let exchangeRateUSD = 2.4243;
let exchangeRateEUR = 1.1231;
let exchangeRateBYN = 2.4243;
let inputInitialForm = document.querySelectorAll('.input-form');
for (let input of inputInitialForm) {
    input.addEventListener('input', function (event) {
        let target = event.target
        let inputID = target.id;
        switch (inputID) {
            case 'nbrb_usd':
                let inputValueUSD = event.target.value;
                convertUSD(target, inputValueUSD);
                break;
            case  'nbrb_eur':
                let inputValueEUR = event.target.value;
                console.log(event.target.value);
                break;
            case  'nbrb_byn':
                let inputValueBYN = event.target.value;
                console.log(event.target.value);
                break;

        }
    });

}
function convertUSD(target,inputValueUSD) {

    let topParent = target.closest('.container-converter-inputs');
    let inputBYN = topParent.querySelector('#nbrb_byn');
    let inputEUR = topParent.querySelector('#nbrb_eur');

    let convertUSDInByn = inputValueUSD * exchangeRateBYN;
    convertUSDInByn = convertUSDInByn.toFixed(2);

    let convertUSDInEUR =

    inputBYN.value = convertUSDInByn;






}

/*
let containerInput = document.querySelectorAll('.inputs-item');
console.log(containerInput)
let inputInitialForm = containerInput.querySelector('.input-form');*/
