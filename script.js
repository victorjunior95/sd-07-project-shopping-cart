
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  document.querySelector
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener(sku));
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const productApiPrices = `https://api.mercadolibre.com/items/${sku}`;
  const buttonselected = section.querySelector('.item__add');
  buttonselected.addEventListener('click', () => {
    fetch(productApiPrices)
      .then((response) => {
        response.json()
          .then((data) => {
            document.querySelector('.cart__items')
              .appendChild(createCartItemElement(data.id, data.title, data.price));
          });
      });
  });

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;  
// }

function fetchSearch(product) {
  const productApiItems = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(productApiItems)
    .then((response) => {
      response.json().then((data) => {
        data.results.forEach((singPro) => {
          const productfetch = document.querySelector('.items');
          productfetch.appendChild(
            createProductItemElement(singPro.id, singPro.title, singPro.thumbnail));
        });
      });
    });
}


window.onload = function onload() {
  fetchSearch('computador');
};
