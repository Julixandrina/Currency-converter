'use strict';

document.addEventListener("DOMContentLoaded", onPageLoaded);

const MAIN_CUR = 'byn';

const rates = {
    'usd': 0,
    'eur': 0,
    'aud': 0
};


function onPageLoaded() {
    let ratesURL = 'https://ibapi.alfabank.by:8273/partner/1.0.1/public/nationalRates';
    fetch(ratesURL)
        .then((response) => response.json())
        .then(function (responseObject) {
            responseObject.rates.forEach(function (item) {
                let currencyCode = item.iso.toLowerCase();
                let currencyRate = item.rate;

                if (currencyCode in rates) {
                    rates[currencyCode] = currencyRate;

                }

            });

            onReady();

        });
}

function onReady() {

    let containerInputs = document.querySelector('.container-converter-inputs');
    containerInputs.addEventListener('input', function (event) {
        let target = event.target;
        if(target.classList.contains('input-form')){
            let CURRENT_CURRENCY = target.name;//'usd','eur', 'aud', 'byn'
            let CURRENT_AMOUNT = +target.value;//50
            let topParent = target.closest('.container-converter-inputs');
            let inputBYN = topParent.querySelector('#nbrb_byn');


            let BYN_VALUE = 0;
            if (CURRENT_CURRENCY !== MAIN_CUR) {
                //ЕСЛИ ТЕКУЩАЯ ВАЛЮТА НЕ БЕЛ РУБЛИ
                BYN_VALUE = CURRENT_AMOUNT * rates[CURRENT_CURRENCY];
                inputBYN.value = BYN_VALUE.toFixed(2);

            } else {
                //ЕСЛИ И ТАК ВВЕЛИ БЕЛ РУБЛИ
                BYN_VALUE = CURRENT_AMOUNT;
            }

            let inputsArr = document.querySelectorAll('.input-form');
            for (let input of inputsArr) {
                if (input.name !== MAIN_CUR && input.name !== CURRENT_CURRENCY) {
                    let amount = BYN_VALUE / rates[input.name];
                    input.value = amount.toFixed(2);
                }
            }




        }
    });

    let usdInput = document.getElementById('nbrb_usd');

    usdInput.value = 100;
    let event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    usdInput.dispatchEvent(event);

}





