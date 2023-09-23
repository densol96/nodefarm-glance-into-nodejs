// IMPORTS
const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// DATA
const stringJSON = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const cardsData = JSON.parse(stringJSON);
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((request, response) => {
    const urlRequest = request.url;
    const { query, pathname: pathName } = url.parse(urlRequest, true);
    // OVERVIEW PAGE
    if (pathName === '/' || pathName === '/overview') {
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
    else if (pathName === '/product') {
        const productDataByID = cardsData.find(el => el.id === +query.id);
        const productPageHTML = replaceTemplate(templateProduct, productDataByID);
        response.writeHead(200, {
            'Content-Type': 'text/html'
        })
        response.end(productPageHTML);
    }
    // API
    else if (pathName === '/api') {
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