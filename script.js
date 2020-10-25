window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const removeItem = (event.path)[0];
  const ol = document.querySelector('.cart__items');
  ol.removeChild(removeItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function sumPrice(priceItem, price = 0) {
  // console.log(priceItem);
  sum = (priceItem + parseFloat(price)).toFixed(2);
  // console.log(parseFloat(price));
  // console.log(sum);
  return sum;
}

async function returnPrice(priceItem) {
  const itemPrice = document.querySelector('.total-price');
  const calculationPrice = await sumPrice(priceItem, itemPrice.innerText);
  itemPrice.innerText = calculationPrice;
}

const itemRequisition = (ids) => {
  const endPointProduct = `https://api.mercadolibre.com/items/${ids}`;
  fetch(endPointProduct)
    .then(object => object.json())
    .then((product) => {
      const { id: sku, title: name, price: salePrice } = product;
      const item = createCartItemElement({ sku, name, salePrice });
      const ol = document.querySelector('.cart__items');
      ol.appendChild(item);
      returnPrice(salePrice);
    });
};

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.addEventListener('click', () => {
      itemRequisition(sku);
    });
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
};

window.onload = function onload() {
  fetchMercadoLivre();
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', removeCart);
};
