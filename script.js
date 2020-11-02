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
  event.target.remove()
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const fetchAddCart = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((data) => {
    const ListItems = document.querySelector('ol.cart__items');
    const { id: sku, title: name, price: salePrice } = data;
    const listItem = createCartItemElement({ sku, name, salePrice });
    ListItems.appendChild(listItem);
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  button.addEventListener('click', () => {
    const item = button.parentElement;
    fetchAddCart(getSkuFromProductItem(item));
  });
  return section;
}

const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((produto) => {
        const { id: sku, title: name, thumbnail: image } = produto;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    });
};

window.onload = function onload() {
  loadProducts();
};
