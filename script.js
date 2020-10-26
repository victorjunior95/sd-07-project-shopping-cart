const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const cartItemClickListener = (event) => {
  const listIntens = document.querySelector('.cart__items');
  listIntens.removeChild(event.target);
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getProductsObj = url => fetch(url)
  .then(result => result.json())
  .then(result => result);

const addCardItens = async (item) => {
  // Olha a gambiarra
  const skuItem = item.target.parentNode.querySelector('span').innerText;
  const product = await getProductsObj(`https://api.mercadolibre.com/items/${skuItem}`);
  const { id: sku, title: name, price: salePrice } = product;
  const element = createCartItemElement({ sku, name, salePrice });
  document.querySelector('.cart__items').appendChild(element);
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  // Refatorar
  if (element === 'button') e.addEventListener('click', addCardItens);
  e.className = className;
  e.innerText = innerText;
  return e;
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
/* Preciso entender quando usar
const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText; */

const outputProducts = async () => {
  const products = await getProductsObj('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  products.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const section = createProductItemElement({ sku, name, image });
    document.querySelector('.items').appendChild(section);
  });
};

window.onload = function onload() { outputProducts(); };
