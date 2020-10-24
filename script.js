let carts = [];

const storage = {
  get() {
    return JSON.parse(localStorage.getItem('store'));
  },
  save() {
    localStorage.setItem('store', JSON.stringify(carts));
  }
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

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const idLi = event.target.children[0].innerText;
  carts = carts.filter(id => id !== idLi);
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
  const cart1 = {};
  cart1.sku = cart.id;
  cart1.name = cart.title;
  cart1.salePrice = cart.price;
  carts.push(cart.id);
  storage.save(carts);
  const li = createCartItemElement(cart1);
  olItem.appendChild(li);
};

const errorLog = (message) => {
  console.log(message);
};

const fetchShoppingCart = async (id) => {
  try {
    const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const response = await api.json();

    handlerCartInHtml(response);
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

const fetchShoppingCarts = async (query = 'computador') => {
  try {
    // https://api.mercadolibre.com/items/$ItemID
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const response = await api.json();

    handlerCartsInHtml(response.results);
  } catch (error) {
    errorLog(error);
  }
};


window.onload = function onload() {
  fetchShoppingCarts();

  if (storage.get()) {
    carts = [];
    const cartsStorage = storage.get();

    cartsStorage.forEach(id => fetchShoppingCart(id));
  }
};
