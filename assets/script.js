const dropList = document.querySelectorAll("form select"),
  amountInput = document.querySelector(".amount input"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select");

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      i == 0
        ? currency_code == "GBP"
          ? "selected"
          : ""
        : currency_code == "USD"
        ? "selected"
        : "";
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/w40/${country_list[
        code
      ].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

amountInput.addEventListener("input", () => {
  getExchangeRate();
});

fromCurrency.addEventListener("change", () => {
  getExchangeRate();
});

toCurrency.addEventListener("change", () => {
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  // if(amountVal == "" || amountVal == "0"){
  //     amount.value = "1";
  //     amountVal = 1;
  // }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/1449de87c7372bfd0af6fd73/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}
