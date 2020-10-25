let cartItems = [];

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

const appendSectionOnto = (section, onto) => document.querySelector(onto).appendChild(section);

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
const updateCart = () => localStorage.setItem('cart', JSON.stringify(cartItems));
function cartItemClickListener(event) {
  cartItems.splice(cartItems.indexOf(event.target), 1);
  updateCart();
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addToCart = async (id) => {
  const item = await fetch(`https://api.mercadolibre.com/items/${id}`).then(r => r.json());
  const product = { sku: item.id, name: item.title, salePrice: item.price };
  const cartElement = createCartItemElement(product);
  cartElement.addEventListener('click', cartItemClickListener);
  cartItems.push(cartElement.innerHTML);
  updateCart();
  appendSectionOnto(cartElement, 'ol.cart__items');
};
const getIdAndSendToCart = event => addToCart(event.target.parentNode.childNodes[0].innerText);
const handleAddToCart = () =>
  document
    .querySelectorAll('.item__add')
    .forEach(element => element.addEventListener('click', getIdAndSendToCart));

const itemsToSection = (items) => {
  items.forEach(({ id, title, thumbnail }) => {
    const product = { sku: id, name: title, image: thumbnail };
    const section = createProductItemElement(product);
    appendSectionOnto(section, 'section.items');
  });
  handleAddToCart();
};

const grabItems = async (api) => {
  const items = await fetch(api)
    .then(r => r.json())
    .then(r => r.results);
  itemsToSection(items);
};

function populateWithStorage(items = []) {
  if (items) {
    cartItems = items;
    items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = item;
      li.className = 'cart__item';
      li.addEventListener('click', cartItemClickListener);
      appendSectionOnto(li, 'ol.cart__items');
    });
  }
}

window.onload = function onload() {
  populateWithStorage(JSON.parse(localStorage.getItem('cart')));
  grabItems('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};
