const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

//salva os dados di carrinho no localStorage
function localCartStorage () {
  const cartItems = document.querySelector('.cart__items').innerText;
   localStorage.setItem('item', cartItems);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// função que remove itens do carrinho de compras com um click
function cartItemClickListener(event) {
  const removeItems = document.querySelector('.cart__items');
  removeItems.removeChild(event);
  localCartStorage();
}

// função cria cada elemento e renderiza na pagina
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => fetchItemToCart(sku));
  return section;
}

// cria lista com elementos do carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; 
  li.addEventListener('click', () => cartItemClickListener(li));
  return li;
}

// função faz busca por item e add carrinho
function fetchItemToCart(sku) {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  fetch(endpoint)
      .then(response => response.json())
      .then((object) => {
        const createCartItem = createCartItemElement(object);
        const addToCart = document.querySelector('.cart__items');
        addToCart.appendChild(createCartItem);
        localCartStorage();
      });
}

// função que busca na API e renderiza na tela
function fetchApi() {
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const result = createProductItemElement(product);
        document.querySelector('.items').appendChild(result);
      });
    });
}

window.onload = function onload() {
  fetchApi();
  localCartStorage();
};
