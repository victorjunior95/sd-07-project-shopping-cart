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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  const cartItem = event.target;
  cartItem.parentElement.removeChild(cartItem);
}

function appendItemToCart(object) {
  const cartItem = createCartItemElement(object);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(cartItem);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleProducts(products) {
  const items = document.querySelector('.items');
  products.forEach((product) => {
    const newItem = createProductItemElement(product);
    items.appendChild(newItem);
  });
}

async function addToCart(event) {
  const QUERY = event.target.parentElement.firstChild.innerHTML;
  const endpoint = `https://api.mercadolibre.com/items/${QUERY}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      appendItemToCart(object);
    }
  } catch (error) {
    showAlert(error);
  }
}

function createAddToCartEventListener() {
  const items = document.querySelectorAll('.item__add');
  items.forEach((button) => {
    button.addEventListener('click', addToCart);
  });
}

window.onload = async function onload() {
  const QUERY = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      handleProducts(object.results);
      createAddToCartEventListener();
    }
  } catch (error) {
    showAlert(error);
  }
};
