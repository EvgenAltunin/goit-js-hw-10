import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
let debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    searchField: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfoEl: document.querySelector('.country-info')
}

refs.searchField.addEventListener("input", debounce(onSearchFieldInput, DEBOUNCE_DELAY))


function fetchCountries(countryName) {
  return fetch(`https://restcountries.com/v3.1/name/${countryName}`).then(
    (response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}

function onSearchFieldInput(event) {
    refs.countriesList.innerHTML = ""

    if (event.target.value.trim() === "") {
        return
    }

    let countryName = event.target.value.trim();
    console.log(countryName)
    fetchCountries(countryName)
    .then((country) => {
        console.log(country)
        renderCountry(country)
    })
    .catch((error) => console.log(error));
}


function renderCountry(country) {
  const markup = country
    .map((country) => {
      return `
          <li>
            <p><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="60"><b>${country.name.official}</b></p>
            <p><b>Capotal</b>: ${country.capital}</p>
            <p><b>Population </b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages).join(", ")}</p>
          </li>
      `;
    })
    .join("");
  refs.countriesList.innerHTML = markup;
}