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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

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

//-----------------------------------------------------------------------

const putOnCart = (data) => {
  const listCart = document.querySelector('.cart__items');
  const obj = {};
  obj.sku = data.id;
  obj.name = data.title;
  obj.salePrice = data.price;
  const product = createCartItemElement(obj);
  listCart.appendChild(product);
};

const fetchItem = (itemID) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  // prettier-ignore
  fetch(endpoint)
    .then(response => response.json())
    .then(data => putOnCart(data));
};

const buttonID = () => {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = event.target.parentElement.firstChild.innerText;
      fetchItem(id);
    });
  });
};

//-----------------------------------------------------------------------

const putResults = (data) => {
  const sectionItem = document.querySelector('.items');
  const obj = {};
  data.forEach((element) => {
    obj.sku = element.id;
    obj.name = element.title;
    obj.image = element.thumbnail;
    const product = createProductItemElement(obj);
    sectionItem.appendChild(product);
  });
};

const fetchMercado = () => {
  const endpoint =
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  // prettier-ignore
  fetch(endpoint)
    .then(response => response.json())
    .then(data => putResults(data.results))
    .then(() => buttonID());
};

//-----------------------------------------------------------------------

window.onload = async function onload() {
  fetchMercado();
};
