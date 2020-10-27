const showAlert = (message) => {
  window.alert(message);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, sku = null) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.dataset.id = sku;
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

const productOnScreen = (vector) => {
  const items = document.querySelector('.items');
  vector.forEach(product => items.appendChild(createProductItemElement(product)));
};
const fecthComputerAsyncAwait = async () => {
  const endpoints = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoints);
    const objekt = await response.json();
    if (objekt.error) {
      throw new Error(objekt.error);
    } else {
      productOnScreen(objekt.results);
    }
  } catch (error) {
    showAlert(error);
  }
};

function saveInLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

function goBackInsideCart() {
  const cartItems1 = document.querySelector('.cart__items');
  const cart = (localStorage.getItem('cartItems'));
  // const cart2 = (localStorage.getItem('cartItems'));
  if (cart) { cartItems1.innerHTML = cart; }
  // cart2.forEach((item) => {
  //   console.log(item);
  //   item.addEventListener('click', cartItemClickListener)});
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  saveInLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  saveInLocalStorage();
  return li;
}

function addCartListById(elementId) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(elementId));
}

const fecthIdAsyncAwait = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      addCartListById(object);
    }
  } catch (error) {
    showAlert(error);
  }
};
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function catchAllProductEvent() {
  const addCart = document.querySelectorAll('.item__add');
  addCart.forEach((element) => {
    element.addEventListener('click', (event) => {
      const idSku = event.target.dataset.id;
      fecthIdAsyncAwait(idSku);
    });
  });
}

window.onload = async function onload() {
  goBackInsideCart();
  await fecthComputerAsyncAwait();
  catchAllProductEvent();
};
