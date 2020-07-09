'use strict';

document.addEventListener("DOMContentLoaded", onPageLoaded);

const MAIN_CUR = 'byn';

const activeRates = [MAIN_CUR, 'usd', 'eur', 'pln', 'rub'];

const ratesStorage = {};

const pageStarted = (new Date()).getTime();

function onPageLoaded() {
    let ratesURL = 'https://ibapi.alfabank.by:8273/partner/1.0.1/public/nationalRates';
    fetch(ratesURL)
        .then((response) => response.json())
        .catch(function () {
            onFail()
        })
        .then(function (responseObject) {
            responseObject.rates.forEach(function (item) {
                let currencyCode = item.iso.toLowerCase();
                let currencyRate = item.rate;
                let currencyQuantity = item.quantity;

                if (activeRates.indexOf(currencyCode) !== -1) {
                    ratesStorage[currencyCode] = currencyRate / currencyQuantity;
                }
            });

            createCurInputs();
            onReady();

        })
        .catch(function () {
            onFail()
        });
}

function hidePreloader() {
    let preload = document.querySelector('.preloader');

    preload.addEventListener('transitionend', function () {
        preload.remove();
    });

    const minimumTime = 1500;
    const timeSpent = (new Date()).getTime() - pageStarted;

    if (timeSpent < minimumTime) {
        window.setTimeout(function () {
            preload.classList.add('hidden');
        }, minimumTime - timeSpent);
    } else {
        preload.classList.add('hidden');
    }

}

function onFail() {
    let fault = document.querySelector('.fault');
    fault.style.display = 'block';

    let container = document.querySelector('.container');
    container.style.backgroundColor = '#9d90c1';

    let allInputs = document.querySelectorAll('.input-form');
    for (let input of allInputs) {
        input.setAttribute('disabled', 'disabled');
    }

    hidePreloader()
}

function createCurInputs() {

    for (let i = 0; i < activeRates.length; i++) {
        let currencyCode = activeRates[i];
        let template = `<div class="inputs-item">
            <label class="item-currency-title" for="nbrb_${currencyCode}">${currencyCode}</label>
            <input type="tel" id="nbrb_${currencyCode}" name="${currencyCode}" value="" class="input-form">
        </div>`;
        let containerInput = document.querySelector('#curr-inputs-container');
        containerInput.insertAdjacentHTML('beforeend', `${template}`)
    }
}

function onReady() {
    let containerInputs = document.querySelector('.container-converter-inputs');
    containerInputs.addEventListener('keydown', function (event) {
        if (isNaN(event.key) && event.key !== '.' && event.key !== 'Backspace' && event.key !== ',') {
            event.preventDefault();
            return false;
        }
    });
    containerInputs.addEventListener('input', function (event) {
        if (typeof event.data !== 'undefined' && isNaN(event.data)) {
            event.preventDefault();
            return false;
        }
        let target = event.target;
        if (target.classList.contains('input-form')) {
            let CURRENT_CURRENCY = target.name;//'usd','eur', 'aud', 'byn'
            target.value = target.value.toString().replace(/,/g, ".");
            let CURRENT_AMOUNT = +target.value;
            let topParent = target.closest('.container-converter-inputs');
            let inputBYN = topParent.querySelector('#nbrb_byn');
            let BYN_VALUE = 0;
            if (CURRENT_CURRENCY !== MAIN_CUR) {
                //ЕСЛИ ТЕКУЩАЯ ВАЛЮТА НЕ БЕЛ РУБЛИ
                BYN_VALUE = CURRENT_AMOUNT * ratesStorage[CURRENT_CURRENCY];
                inputBYN.value = BYN_VALUE.toFixed(2);

            } else {
                //ЕСЛИ И ТАК ВВЕЛИ БЕЛ РУБЛИ
                BYN_VALUE = CURRENT_AMOUNT;
            }

            let inputsArr = document.querySelectorAll('.input-form');
            for (let input of inputsArr) {
                if (input.name !== MAIN_CUR && input.name !== CURRENT_CURRENCY) {
                    let amount = BYN_VALUE / ratesStorage[input.name];
                    input.value = amount.toFixed(2);
                }
            }
        }
    });

    let labelsForAllInput = document.querySelectorAll('.item-currency-title[for]');
    for (let label of labelsForAllInput) {
        label.addEventListener('click', function (event) {
            let valueLabel = event.target.getAttribute('for');
            let siblingLabel = event.target.nextElementSibling;
            let siblingIdValue = siblingLabel.getAttribute('id');
            if (valueLabel === siblingIdValue) {
                siblingLabel.select();
            }
        })
    }

    let usdInput = document.getElementById('nbrb_usd');
    usdInput.value = 100;
    let event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    usdInput.dispatchEvent(event);
    showDate();

    function showDate() {
        let dataDay = document.querySelector('.day');
        let timeSync = document.querySelector('.timeSync');
        let now = new Date();
        let year = now.getFullYear();

        let month = now.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }

        let date = now.getDate();
        if (date < 10) {
            date = `0${date}`;
        }

        let hours = now.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }

        let minutes = now.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        dataDay.innerHTML = `Официальный курс, устанавливаемый Национальным банком Республики Беларусь на ${date}.${month}.${year}`;
        timeSync.innerHTML = `Последнее обновление в ${hours}:${minutes}`;

        hidePreloader();
    }
}
