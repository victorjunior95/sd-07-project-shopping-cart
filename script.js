window.onload = function onload() {};

const addToStorage = () => {
  const getItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('item', JSON.stringify(getItem));
  // está pegando um html e transformando em uma string
  // quando mandamos dados para o server ele precisa ser uma string
};

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}


function cartItemClickListener(event) {
  event.target.remove();
  addToStorage();
}

const saveItens = () => {
  const getItem = document.querySelector('.cart__items');
  const ol = localStorage.getItem('item');
  // retorna o valor que está armazenado
  getItem.innerHTML = JSON.parse(ol);
  // transforma a string em obj
  const itensCart = document.querySelectorAll('.cart__item');
  itensCart.forEach(item => item.addEventListener('click', cartItemClickListener));
  console.log(ol);
};
saveItens();

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItensToCart(object) {
  const goToCart = document.querySelector('.cart__items');
  const addTolist = createCartItemElement(object);
  goToCart.appendChild(addTolist);
}

function fetchProducts() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const products = document.querySelector('.items');
  fetch(endpoint)
  .then(response => response.json())
  .then(infos => infos.results.forEach((item) => {
    products.appendChild(createProductItemElement(item));
  }));
}

fetchProducts();

function fetchItensOfCart(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(endpoint)
  .then(response => response.json())
  .then(infos => addItensToCart(infos));
  addToStorage();
}

const addItensToList = (event) => {
  if (event.target.className === 'item__add') {
    // estamos dizendo que o se o item que iniciou o envento tem essa classe faça:
    // no caso o item é o botão
    // e no caso vai ser de um produto específico que queremos colocar no carrinho
    const itemId = getSkuFromProductItem(event.target.parentElement);
    // ele está pegando o valor do ID, que é o inetrText
    fetchItensOfCart(itemId);
  }
};

const sectionOfItens = () => {
  const getClick = document.querySelector('.items');
  getClick.addEventListener('click', addItensToList);
};

sectionOfItens();

const emptyCart = () => {
  const getClick = document.querySelector('.empty-cart');
  getClick.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
};

emptyCart();
