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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const errorLog = (message) => {
  console.log(message);
};

const handlerCartsInHtml = (carts) => {
  carts.forEach((cart) => {
    const sessionItems = document.getElementsByClassName('items')[0];
    const cart1 = {};
    cart1.sku = cart.id;
    cart1.name = cart.title;
    cart1.image = cart.thumbnail;
    const session = createProductItemElement(cart1);
    sessionItems.appendChild(session);
  });
};

const fetchShoppingCart = async (query = 'computador') => {
  try {
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const { results } = await api.json();

    handlerCartsInHtml(results);
  } catch (error) {
    errorLog(error);
  }
};

window.onload = function onload() {
  fetchShoppingCart();
};
