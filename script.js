const fetchData = async (endpoint) => {
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(event) {
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const itemClickListener = async (event) => {
  const cartList = document.querySelector('.cart__items');
  const sku = event.target.parentElement.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  try {
    const data = await fetchData(endpoint);
    cartList.appendChild(createCartItemElement(data));
  } catch (error) {
    console.log(error);
  }
};

const createItemClickListener = async () => {
  document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', itemClickListener);
  });
};

window.onload = async function onload() {
  const itemsList = document.querySelector('.items');
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const data = await fetchData(endpoint);
    data.results.forEach((item) => {
      itemsList.appendChild(createProductItemElement(item));
    });
  } catch (error) {
    console.log(error);
  }

  createItemClickListener();
};
