window.onload = function onload() { };

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

function saveShoppingcar() {// Requisito 4 com ajuda dos plantões e etc.
  const shoppingCar = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('shoppingCar', shoppingCar);
}

function clearCart() {
  document.getElementsByClassName('cart__items')[0].innerHTML = '';
  saveShoppingcar();// Requisito 4
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  saveShoppingcar();// Requisito 4
}

  // Resolução com ajuda na turma 6, requisito 2
function includeItemcart(item) {
  const list = document.querySelector('.cart__items');
  list.appendChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Requisito 4
function addEventListenerForItemsLocalStorage(tagHtml, event) {
  const btns = document.querySelectorAll(tagHtml);
  btns.forEach((element) => {
    element.addEventListener('click', event);
  });
}
function calladdEventListener() {
  addEventListenerForItemsLocalStorage('.cart__item', cartItemClickListener);
}

function loadShoppingCar() {
  const shoppingCar = localStorage.getItem('shoppingCar');
  document.querySelector('.cart__items').innerHTML = shoppingCar;
  calladdEventListener();
}// Requisito 4

function ItemclickListener(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const item = createCartItemElement(object);
      includeItemcart(item);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', ItemclickListener);
  section.appendChild(button);
  return section;
}

// Aula 9.4 requisito 1
const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint).then(Response => Response.json()).then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach((produto) => {
      const { id: sku, title: name, thumbnail: image } = produto;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
      saveShoppingcar();
    });
  });
};

window.onload = function onload() {
  loadShoppingCar();
  loadProducts();
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearCart);
};
