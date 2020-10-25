let cartsStorage = [];

let totalPrice = 0;

const storage = {
  get() {
    return JSON.parse(localStorage.getItem('store'));
  },
  save() {
    localStorage.setItem('store', JSON.stringify(cartsStorage));
  },
};

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

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const idLi = event.target.children[0].innerText;
  cartsStorage = cartsStorage.filter(id => id !== idLi);
  storage.save();
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: <span>${sku}</span> | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const handlerCartInHtml = (cart) => {
  const olItem = document.querySelector('.cart__items');
  const cartItem = {};
  cartItem.sku = cart.id;
  cartItem.name = cart.title;
  cartItem.salePrice = cart.price;

  cartsStorage.push(cart.id);
  storage.save(cartsStorage);

  const li = createCartItemElement(cartItem);
  olItem.appendChild(li);
};

const errorLog = (message) => {
  console.log(message);
};

const pricesTotal = (price) => {
  const totalPriceDiv = document.getElementsByClassName('total-price')[0];
  totalPrice += price;

  totalPriceDiv.innerText = totalPrice;
};

const fetchShoppingCart = async (id) => {
  try {
    const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const response = await api.json();

    handlerCartInHtml(response);
    await setInterval(pricesTotal(response.price), 1000);
  } catch (error) {
    errorLog(error);
  }
};

function addItemInStore(event) {
  const idCart = event.target.parentNode.children[0].innerText;

  fetchShoppingCart(idCart);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addItemInStore);
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const handlerCartsInHtml = (carts) => {
  carts.forEach((cart) => {
    const sessionItems = document.getElementsByClassName('items')[0];
    const cart1 = {};
    cart1.sku = cart.id;
    cart1.name = cart.title;
    cart1.image = cart.thumbnail;
    const session = createProductItemElement(cart1);
    sessionItems.appendChild(session);
  });
};

const loading = {
  add() {
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(createCustomElement('div', 'loading', 'Carregando'));
  },
  remove() {
    const body = document.getElementsByTagName('body')[0];
    const load = document.getElementsByClassName('loading')[0];
    body.removeChild(load);
  },
};

const fetchShoppingCarts = async (query = 'computador') => {
  try {
    loading.add();
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const response = await api.json();
    loading.remove();
    handlerCartsInHtml(response.results);
  } catch (error) {
    errorLog(error);
  }
};

const addEventEmptyCarts = () => {
  const buttonEmptyCart = document.getElementsByClassName('empty-cart')[0];

  buttonEmptyCart.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
};

window.onload = function onload() {
  fetchShoppingCarts();

  if (storage.get()) {
    cartsStorage = [];
    const getCartsStorage = storage.get();

    getCartsStorage.forEach(id => fetchShoppingCart(id));
  }

  addEventEmptyCarts();
};
