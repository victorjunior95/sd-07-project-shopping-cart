const cartItensStorage = localStorage.getItem('cardItemsArr') !== null ?
  JSON.parse(localStorage.getItem('cardItemsArr')) : [];

const upDateLocalStorage = () => {
  localStorage.setItem('cardItemsArr', JSON.stringify(cartItensStorage));
};

const setCartItemsArr = (obj) => {
  cartItensStorage.push(obj);
  upDateLocalStorage();
};

const rmCartItemArr = (event) => {
  const index = cartItensStorage.findIndex(element => element.sku === event.target.id);
  cartItensStorage.splice(index, 1);
  upDateLocalStorage();
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

const addCardItens = async (item) => {
  const skuItem = getSkuFromProductItem(item);
  const product = await getProductsObj(`https://api.mercadolibre.com/items/${skuItem}`);
  const { id: sku, title: name, price: salePrice } = product;
  const element = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(element);
  setCartItemsArr({ sku, name, salePrice });
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

const outputProducts = async () => {
  const products = await getProductsObj('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  products.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const section = createProductItemElement({ sku, name, image });
    document.querySelector('.items').appendChild(section);
  });
};

const createCartItensOfStorage = (cartItensStorageArr) => {
  if (localStorage.getItem('cardItemsArr') !== null) {
    cartItensStorageArr.forEach((e) => {
      const { sku, name, salePrice } = e;
      const element = createCartItemElement({ sku, name, salePrice });
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(element);
    });
  }
};

window.onload = function onload() {
  outputProducts();
  createCartItensOfStorage(cartItensStorage);
};
