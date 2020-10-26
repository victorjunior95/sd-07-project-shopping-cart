function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const id = `.${event}`;
  const filho = document.querySelector(id);
  const pai = document.querySelector('.cart__items');
  pai.removeChild(filho);
  saveToStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = `cart__item ${id}`;
  // li.id = id + id;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', function () {
    cartItemClickListener(id);
  });
  return li;
}

// function saveToStorage() {
//   const list = document.querySelectorAll('.cart__item');
//   console.log(JSON.stringify(list));
//   window.localStorage.list = JSON.stringify(list);
//   // localStorage.setItem('list', JSON.stringify(list));
// }

// function loadFromStorage() {

// }

async function addToCart(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  const shoppingCart = document.querySelector('.cart__items');
  await fetch(endpoint)
  .then(response => response.json())
  .then((item) => {
    shoppingCart.appendChild(createCartItemElement(item));
  });
  saveToStorage();
}

function createCustomElement(element, className, innerText, id, test) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (id !== undefined) e.id = id;
  if (test === 0) {
    e.addEventListener('click', function () {
      addToCart(e.id);
    });
  }
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', id, 0));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function clearCartEvent() {
  console.log('rodou clear');
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', function () {
    console.log('pertou');
    document.querySelector('.cart__items').innerHTML = '';
    saveToStorage();
  });
}

window.onload = function onload() {
  async function itemsGenerator(event) {
    const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${event}`;
    const list = await fetch(endpoint)
      .then(response => response.json())
      .then(object => object.results);
    list.forEach((product) => {
      const filho = createProductItemElement(product);
      const pai = document.getElementsByClassName('items')[0];
      pai.appendChild(filho);
    });
  }
  loadFromStorage();
  clearCartEvent();
  itemsGenerator('computador');
};
