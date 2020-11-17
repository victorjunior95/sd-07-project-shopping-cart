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

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addInList(item) {
  document.getElementsByClassName('cart__items')[0].appendChild(item);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  buttonItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonItem.addEventListener('click', () => fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data => addInList(createCartItemElement(data))));
  section.appendChild(buttonItem);
  return section;
}

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}*/

function createElementFromAPI(itens) {
  itens.forEach((item) => {
    const newItem = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const itemCreated = createProductItemElement(newItem);
    document.getElementsByClassName('items')[0].appendChild(itemCreated);
  });
}

window.onload = function onload() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const myObject = { method: 'GET' };
  fetch(API_URL, myObject)
    .then(response => response.json())
    .then(data => createElementFromAPI(data.results));
};
