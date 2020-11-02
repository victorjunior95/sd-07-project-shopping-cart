
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

function cartItemClickListener(event = '') {
  // coloque seu código aqui
  const selectedItem = event.target;
  const selectedItemParent = document.querySelector('.cart__items');
  selectedItemParent.removeChild(selectedItem);
  alert('Item removido do carrinho.');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadItems() {
  const status = document.querySelector('.loading');
  status.innerText = 'loading...';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json()).then((data) => {
    const itemsPannel = document.querySelector('.items');
    data.results.forEach((result) => {
      const item = createProductItemElement(
        { sku: result.id, name: result.title, image: result.thumbnail });
      itemsPannel.appendChild(item);
    });
    document.querySelector('.loading').remove();
  });
}

function getCartItems() {
  const cartItems = localStorage.getItems('cartItems');
  const cart = document.querySelector('.cart__items');
  cartItems.forEach((item) => {
    cart.appendChild(item);
  });
}

window.onload = function onload() {
  loadItems();
};

addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    const selectedItemParent = event.target.parentElement;
    const ItemID = selectedItemParent.firstElementChild.innerText;
    const lista = document.querySelector('.cart__items');
    fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then(response => response.json()).then((results) => {
      const generetadeIl = createCartItemElement(
        { sku: results.id, name: results.title, salePrice: results.price });
      lista.appendChild(generetadeIl);
      alert('Item adicionado ao carrinho.');
    });
  }
  if (event.target.className === 'empty-cart') {
    const shoppingCart = document.querySelector('.cart__items');
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach((item) => { shoppingCart.removeChild(item); });
    alert('O carrinho está limpo');
  }
});

function saveCartItems() {
  const cartItems = document.querySelectorAll('.cart__item');
  localStorage.setItem('cartItems', cartItems);
}

window.onclose = function () {
  saveCartItems();
};
