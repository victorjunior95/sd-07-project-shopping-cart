const fetch = require('node-fetch');

const findItem = (item) => {
    const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${item}`;
    fetch(endPoint)
    .then(response=>response.json())
    .then(data=>console.log(data.results));
}

findItem("COMPUTADOR");