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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


const addItensInHTML = async () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const resultOfFetchAPI = await fetch(endPoint);
  const objectWithAllInformationFetch = await resultOfFetchAPI.json();
  const arrayResultsOfJsonObject = objectWithAllInformationFetch.results;
  const objectToFunctionCreateProductItemElement = {};
  const sectionItems = document.querySelector('.items');

  arrayResultsOfJsonObject.forEach((item) => {
    objectToFunctionCreateProductItemElement.sku = item.id;
    objectToFunctionCreateProductItemElement.name = item.title;
    objectToFunctionCreateProductItemElement.image = item.thumbnail;

    sectionItems.appendChild(createProductItemElement(objectToFunctionCreateProductItemElement));
  });
};

const addItemIntoCar = () => {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', async (event) => {
    const btnClicked = event.target;
    const itemIdSelected = btnClicked.closest('.item').firstChild.innerText;
    const endPoint = `https://api.mercadolibre.com/items/${itemIdSelected}`;
    const resultEndPoint = await fetch(endPoint);
    const parseResultEndPointToJSON = await resultEndPoint.json();
    const objectToFunctionCreateCartItemElement = {
      sku: parseResultEndPointToJSON.id,
      name: parseResultEndPointToJSON.title,
      salePrice: parseResultEndPointToJSON.price,
    };
    const li = createCartItemElement(objectToFunctionCreateCartItemElement);
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
  });
};

window.onload = function onload() {
  addItensInHTML();
  addItemIntoCar();
};
