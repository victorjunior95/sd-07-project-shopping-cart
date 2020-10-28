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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function setLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('Carrinho de Compras', cartItems.innerHTML);
}

function getLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.getItem('Carrinho de Compras')) {
    cartItems.innerHTML = localStorage.getItem('Carrinho de Compras');
  }
}

function cartItemClickListener(event) {
  const selectedItem = event.target;
  const parent = document.querySelector('.cart__items');
  parent.removeChild(selectedItem);
  setLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const fetchCartList = (event) => {
  const cartItems = document.querySelector('.cart__items');
  const itemParent = event.target.parentNode;
  const itemId = itemParent.querySelector('.item__sku').innerText;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;

  fetch(endpoint)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const data = {
        sku,
        name,
        salePrice,
      };
      cartItems.appendChild(createCartItemElement(data));
      setLocalStorage();
    });
};

const addButton = () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach(element => element.addEventListener('click', fetchCartList));
};
const fetchProductsList = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const items = document.querySelector('.items');
    if (object.error) {
      throw new Error('Erro!');
    } else {
      object.results.forEach(result => items.appendChild(createProductItemElement(result)));
    }
  } catch (error) {
    showAlert(error);
  }
};

function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.clear();
}

window.onload = async function onload() {
  await fetchProductsList();
  addButton();
  getLocalStorage();

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', clearCart);
};
