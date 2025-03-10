//for our onclick button - the following must happen
document.getElementById("submitButton").addEventListener("click", () => {
    let countryName = document.getElementById("CountryName").value.trim();

    if (!countryName) {
        alert("Please enter a valid country name");
        return;
    }

    fetchCountryData(countryName);
});



function fetchCountryData(country) {
    let myAPIURL = `https://restcountries.com/v3.1/name/${country}?fullText=true&fields=name,capital,population,region,flags,borders`;

    fetch(myAPIURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Oops! No results found for the entered Country");
            }
            return response.json();
        })
        .then(data => {
            let countryData = data[0];

            // here we get the relevant country details that are needed for this lab
            let countryInfo = `
                <h1>${countryData.name.common}</h1
                <p><b>Capital:</b> ${countryData.capital ? countryData.capital[0] : "N/A"}</p>
                <p><b>Population:</b> ${countryData.population.toLocaleString()}</p>
                <p><b>Region:</b> ${countryData.region}</p>
                <img src="${countryData.flags.png}" alt="Flag of ${countryData.name.common}">
            `;

            document.getElementById("country-info").innerHTML = countryInfo;

            // Fetch and display all neighbouring countries , if none - make sure that the error is handled
            if (countryData.borders && countryData.borders.length > 0) {
                fetchBorderCountries(countryData.borders);
            } else {
                document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries found.</p>";
            }
        })
        .catch(error => {
            document.getElementById("country-info").innerHTML = `<p style="color:red;">${error.message}</p>`;
            document.getElementById("bordering-countries").innerHTML = "";
        });
}



function fetchBorderCountries(borders) {
    let myAPIURL = `https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}&fields=name,flags`;

    fetch(myAPIURL)
        .then(response => response.json())
        .then(data => {
            let borderInfo = "<h3>Bordering Countries:</h3>";
            data.forEach(country => {
                borderInfo += `
                    <div>
                        <p>${country.name.common}</p>
                        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                        
                    </div>
                `;
            });

            document.getElementById("bordering-countries").innerHTML = borderInfo;
        })
        .catch(error => {
            document.getElementById("bordering-countries").innerHTML = `<p style="color:red;">Could not fetch bordering countries.</p>`;
        });
}

