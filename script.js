function createProductImageElement(imageSource) {
    const img = document.createElement('img');
    img.className = 'item__image';
    img.src = imageSource;
    return img;
}

function createCustomElement(element, className, innerText) {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    return e;
}

function createProductItemElement({ sku, name, image }) {
    const section = document.createElement('section');
    section.className = 'item';

    section.appendChild(createCustomElement('span', 'item__sku', sku));
    section.appendChild(createCustomElement('span', 'item__title', name));
    section.appendChild(createProductImageElement(image));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    return section;
}

function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
    // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
}
const getFilteredProducts = () => {
    const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const itemsSection = document.querySelector('.items');
    fetch(endPoint)
        .then(response => response.json())
        .then(data => data.results.forEach((product) => {
            const newItemObject = {};
            newItemObject.sku = product.id;
            newItemObject.name = product.title;
            newItemObject.image = product.thumbnail;
            const itemToBeInserted = createProductItemElement(newItemObject);
            itemsSection.appendChild(itemToBeInserted);
        }));
};
// Uso de Fetch
// https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
// Consultei o repositório de Jéssica de Paula para criação desta função.
// https://github.com/tryber/sd-07-project-shopping-cart/pull/93
window.onload = function onload() {
    getFilteredProducts();
};
