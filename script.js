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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

// cria lista com elementos do carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// função faz busca por item e add carrinho
function fetchItemToCart(sku) {
  console.log('click');
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => {
      const createCartItem = createCartItemElement(object);
      const addToCart = document.querySelector('ol');
      console.log(addToCart);
      addToCart.appendChild(createCartItem);
    });
}

// função cria cada elemento da pagina
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

// função que busca na API e renderiza na tela
function fetchApi() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const result = createProductItemElement(product);
        document.querySelector('.items').appendChild(result);
      });
    });
}

window.onload = function onload() {
  fetchApi();
};
