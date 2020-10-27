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

const functionFetchJSON = async (endpoint, adaptFunction) => {
  try {
    const responseURL = await fetch(endpoint);
    const object = await responseURL.json();
    adaptFunction(object);
  } catch (Error) {
    alert(Error);
  }
};

function cartItemClickListener(event) {
  const li = document.querySelectorAll('.cart__item');
  li.forEach((itemCart) => {
    itemCart.addEventListener('click', () => {
      itemCart.remove();
    });
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const adaptJSONItem = (object) => {
  const cartItems = document.querySelector('.cart__items');
  const { id: sku, title: name, price: salePrice } = object;
  cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
  // cartItems.appendChild(item);
};

const addToCart = async (itemID) => {
  const endpointByID = `https://api.mercadolibre.com/items/${itemID}`;
  functionFetchJSON(endpointByID, adaptJSONItem);
};

const buttonAddToCart = () => {
  const allButtonsAddItem = document.querySelectorAll('.item__add');
  allButtonsAddItem.forEach((button) => {
    button.addEventListener('click', () => {
      const cartItem = button.parentNode.querySelector('.item__sku').innerText;
      addToCart(cartItem);
    });
  });
};

// forEach feito com a ajuda da resolução realizada pelo Vitor no fechamento do dia 26/10
const adaptJSONResponses = (object) => {
  const itemsElementHTML = document.querySelector('.items');
  object.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const item = createProductItemElement({ sku, name, image });
    itemsElementHTML.appendChild(item);
  });
  buttonAddToCart();
};

const fetchProducts = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  functionFetchJSON(endpoint, adaptJSONResponses);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  fetchProducts();
};
