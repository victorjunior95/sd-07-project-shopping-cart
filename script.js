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

function calculateSumOfValues(newList) {
  return new Promise((resolve) => {
    const auxArray = [];
    newList.forEach(item => auxArray.push(item.salePrice));
    const value = (auxArray.reduce((acc, current) => acc + current, 0));
    resolve(value);
  });
}

async function sumCart() {
  const totalCartElement = document.querySelector('.total-price');
  const arrayStorage = JSON.parse(localStorage.getItem('cart'));
  const sum = await calculateSumOfValues(arrayStorage);
  totalCartElement.innerText = sum;
}

function addCartItemToLStorage({ sku, name, salePrice }) {
  const arrayStorage = JSON.parse(localStorage.getItem('cart'));
  arrayStorage.push({ sku, name, salePrice });
  localStorage.setItem('cart', JSON.stringify(arrayStorage));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const arrayStorage = JSON.parse(localStorage.getItem('cart')) || [];
  const arraySku = arrayStorage.map(itemCart => itemCart.sku);
  const elementId = event.target.dataset.sku;
  const indexToRemove = arraySku.indexOf(elementId);
  arrayStorage.splice(indexToRemove, 1);
  localStorage.clear();
  localStorage.setItem('cart', JSON.stringify(arrayStorage));
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  sumCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.sku = sku;
  return li;
}

function loadAllElementsInCart(arrayOfCartItems) {
  const cartList = document.querySelector('.cart__items');
  arrayOfCartItems.forEach((item) => {
    const li = createCartItemElement(item);
    cartList.appendChild(li);
  });
}

function reloadCartFromLStorage() {
  const recoveryLStorageArray = JSON.parse(localStorage.getItem('cart'));
  if (localStorage.getItem('cart')) {
    loadAllElementsInCart(recoveryLStorageArray);
  } else {
    const newArray = [];
    localStorage.setItem('cart', JSON.stringify(newArray));
    loadAllElementsInCart(newArray);
  }
}

const requestProductToCart = (event) => {
  const item = event.target.parentNode;
  const itemId = getSkuFromProductItem(item);
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const ordenedList = document.querySelector('.cart__items');

  fetch(endpoint).then(res => res.json().then((data) => {
    const { id: sku, title: name, price: salePrice } = data;
    const itemCart = createCartItemElement({ sku, name, salePrice });
    ordenedList.appendChild(itemCart);
    addCartItemToLStorage({ sku, name, salePrice });
    sumCart();
  }));
};

const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(endpoint).then(res => res.json().then((content) => {
    const itensContent = document.querySelector('.items');
    content.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      item.querySelector('.item__add').addEventListener('click', requestProductToCart);
      itensContent.appendChild(item);
    });
  }));
};

window.onload = function onload() {
  loadProducts();
  reloadCartFromLStorage();
};
