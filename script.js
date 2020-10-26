window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const setOrRemoveItemLocalStorage = (state, item, id) => {
  if (state === 'add') {
    localStorage.setItem(id, JSON.stringify(item));
  } else if (state === 'remove') {
    localStorage.removeItem(id, JSON.stringify(item));
  }
};

function cartItemClickListener(event, item, id) {
  const removeItem = (event.path)[0];
  const ol = document.querySelector('.cart__items');
  ol.removeChild(removeItem);
  setOrRemoveItemLocalStorage('remove', item, id);
}

function createCartItemElement({ sku, name, salePrice }) {
  const item = { sku, name, salePrice };
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => cartItemClickListener(event, item, sku));

  return li;
}

async function sumPrice(priceItem, price = 0) {
  // console.log(priceItem);
  sum = parseFloat(priceItem) + parseFloat(price);
  sum = parseFloat((sum).toFixed(2));
  // console.log(price);
  // console.log(sum);
  return sum;
}

async function returnPrice(priceItem) {
  const itemPrice = document.querySelector('.total-price');
  const calculationPrice = await sumPrice(priceItem, Number(itemPrice.innerHTML));
  itemPrice.innerHTML = calculationPrice;
}

const getItemLocalStorage = () => {
  const listItemsStorage = Object.values(localStorage);
  listItemsStorage.forEach((item) => {
    const { sku, name, salePrice } = JSON.parse(item);
    const createdcart = createCartItemElement({ sku, name, salePrice });
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createdcart);
  });
};

const itemRequisition = (ids) => {
  const endPointProduct = `https://api.mercadolibre.com/items/${ids}`;
  const loading = document.querySelector('.loading');
  fetch(endPointProduct)
  .then(loading.innerHTML = 'Loading...')
    .then((object) => {
      loading.innerHTML = '';
      return object.json();
    })
    .then((product) => {
      const { id: sku, title: name, price: salePrice } = product;
      const item = { sku, name, salePrice };
      const createItem = createCartItemElement(item);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createItem);
      returnPrice(salePrice);
      setOrRemoveItemLocalStorage('add', item, sku);
    });
};

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.addEventListener('click', () => itemRequisition(sku));
  }
  return e;
}

async function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

const getInformation = async (information) => {
  const informationSummary = {
    sku: information[1].id,
    name: information[1].title,
    image: information[1].thumbnail,
  };
  const items = document.querySelector('.items');
  const product = await createProductItemElement(informationSummary);
  items.appendChild(product);
};

const fetchMercadoLivre = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const responseEntries = Object.entries(object.results);
      responseEntries.forEach(item => getInformation(item));
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const removeCart = () => {
  const ol = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  ol.innerHTML = '';
  totalPrice.innerHTML = 0;
  localStorage.clear();
};

window.onload = function onload() {
  fetchMercadoLivre();
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', removeCart);
  getItemLocalStorage();
};
