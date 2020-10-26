let totalPrice = 0;

function createLoading() {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = 'loading';
  const body = document.querySelector('body')
  body.appendChild(loading);
}

function loadingDestruction() {
  const loading = document.querySelector('.loading');
  const body = document.querySelector('body');
  body.removeChild(loading);
}

function changeLoadingDisplay(displayThatYouWant) {
  const loading = document.querySelector('.loading');
  loading.style.display = displayThatYouWant;
}

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const itemPrice = event.target.innerHTML.split('$')[1];
  totalPrice -= itemPrice;
  document.querySelector('.total-price p').innerHTML = `${Math.abs(
    totalPrice,
  )}`;
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  totalPrice += price;
  document.querySelector(
    '.total-price p',
  ).innerHTML = `${totalPrice}`;
  return li;
}

const fetchItemList = async (sku) => {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  try {
    createLoading();
    const response = await fetch(endpoint);
    const item = await response.json();
    const li = createCartItemElement(item);
    const cartList = document.querySelector('.cart__items');
    cartList.appendChild(li);
    loadingDestruction();
  } catch (error) {
    window.alert(error);
  }
};

const buttonEventListener = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const father = event.target.parentElement;
      const id = getSkuFromProductItem(father);
      fetchItemList(id);
    });
  });
};

const fetchProductsList = async (category) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${category}`;
  try {
    createLoading();
    const response = await fetch(endpoint);
    const object = await response.json();
    const itemsArray = await object.results;
    await itemsArray.forEach((element) => {
      const newElement = createProductItemElement(element);
      const newFather = document.querySelector('.items');
      newFather.appendChild(newElement);
    });
    buttonEventListener();
    loadingDestruction();
  } catch (error) {
    window.alert(error);
  }
};

window.onload = function onload() {
  fetchProductsList('computador');
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    cartList.innerHTML = '';
    totalPrice = 0;
    document.querySelector(
      '.total-price p',
    ).innerHTML = `${totalPrice}`;
  });
};
