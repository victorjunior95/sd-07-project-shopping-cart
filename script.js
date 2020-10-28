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

const saveInLocalStorage = () => {
  const ol = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartList', JSON.stringify(ol));

  const totalPrice = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
};

const sumPrice = async () => {
  const lis = document.querySelectorAll('.cart__item');
  const resultElement = document.querySelector('.total-price');
  const nodeListForArr = Array.from(lis);

  const sum = nodeListForArr.reduce((total, li) => {
    const liValue = li.innerText;
    const arrOfValue = liValue.split('$');
    return total + Number(arrOfValue[1]);
  }, 0);

  resultElement.innerText = sum;
  // resultElement.innerText = sum.toFixed(2);

  saveInLocalStorage();
};

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const li = event.target;
  ol.removeChild(li);

  await sumPrice();
  saveInLocalStorage();
}
// Thiago Pederzolli JSON

const loadLocalStorage = () => {
  let jsonList = localStorage.getItem('cartList');
  jsonList = JSON.parse(jsonList);

  const ol = document.querySelector('.cart__items');

  ol.innerHTML = jsonList;

  const lis = document.querySelectorAll('li');

  lis.forEach(li => li.addEventListener('click', cartItemClickListener));

  const totalPrice = document.querySelector('.total-price');

  let sumResult = localStorage.getItem('totalPrice');
  sumResult = JSON.parse(sumResult);

  totalPrice.innerHTML = sumResult;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint).then(response => response.json()).then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
    });
  });
};

window.onload = function onload() {
  loadProducts();
};
