let compare = function (country, arg) {
    arg = arg.toLowerCase();
    return country.alpha2.toLowerCase() == arg || country.name.toLowerCase() == arg 
};

exports.getCountries = function () {
    let countries = require('./countries_fr.json');
    return countries;
};

exports.getCountry = function (arg) {
    let countries = require('./countries_fr.json');

    for (let i = 0; i < countries.length; i++) {
        if (compare(countries[i], arg)) {
            return countries[i];
        }
    }

    return null;
};