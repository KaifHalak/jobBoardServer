const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = './extras/worldcities.csv';

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // Current format: 
    // {
    //     Country: city,
    //     Country: city,
    //     ...
    // }
    Format()
  });

let formattedCountries = {}


// Format to achive:
// {
//     country1: [cities],
//     country2: [cities],
//     ...
// }

function Format(){
    const specialCharactersPattern = /[^\w\s]/;
    results.forEach(({city, country}) => {
        // Remove cities / countries with any special characters like � and remove if value is null
        if (specialCharactersPattern.test(city) || specialCharactersPattern.test(country) || !city || !country){return}

        if (!formattedCountries[country]){
            formattedCountries[country] = [city]
            return
        }

        // Limit the number of cities upto 4
        if (formattedCountries[country].length < 4){
            formattedCountries[country].push(city)
        }
    })

    let jsonData = JSON.stringify(formattedCountries, null, 2)
    fs.writeFileSync("./extras/formattedWorlCities.json", jsonData);
}

