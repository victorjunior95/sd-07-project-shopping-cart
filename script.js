window.onload = function onload() { };

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

const totalPrice = () => {
  const ol = document.querySelector('.cart');
  const div = createCustomElement('div', 'total-price', 'Preço total');
  return ol.appendChild(div);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);

  saveItemLocalStorage();
}

const saveItemLocalStorage = () => {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('saveOl', ol.innerHTML);
};

const recoverItemLocalStorage = () => {
  const olItems = document.querySelector('.cart__items');
  olItems.innerHTML = localStorage.getItem('saveOl');
  const li = document.querySelectorAll('li');
  li.forEach(element => element.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const convertId = (itemId) => {
  const getList = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then(response => response.json())
  .then((object) => {
    getList.appendChild(createCartItemElement(object));
    saveItemLocalStorage();
  });

};

const clickButton = (event) => {
  const selectedItemParent = event.target.parentElement;
  convertId(getSkuFromProductItem(selectedItemParent));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', clickButton);

  return section;
}

const getList = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint).then(response => response.json()).then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
    });
  });
};

window.onload = function onload() {
  getList();
  totalPrice();
  recoverItemLocalStorage ();
};
