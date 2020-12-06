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

function cartItemClickListener(event) {
  const li = event.target;
  li.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchId = async (id) => {
  const apiRequest = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const body = await apiRequest.json();
  const li = document.querySelector('.cart__items');
  li.appendChild(createCartItemElement(body));
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
    await fetchId(getSkuFromProductItem(parent));
  });
  section.appendChild(button);

  return section;
}

const request = async () => {
  const apiUrl = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResults = await apiUrl.json();
  const result = jsonResults.results;
  const itemsList = document.querySelector('.items');
  result.forEach((products) => {
    const { id, title, thumbnail } = products;
    const product = { sku: id, name: title, image: thumbnail };
    itemsList.appendChild(createProductItemElement(product));
  });
};

window.onload = function onload() {
  request();
};
