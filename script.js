function storeCart() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

/*
function getSkuFromProductItem(item) {
  return event.target.parentNode.firstChild.innerText;
}
*/

function appendProducts(products) {
  const items = document.querySelector('.items');
  products.forEach((product) => {
    items.appendChild(
      createProductItemElement({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      }),
    );
  });
}

function addClickProducts(selector, action) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((element) => {
    element.addEventListener('click', action);
  });
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  storeCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const cartItems = document.querySelector('.cart__items');
  const productId = await fetch(
    `https://api.mercadolibre.com/items/${id}`,
  ).then(r => r.json());
  const objAdd = { sku: id, name: productId.title, salePrice: productId.price };
  cartItems.appendChild(createCartItemElement(objAdd));
  storeCart();
}

async function getProductsMl() {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  )
    .then(r => r.json())
    .then(data => data.results);
  return response;
}

async function addShowCase() {
  const data = await getProductsMl();
  appendProducts(data);
  addClickProducts('.item__add', addToCart);
}

function retrieveCart() {
  const cartStore = localStorage.getItem('cart');
  if (cartStore != null) {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = cartStore;
    addClickProducts('.cart__item', cartItemClickListener);
  }
}

window.onload = function onload() {
  retrieveCart();
  addShowCase();
};
