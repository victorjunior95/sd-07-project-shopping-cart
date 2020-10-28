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

// totalPrice foi baseada na função calculatePrice do Thiago Pederzolli
// fonte: https://github.com/tryber/sd-07-project-shopping-cart/pull/32/commits/80e23921c8901e1ee94958b47ca1d28df38e3225
const totalPrice = async (price, type) => {
  const itemPrice = document.querySelector('.total-price');
  const total = Number(itemPrice.innerText);
  if (type === 'sum') itemPrice.innerText = total + Number(parseFloat(price.toFixed(2)));
  if (type === 'sub') itemPrice.innerText = total - Number(parseFloat(price.toFixed(2)));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  const price = +event.target.innerText.slice(-6).replace('$', '');
  totalPrice(price, 'sub');
  event.target.remove();
}
const getProductById = id => `https://api.mercadolibre.com/items/${id}`;

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* const saveCart = item => {
  const saveArray = [];
  saveArray.push(item);
  console.log(saveArray);
  document.querySelectorAll('.cart__item').forEach(item => {
    saveArray.push(item);
    localStorage.setItem('cart-item', JSON.stringify(saveArray));
  });
}; */

const fetchProductItemCart = (item) => {
  fetch(item)
    .then(product => product.json())
    .then(teste =>
      document
        .querySelector('.cart__items')
        .appendChild(createCartItemElement(teste)))
    .then(itemPrice => itemPrice.innerHTML.split('$'))
    .then(price => parseFloat(price[1]))
    .then(number => totalPrice(number, 'sum'));
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

const addToCart = async () =>
  document.querySelectorAll('button.item__add').forEach(button =>
    button.addEventListener('click', () => {
      const id = getSkuFromProductItem(button.parentNode);
      const url = getProductById(id);
      fetchProductItemCart(url);
    }));

const fetchProductsApi = () => {
  const apiUrl = searchProduct('computador', 40);
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
  fetchProductsApi();
  emptyCart();
};
