
const identifyIdNameAndPrice = (item) => {
  const firstComma = item.indexOf(',');
  const id = item.slice(0, firstComma);
  const newString = item.slice((firstComma + 1), (item.length));
  const secondComma = newString.indexOf(',');
  const name = newString.slice(0, (secondComma));
  const price = newString.slice((secondComma + 1), newString.length);
  let itemData = [id, name, price];
  return itemData;
};

const selectTotalPrice = () => {
  let totalPrice = document.querySelector('.total-price').innerText;
  totalPrice = parseFloat(totalPrice.slice(16, (totalPrice.length)), 10);
  return totalPrice;
};

async function totalPriceInnerText(price) {
  document.querySelector('.total-price').innerText = await `Preço total: R$ ${price}`;
};

const removeLastItem = (string) => {
  if (string[string.length - 1] === '0' || string[string.length - 1] === '.') {
    string = string.slice(0, (string.length - 1))
  };
  return string;
};

const removeZero = (string) => {
  if (string[0] === '0') {
    string = '0';
    return string;
  }
  string = removeLastItem(string);
  string = removeLastItem(string);
  string = removeLastItem(string);
  return string;
};

const roundNumber = (string) => {
  stringNumber = string.toFixed(2);
  let number = removeZero(stringNumber);
  return number;
};

async function discountTotalPrice(price) {
  let totalPrice = selectTotalPrice();
  if (typeof price === 'string') price = parseFloat(price, 10);
  totalPrice -= price;
  if (totalPrice >= 0) {
    totalPrice = roundNumber(totalPrice);
    await totalPriceInnerText(totalPrice);
  }
};

const removeItemFromLocalStorage = (id) => {
  const cartItens = Object.entries(localStorage);
  cartItens.forEach((item) => {
    const itemKey = item[0];
    const itemData = identifyIdNameAndPrice(item[1]);
    const [itemId, name, price] = itemData;
    if (itemId === id) {
      localStorage.removeItem(`${itemKey}`);
      discountTotalPrice(price);
    };
  });
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target.innerText;
  const idFirstLetter = item.indexOf('M');
  const idLastNumber = item.indexOf('|');
  const id = item.slice(idFirstLetter, (idLastNumber -1));
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

async function addTotalPrice(price) {
  let totalPrice = selectTotalPrice();
  if (typeof price === 'string') price = parseFloat(price, 10);
  totalPrice += price;
  totalPrice = roundNumber(totalPrice);
  await totalPriceInnerText(totalPrice);
};

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  removeItemFromLocalStorage(sku);
  putItemInLocalStorage(sku, name, salePrice);
  addTotalPrice(salePrice);
  return li;
}

const convertRequestToJSON = (url) => {
  const conversion = fetch(url).then(response => response.json());
  return conversion;
};
/*
const cartInitialPrice = () => {
  const cartItens = Object.values(localStorage);
  cartItens.forEach((item) => {
    if (item.length > 10) {
      const itemData = identifyIdNameAndPrice(item);
      const [id, name, price] = itemData;
      console.log(price);
      addTotalPrice(price);
    };
  })
}; */

const recoverCart = () => {
  const cartItems = Object.values(localStorage);
  cartItems.forEach((item) => {
    if (item.length > 10) {
      const itemData = identifyIdNameAndPrice(item);
      const [id, name, price] = itemData;
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
