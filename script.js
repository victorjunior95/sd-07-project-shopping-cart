const number = [];

const save = () => {
  const cart = document.querySelector('.cart__items');
  const cost = document.querySelector('.cost');
  localStorage.setItem('products', cart.innerHTML);
  localStorage.setItem('cost', cost.innerText);
};

const attPrice = () => {
  const cost = document.querySelector('.cost');
  const listCart = document.querySelectorAll('.cart__item');
  listCart.forEach((item, index) => {
    item.addEventListener('click', () => {
      number.splice(index, 1);
      let cont = 0;
      number.forEach((item1) => {
        cont += item1;
      });
      cost.innerHTML = cont.toFixed(2);
      save();
    });
  });
};
const sumPrice = (price) => {
  number.push(price);
  if (number.length !== 0) {
    let cont = 0;
    number.forEach((item) => {
      cont += item;
    });
    const result = cont.toFixed(2);
    return result;
  }
  return 0;
};


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

const load = () => {
  const cost = document.querySelector('.cost');
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('products');
  cost.innerText = localStorage.getItem('cost');
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

const addCart = (product) => {
  const cost = document.querySelector('.cost');
  const { id, title, price } = product;
  const obj = { sku: id, name: title, salePrice: price };
  document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
  cost.innerHTML = sumPrice(price);
  attPrice();
  save();
};
const addProduct = async (sku) => {
  const endPoint = `https://api.mercadolibre.com/items/${sku}`;
  try {
    const response = await fetch(endPoint);
    const object = await response.json();
    if (!object) {
      throw new Error('Erro');
    } else {
      addCart(object);
    }
  } catch (err) {
    window.alert(err);
  }
};
const addCartItemListener = () => {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((item, index) => {
    item.addEventListener('click', () => {
      addProduct(getSkuFromProductItem(document, [index]));
    });
  });
};

const allList = (items) => {
  items.forEach((item) => {
    const sectionList = document.querySelector('.items');
    const { id, title, thumbnail } = item;
    const obj = { sku: id, name: title, image: thumbnail };
    sectionList.appendChild(createProductItemElement(obj));
  });
  addCartItemListener();
};
const createList = async (search) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  wait(true);
  try {
    const response = await fetch(endPoint);
    const object = await response.json();

    if (object.results.length === 0) {
      throw new Error('Produto não encontrado');
    } else {
      allList(object.results);
      wait(false);
    }
  } catch (err) {
    window.alert(err);
  }
};

window.onload = function onload() {
  const clearCart = document.querySelector('.empty-cart');
  const clear = () => {
    const cost = document.querySelector('.cost');
    document.querySelector('.cart__items').innerHTML = '';
    cost.innerHTML -= cost.innerHTML;
    save();
  };
  createList('computador');
  clearCart.addEventListener('click', clear);
  load();
};
