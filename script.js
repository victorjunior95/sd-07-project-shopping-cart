window.onload = function onload() {};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  console.log(endpoint);
  const shoppingCart = document.querySelector('.shopping_cart');
  await fetch(endpoint)
  .then(response => response.json())
  .then(item => shoppingCart.appendChild(createCartItemElement(item)));
}

function createCustomElement(element, className, innerText, id, test) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (id !== undefined) e.id = id;
  if (test === 0) {
    e.addEventListener('click', function () {
      addToCart(e.id);
    });
  }
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', id, 0));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) { //esse é para tirar o item do cart?
//   // coloque seu código aqui
// }

async function itemsGenerator(event) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${event}`;
  const list = await fetch(endpoint)
    .then(response => response.json())
    .then(object => object.results);
  list.forEach((product) => {
    const filho = createProductItemElement(product);
    const pai = document.getElementsByClassName('items')[0];
    pai.appendChild(filho);
  });
}

itemsGenerator('computador');
