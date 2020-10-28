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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function saveCart() {
  const arrayOfData = [];
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => arrayOfData.push(item.innerText));
  localStorage.setItem('Carrinho de Compras', JSON.stringify(arrayOfData));
}

function cartItemClickListener(event) {
  const itemSelected = event.target;
  const itemParent = document.querySelector('.cart__items');
  itemParent.removeChild(itemSelected);
  saveCart();
}

function reloadCart() {
  const cartList = document.querySelector('.cart__items');
  if (localStorage.getItem('Carrinho de Compras') !== 'undefined' || localStorage.getItem('Carrinho de Compras') !== 'null') {
    const newList = localStorage.getItem('Carrinho de Compras');
    const list = JSON.parse(newList);
    list.forEach((item) => {
      const newElement = document.createElement('li');
      newElement.addEventListener('click', cartItemClickListener);
      newElement.innerText = item;
      newElement.className = 'cart__item';
      cartList.appendChild(newElement);
    });
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoadingElement() {
  const cart = document.querySelector('.cart');
  const loadingElement = createCustomElement('span', 'loading', 'loading...');
  cart.appendChild(loadingElement);
}

function removeLoadingElement() {
  const cart = document.querySelector('.cart');
  const loadingElement = document.querySelector('.loading');
  cart.removeChild(loadingElement);
}

const getFilteredProducts = () => {
  const itemsSection = document.querySelector('.items');
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoadingElement();
  return fetch(endPoint)
    .then(response => response.json())
    .then(data => data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const itemToBeInserted = createProductItemElement({ sku, name, image });
      itemsSection.appendChild(itemToBeInserted);
    }))
    .then(removeLoadingElement());
};

const insertProductInCart = (event) => {
  const itemSelected = event.target.parentNode;
  const cartSection = document.querySelector('.cart__items');
  const idSelected = itemSelected.querySelector('.item__sku').innerText;
  const endPoint = `https://api.mercadolibre.com/items/${idSelected}`;
  createLoadingElement();
  fetch(endPoint)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const newItemCart = {
        sku,
        name,
        salePrice,
      };
      const itemToBeInsertedInCart = createCartItemElement(newItemCart);
      cartSection.appendChild(itemToBeInsertedInCart);
      saveCart();
    })
    .then(removeLoadingElement);
};

function getClickForCart() {
  const productButton = document.querySelectorAll('.item__add');
  productButton.forEach((item) => {
    item.addEventListener('click', insertProductInCart);
  });
}

function clearCart() {
  const cartList = document.querySelector('.cart__items');
  if (cartList.childNodes.length !== 0) {
    cartList.innerHTML = '';
    localStorage.clear();
  }
}

function loadClearButton() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
}

/* function sumTotalCart() {
  const newList = localStorage.getItem('Carrinho de Compras');
  const list = JSON.parse(newList);
  console.log(newList);
} */

window.onload = async function onload() {
  await getFilteredProducts();
  reloadCart();
  getClickForCart();
  loadClearButton();
  /* sumTotalCart(); */
};
