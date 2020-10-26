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

function cartItemClickListener(e) {
  // coloque seu código aqui
  const cartItem = e.srcElement.innerText;
  const cartList = e.srcElement.parentElement.children;

  for (let i = 0; i < cartList.length; i += 1) {
    if (cartList[i].innerText === cartItem) {
      cartList[i].remove();
    }
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(itemId) {
  const API_URL = `https://api.mercadolibre.com/items/${itemId}`;
  console.log(API_URL);

  fetch(API_URL)
    .then(object => object.json())
    .then((item) => {
      const itemCart = {
        sku: item.id,
        name: item.title,
        salePrice: item.price,
      };
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement(itemCart));
    });
}

function selectingItemToCart(e) {
  const itemSelected = e.srcElement.parentNode;
  const skuItem = itemSelected.querySelector('.item__sku');
  addToCart(skuItem.innerText);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const newButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(newButton);
  newButton.addEventListener('click', selectingItemToCart);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const getAllProducts = () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(API_URL)
    .then(object => object.json())
    .then((element) => {
      const { results } = (element);
      results.forEach((result) => {
        const items = document.querySelector('.items');
        const objectResult = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };
        items.appendChild(createProductItemElement(objectResult));
      });
    });
};

function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerText = '';
}

window.onload = function onload() {
  getAllProducts();

  const emptyCartButton = document.querySelector('.empty-cart');

  emptyCartButton.addEventListener('click', emptyCart);
};
