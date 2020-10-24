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

const addToCart = async (event) => {
  const id = event.target.parentNode.childNodes[0].innerText;
  const item = await fetch(`https://api.mercadolibre.com/items/${id}`).then(r => r.json());
  console.log(item);
  product = { sku: item.id, name: item.title, salePrice: item.price };
  const cartElement = createCartItemElement(product);
  cartElement.addEventListener('click', clicked => clicked.target.remove());
  appendSectionOnto(cartElement, 'ol.cart__items');
};

const handleAddToCart = () =>
  document.querySelectorAll('.item__add').forEach(element => element.addEventListener('click', addToCart));

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

window.onload = function onload() {
  grabItems('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};
