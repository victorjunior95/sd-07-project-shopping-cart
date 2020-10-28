
const container = document.createElement('div');
const loading = document.createElement('h1');
loading.className = 'loading';
loading.innerText = 'loading...';
const wait = (event) => {
  if (event) {
    document.querySelector('.items').appendChild(container);
    container.appendChild(loading);
  } else {
    loading.remove();
  }
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const save = () => {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('products', cart.innerHTML);
};

const load = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('products');
};

function getSkuFromProductItem(item, index) {
  return item.querySelectorAll('span.item__sku')[index].innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  save();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const everyList = (items) => {
  const sectionList = document.querySelector('.items');
  items.forEach((item) => {
    const { id, title, thumbnail } = item;
    const obj = { sku: id, name: title, image: thumbnail };
    sectionList.appendChild(createProductItemElement(obj));
  });
};
const createList = async (search) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  wait(true);
  try {
    const response = await fetch(endPoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      wait(false);
      everyList(object.results);
    }
  } catch (err) {
    window.alert(err);
  }
};

const addCart = (product) => {
  const { id, title, price } = product;
  const cart = document.querySelector('.cart__items');
  const obj = { sku: id, name: title, salePrice: price };
  cart.appendChild(createCartItemElement(obj));
  save();
};

const addProduct = async (sku) => {
  const endPoint = `https://api.mercadolibre.com/items/${sku}`;

  try {
    const response = await fetch(endPoint);
    const object = await response.json();
    if (!object) {
      throw new Error(object.error);
    } else {
      addCart(object);
    }
  } catch (err) {
    window.alert(err);
  }
};
setTimeout(() => {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((item, index) => {
    item.addEventListener('click', () => {
      addProduct(getSkuFromProductItem(document, [index]));
    });
  });
}, 500);

window.onload = function onload() {
  const clearCart = document.querySelector('.empty-cart');
  const clear = () => {
    document.querySelector('.cart__items').innerHTML = '';
    save();
  };
  createList('computador');
  clearCart.addEventListener('click', clear);
  load();
};
