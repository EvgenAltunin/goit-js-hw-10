import './css/styles.css';
import { fetchCountries } from "./fetchCountries"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
let debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 1000;

const refs = {
    searchField: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfoEl: document.querySelector('.country-info')
}

refs.searchField.addEventListener("input", debounce(onSearchFieldInput, DEBOUNCE_DELAY))

function onSearchFieldInput(event) {
    refs.countriesList.innerHTML = ""

    if (event.target.value.trim() === "") {
        return
    }

    let enteredInputValue = event.target.value.trim();
    // console.log(response)
    fetchCountries(enteredInputValue)
    .then((response) => {
      if (response.length >= 2 && response.length < 10) {
        renderCountresList(response)
      } else if (response.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.")
      } else {
        renderCountry(response)
      }
    })
    .catch((error) => Notify.failure("Oops, there is no country with that name"));
}


function renderCountresList(countries) {
  const countryListItemMarkup = countries
  .map((country) => {
    return `
    <li class="country-list-item">
      <div class="country-list-item__wrapper">
        <img class="country-list-item__flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}">
        <p class="country-list-item__official-name"><b>${country.name.official}</b></p>
      </div>
    </li>
    `;
  })
  .join("");
  refs.countriesList.innerHTML = countryListItemMarkup;
}

function renderCountry(country) {
  const countryInfoMarkup = country
    .map((country) => {
      return `
        <div class="country-info__wrapper">
          <img class="country-info__flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}">
          <p class="country-info__official_name"><b>${country.name.official}</b></p>
        </div>
        <p class="country-info__capitall"><b>Capotal</b>: ${country.capital}</p>
        <p class="country-info__population"><b>Population</b>: ${country.population}</p>
        <p class="country-info__languages"><b>Languages</b>: ${Object.values(country.languages).join(", ")}</p>
      `;
    })
    .join("");
  refs.countryInfoEl.innerHTML = countryInfoMarkup;
}