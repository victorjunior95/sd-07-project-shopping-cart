function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createLoadingElement() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  return loading;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const transformCartItemOnObject = (cartItem) => {
  const sku = /^SKU:\s(.*?)\s| /g.exec(cartItem.innerText)[1];
  const name = /NAME:\s(.*)(?=\s\|)/g.exec(cartItem.innerText)[1];
  const salePrice = /PRICE:\s\$(\d+(\.\d{1,2})*)$/g.exec(cartItem.innerText)[1];
  return { sku, name, salePrice };
};

const getCartItemsObjectList = () => {
  const cartItemsList = document.querySelectorAll('.cart__item');
  const cartItemsObjectList = [];
  if (cartItemsList.length > 0) {
    cartItemsList.forEach((cartItem) => {
      cartItemsObjectList.push(transformCartItemOnObject(cartItem));
    });
  }
  return cartItemsObjectList;
};

const sumCartItemsList = async () => {
  const p = document.createElement('p');
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = '';
  let sum = 0;
  const cartItemsObjectList = getCartItemsObjectList();
  if (cartItemsObjectList.length > 0) {
    sum = cartItemsObjectList
      .reduce((acc, cartItem) => (acc + parseFloat(cartItem.salePrice)), 0);
  }
  /* const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }); */
  p.innerHTML = `${sum}`;
  totalPrice.appendChild(p);
};

const updateCartItemsListLocalStorage = () => {
  localStorage.setItem('cartItemsList', JSON.stringify(getCartItemsObjectList()));
};

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  updateCartItemsListLocalStorage();
  sumCartItemsList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const showAlert = (message) => {
  window.alert(message);
};

const fetchMLProductListByTerm = async (term) => {
  const API_URL_ML_SEARCH = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  let productList;
  try {
    const response = await fetch(API_URL_ML_SEARCH);
    const jsonObject = await response.json();
    const { results } = jsonObject;
    productList = results;
  } catch (error) {
    showAlert(error);
  }
  return productList;
};

const fetchMLProductItem = async (productId) => {
  const API_URL_ML_SEARCH_ITEM = `https://api.mercadolibre.com/items/${productId}`;
  let productItem;
  try {
    const response = await fetch(API_URL_ML_SEARCH_ITEM);
    const jsonObject = await response.json();
    productItem = jsonObject;
  } catch (error) {
    showAlert(error);
  }
  return productItem;
};

const addProductItemToCartItemsList = ({ sku, name, salePrice }, isLoad = false) => {
  const productLi = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(productLi);
  if (!isLoad) updateCartItemsListLocalStorage();
  sumCartItemsList();
};

const productItemClickListener = async (event) => {
  const productId = getSkuFromProductItem(event.target.parentNode);
  try {
    const cartItems = document.querySelector('.cart__items');
    const loading = createLoadingElement();
    cartItems.appendChild(loading);
    const productItem = await fetchMLProductItem(productId);
    cartItems.removeChild(loading);
    const { id: sku, title: name, price: salePrice } = productItem;
    addProductItemToCartItemsList({ sku, name, salePrice });
  } catch (error) {
    showAlert(error);
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.addEventListener('click', productItemClickListener);
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

const fillProductListByTerm = async (term) => {
  try {
    const sectionItems = document.querySelector('.items');
    const loading = createLoadingElement();
    sectionItems.appendChild(loading);
    const productList = await fetchMLProductListByTerm(term);
    sectionItems.removeChild(loading);
    productList
      .map(({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail }))
      .forEach(product => sectionItems.appendChild(createProductItemElement(product)));
  } catch (error) {
    showAlert(error);
  }
};

const loadCartItemsListFromLocalStorage = () => {
  const cartItemsList = JSON.parse(localStorage.getItem('cartItemsList'));
  if (cartItemsList) {
    cartItemsList
      .forEach(({ sku, name, salePrice }) =>
        addProductItemToCartItemsList({ sku, name, salePrice }, true));
  }
};

const emptyCartItemsList = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  updateCartItemsListLocalStorage();
  sumCartItemsList();
};

const setupEventHandlers = () => {
  const deleteButton = document.querySelector('.empty-cart');
  deleteButton.addEventListener('click', emptyCartItemsList);
};

window.onload = function onload() {
  const SEARCH_TERM = 'computador';
  setupEventHandlers();
  fillProductListByTerm(SEARCH_TERM);
  loadCartItemsListFromLocalStorage();
  sumCartItemsList();
};
