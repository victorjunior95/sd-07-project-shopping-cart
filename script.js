function createProductImageElement(newDivProduct, imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  newDivProduct.appendChild(img);
}

function createCustomElement(newDivProduct, element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  newDivProduct.appendChild(e);
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

const fetchCurrency = (currency) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${currency}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(data => data.results.forEach((item) => {
      // Criação de Div produto
      const classItems = document.querySelector('.items');
      const newDivProduct = document.createElement('div');
      newDivProduct.className = 'item';
      classItems.appendChild(newDivProduct);
      // Criação Title Produto
      createCustomElement(newDivProduct, 'p', 'item-title', item.title);
      // Criação img Produto
      createProductImageElement(newDivProduct, item.thumbnail);
    }))
    .catch(error => console.log(error));
};

window.onload = function onload() {
  fetchCurrency('computador');
};
