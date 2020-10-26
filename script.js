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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  document
    .querySelectorAll('.cart__item')
    .forEach(teste => teste.addEventListener('click', () => teste.remove()));
}

const getProductById = id => `https://api.mercadolibre.com/items/${id}`;

const sumPrice = async () => {
  const total = document.querySelectorAll('.cart__item');
  console.log(total[0].salePrice);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrice();
  return li;
}

const fetchProductItemCart = (item) => {
  fetch(item)
    .then(product => product.json())
    .then(teste =>
      document
        .querySelector('.cart__items')
        .appendChild(createCartItemElement(teste)))
    .then(() => cartItemClickListener());
};

const searchProduct = (product, maxResults) =>
  `https://api.mercadolibre.com/sites/MLB/search?q=${product}&limit=${maxResults}`;

const productHandler = (productArray) => {
  const product = Object.entries(productArray);
  product.forEach(entry =>
    document
      .querySelector('.items')
      .appendChild(createProductItemElement(entry[1])));
};

const addToCart = () =>
  document.querySelectorAll('button.item__add').forEach(button =>
    button.addEventListener('click', () => {
      const id = getSkuFromProductItem(button.parentNode);
      const url = getProductById(id);
      fetchProductItemCart(url);
    }),
  );

const fetchProductsApi = () => {
  const apiUrl = searchProduct('computador', 4);
  fetch(apiUrl)
    .then(product => product.json())
    .then(object => productHandler(object.results))
    .then(() => addToCart());
};

const emptyCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelectorAll('.cart__item').forEach(item => item.remove());
  });
};

window.onload = async function onload() {
  await fetchProductsApi();
  await emptyCart();
};
