const http = require('http');
const fs = require('fs');
const url = require('url');

const stringJSON = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const cardsData = JSON.parse(stringJSON);
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const replaceTemplate = function (template, product) {
    let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%COUNTRY_ORIGIN%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%NOT_ORGANIC%}/g, product.organic ? '' : 'not-organic');
    return output;
}

const server = http.createServer((request, response) => {
    const urlRequest = request.url;
    const urlObject = url.parse(urlRequest, true);

    // OVERVIEW PAGE
    if (urlRequest === '/' || urlRequest === '/overview') {
        const cardsHTML = cardsData.map(productObjectData => {
            return replaceTemplate(templateCard, productObjectData);
        }).join('');
        response.writeHead(200, {
            'Content-Type': 'text/html'
        })
        const overviewPageHTML = templateOverview.replace(`{%PRODUCT_CARDS%}`, cardsHTML);
        response.end(overviewPageHTML);
    }
    // PRODUCT PAGE
    else if (urlRequest.includes('/product?id=')) {
        const productDataByID = cardsData.find(el => el.id === +urlObject.query.id);
        const productPageHTML = replaceTemplate(templateProduct, productDataByID);
        response.end(productPageHTML);
    }
    // API
    else if (urlRequest === '/api') {
        response.writeHead(200, {
            'Content-Type': `application/json`
        })
        response.end(stringJSON);
    }
    // NOT FOUND
    else {
        response.writeHead(404, {
            'Content-Type': 'text/html'
        })
        response.end(`<h1>Page not found!</h1>`);
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log(`Server up on:`);
    console.log(`127.0.0.1:8000`);
})