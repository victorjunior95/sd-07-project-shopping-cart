let cartItensStorage = localStorage.getItem('cardItemsArr') !== null ?
  JSON.parse(localStorage.getItem('cardItemsArr')) : [];

const upDateLocalStorage = () => {
  localStorage.setItem('cardItemsArr', JSON.stringify(cartItensStorage));
};

const cardItemsCaucPrices = async () => {
  const price = await cartItensStorage.reduce((acc, crr) => crr.salePrice + acc, 0);
  document.querySelector('.total-price').innerText = `${price}`;
};

const rmCartItemArr = (event) => {
  const index = cartItensStorage.findIndex(element => element.sku === event.target.id);
  cartItensStorage.splice(index, 1);
  upDateLocalStorage();
  cardItemsCaucPrices();
};

const cardItemsRemoveLi = (event) => {
  rmCartItemArr(event);
  document.querySelector('.cart__items').removeChild(event.target);
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cardItemsRemoveLi);
  return li;
};

const getProductsObj = url => fetch(url)
  .then(result => result.json())
  .then(result => result);

const getSkuFromProductItem = item => item.target.parentNode.querySelector('span').innerText;

const setCartItemsArr = (obj) => {
  cartItensStorage.push(obj);
  upDateLocalStorage();
};
// Melhorar esses async
const addCardItens = async (item) => {
  const skuItem = getSkuFromProductItem(item);
  const product = await getProductsObj(`https://api.mercadolibre.com/items/${skuItem}`);
  const { id: sku, title: name, price: salePrice } = product;
  const element = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(element);
  setCartItemsArr({ sku, name, salePrice });
  cardItemsCaucPrices();
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', addCardItens);
  }
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const loadingMsg = () => {
  const container = document.createElement('span');
  container.className = 'loading';
  container.innerText = 'loading...';
  document.querySelector('.items').appendChild(container);
};

const outputProducts = async () => {
  const products = await getProductsObj('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const container = document.querySelector('.items');
  products.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const section = createProductItemElement({ sku, name, image });
    container.appendChild(section);
  });
  container.removeChild(document.querySelector('.loading'));
};

const createCartItensOfStorage = (cartItensStorageArr) => {
  if (localStorage.getItem('cardItemsArr') !== null) {
    cartItensStorageArr.forEach((e) => {
      const { sku, name, salePrice } = e;
      const element = createCartItemElement({ sku, name, salePrice });
      document.querySelector('.cart__items').appendChild(element);
    });
    cardItemsCaucPrices();
  }
};

const btnEmptyCartEvent = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    cartItensStorage = [];
    upDateLocalStorage();
    cardItemsCaucPrices();
    document.querySelector('.cart__items').innerHTML = '';
  });
};

window.onload = function onload() {
  loadingMsg();
  outputProducts();
  createCartItensOfStorage(cartItensStorage);
  btnEmptyCartEvent();
};
