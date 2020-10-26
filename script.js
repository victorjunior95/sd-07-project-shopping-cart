window.onload = function onload() {
  requisicao();
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
// sku, name, image
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // comentario
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const arrayproduto = (produtos) => {
  const itens = document.querySelector('.items');
  for (let index = 0; index < produtos.length; index += 1) {
    let produto = createProductItemElement(produtos[index]);
    itens.appendChild(produto);
  }
}

const requisicao = () => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=computador`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => arrayproduto(object.results));
}