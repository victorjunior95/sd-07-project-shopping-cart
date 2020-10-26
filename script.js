
const removeItemFromLocalStorage = (id) => {
  const cartItens = Object.entries(localStorage);
  cartItens.forEach((item) => {
    const itemKey = item[0];
    const itemId = item[1].slice(0, 13);
    if (itemId === id) localStorage.removeItem(`${itemKey}`);
  });
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const id = event.target.innerText.slice(5, 18);
  removeItemFromLocalStorage(id);
  event.target.remove();
}

const putItemInLocalStorage = (id, name, price) => {
  if (localStorage.getItem('counter') === null) localStorage.setItem('counter', 0);
  let counter = localStorage.getItem('counter');
  counter = parseInt(counter, 10) + 1;
  localStorage.setItem('counter', counter);
  localStorage.setItem(`cartItem${counter}`, [id, name, price]);
};

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  removeItemFromLocalStorage(sku);
  putItemInLocalStorage(sku, name, salePrice);
  return li;
}

const convertRequestToJSON = (url) => {
  const conversion = fetch(url).then(response => response.json());
  return conversion;
};

const recoverCart = () => {
  const cartItems = Object.values(localStorage);
  cartItems.forEach((item) => {
    if (item.length > 10) {
      const id = item.slice(0, 13);
      const newString = item.slice(14, (item.length));
      const commaPosition = newString.indexOf(',');
      const name = newString.slice(0, (commaPosition));
      const price = newString.slice((commaPosition + 1), newString.length);
      const cartItem = createCartItemElement(id, name, price);
      document.querySelector('.cart__items').appendChild(cartItem);
    }
  });
};

const addRequestToHTMLClass = (request, callback, HTMLClass) => {
  const { id, title, price, thumbnail } = request;
  let imgOrPrice = price;
  if (HTMLClass.length < 10) imgOrPrice = thumbnail;
  const item = callback(id, title, imgOrPrice);
  document.querySelector(`${HTMLClass}`).appendChild(item);
};

const addItemToCart = (element) => {
  const idNumber = element.previousSibling.previousSibling.previousSibling.innerText;
  convertRequestToJSON(`https://api.mercadolibre.com/items/${idNumber}`)
    .then((response) => {
      addRequestToHTMLClass(response, createCartItemElement, '.cart__items');
    });
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

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', function () {
    addItemToCart(event.target);
  });
  section.appendChild(button);

  return section;
}

const createItens = () => {
  convertRequestToJSON('https://api.mercadolibre.com/sites/MLB/search?q=cumputador')
    .then(response => response.results.forEach((computer) => {
      addRequestToHTMLClass(computer, createProductItemElement, '.items');
    }),
    );
};

window.onload = function onload() {
  recoverCart();
  createItens();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
