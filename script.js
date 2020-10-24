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
  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__id').innerText;
// }

function getRandomNumber() {
  const ramdom = Math.random() * (49);
  const aleatorio = Math.floor(ramdom) + 1;
  return aleatorio;
}

// function cartItemClickListener(event) {
//   console.log(event);
// }

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `ID: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCartElement(produtos) {
  const items = document.querySelector('.items');
  createCartItemElement(produtos.results[getRandomNumber()]);
  const elementCreated = createProductItemElement(produtos.results[getRandomNumber()]);
  items.append(elementCreated);
}

function creategrid(produtos) {
  createCartElement(produtos);
  createCartElement(produtos);
  createCartElement(produtos);
  createCartElement(produtos);
  createCartElement(produtos);
  createCartElement(produtos);
  createCartElement(produtos);
  createCartElement(produtos);
}

function responseDate(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((produtos) => {
      creategrid(produtos);
    })
    .catch(error => alert(error));
}

window.onload = () => responseDate('computador');
