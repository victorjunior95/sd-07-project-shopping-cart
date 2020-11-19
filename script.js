function setStorage() {
  localStorage.clear();
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('Cart', cartList);
  console.log(cartList);
}

function getStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('Cart');
}

function cartItemClickListener(event) {
  const li = event.target;
  li.remove();
  setStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchItemByID = async (id) => {
  const apiRequested = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const body = await apiRequested.json();
  const list = document.querySelector('.cart__items');
  list.appendChild(createCartItemElement(body));
  setStorage();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', async (event) => {
    const parent = await event.target.parentElement;
    await fetchItemByID(getSkuFromProductItem(parent));
  });
  section.appendChild(button);

  return section;
}

const request = async () => {
  const apiRequested = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonObject = await apiRequested.json();
  const results = jsonObject.results;
  const itemsSection = document.querySelector('.items');
  results.forEach((productList) => {
    const { id, title, thumbnail } = productList;
    const product = { sku: id, name: title, image: thumbnail };
    itemsSection.appendChild(createProductItemElement(product));
  });
};

window.onload = function onload() {
  getStorage();
  request();

  const emptyButton = document.querySelector('.empty-cart');
  const currentList = document.querySelector('.cart__items');
  emptyButton.addEventListener('click', () => {
    while (currentList.hasChildNodes()) {
      currentList.removeChild(currentList.firstChild);
    }
  });
};
