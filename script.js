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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getElementItems(product) {
  const section = document.querySelector('.items');
  section.appendChild(createProductItemElement(product));
}

function priceAndSignal(price, signal) {
  const totalHtml = (document.querySelector('.total-price'));
  const total = Number(totalHtml.innerText);
  if (signal === 'positive') {
    totalHtml.innerText = (total + price).toFixed(2);
  } if (signal === 'negative') {
    totalHtml.innerText = (total - price).toFixed(2);
  }
}

async function cartItemClickListener(event) {
  const listPrice = event.target.innerText.indexOf('$');
  const priceFinal = event.target.innerText.slice(listPrice + 1);
  priceAndSignal(priceFinal, 'negative');
  event.target.remove();
}

function deleteAll() {
  const eraseAll = document.querySelector('.empty-cart');
  eraseAll.addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
    document.querySelector('.total-price').innerText = 0;
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getItem(produto) {
  const item = document.querySelector('.cart__items');
  item.appendChild(createCartItemElement(produto));
}

function convertId(id) {
  const idList = `https://api.mercadolibre.com/items/${id}`;
  fetch(idList)
  .then(respond => (respond.json()))
  .then((objeto) => {
    const product = {
      sku: objeto.id,
      name: objeto.title,
      salePrice: objeto.price,
    };
    priceAndSignal(objeto.price, 'positive');
    getItem(product);
  });
}

function getId(event) { // 2 - segunda funcao
  const id = getSkuFromProductItem(event.target.parentNode);
  convertId(id);
}

function callButton() { // 2 - primeira funcao
  const getButton = document.querySelectorAll('.item__add');
  getButton.forEach((botao) => {
    botao.addEventListener('click', getId);
  });
}

function getApiList() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(endPoint)
  .then(respond => respond.json())
  .then(objeto => Object.entries(objeto.results).forEach((element) => {
    const product = {
      sku: element[1].id,
      name: element[1].title,
      image: element[1].thumbnail,
    };
    getElementItems(product);
    callButton();
  }));
}

window.onload = function onload() {
  getApiList();
  priceAndSignal();
  deleteAll();
};
