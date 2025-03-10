//for our onclick button - the following must happen
document.getElementById("submitButton").addEventListener("click", () => {
    let countryName = document.getElementById("CountryName").value.trim();
    if (!countryName) return alert("Please enter a valid country name");

    fetchCountryData(countryName);
});

// Fetching the country details
const fetchCountryData = (country) => {
    fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true&fields=name,capital,population,region,flags,borders`)
        .then(res => res.ok ? res.json() : Promise.reject("Oops! No results found for the entered country"))
        .then(data => displayCountryInfo(data[0]))
        .catch(err => showError(err));
};

// Display country details
const displayCountryInfo = (country) => {
    document.getElementById("country-info").innerHTML = `
        <h1>${country.name.common}</h1>
        <p><b>Capital:</b> ${country.capital?.[0] || "N/A"}</p>
        <p><b>Population:</b> ${country.population.toLocaleString()}</p>
        <p><b>Region:</b> ${country.region}</p>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
    `;

    // Fetching bordering countries (if available)
    country.borders?.length ? fetchBorderCountries(country.borders) : showNoBorders();
};

// Fetch and display the neighbouring countries
const fetchBorderCountries = (borders) => {
    fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}&fields=name,flags`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("bordering-countries").innerHTML = `
                <h3>Bordering Countries:</h3>
                ${data.map(c => `<section><p>${c.name.common}</p><img src="${c.flags.png}" alt="Flag of ${c.name.common}"></section>`).join("")}
            `;
        })
        .catch(() => showNoBorders());
};

// Handle errors
const showError = (msg) => {
    document.getElementById("country-info").innerHTML = `<p style="color:red;">${msg}</p>`;
    document.getElementById("bordering-countries").innerHTML = "";
};

// Handle cases where a country has no neighbouring countries
const showNoBorders = () => {
    document.getElementById("bordering-countries").innerHTML = "<p>No neighbouring countries found.</p>";
};

