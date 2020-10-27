const fecthAndParse = (link, toSearch) => {
  const response = fetch(`${link}${toSearch}`)
  .then(resultOfFetch => resultOfFetch.json()
  .then(resultOfJSON => resultOfJSON));
  return response;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  selected = event.currentTarget;
  parentNodeElement = selected.parentNode;
  parentNodeElement.removeChild(selected);
}

function createCartItemElement({ id: sku, title: name, base_price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function buttonEventClick(event) {
  const link = 'https://api.mercadolibre.com/items/';
  const id = getSkuFromProductItem(event.currentTarget.parentNode);
  fecthAndParse(link, id).then((productDetails) => {
    const cartItem = createCartItemElement(productDetails);
    const listOfItems = document.getElementsByClassName('cart__items')[0];
    listOfItems.appendChild(cartItem);
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', buttonEventClick);
  }
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

function defaultSearch() {
  fecthAndParse('https://api.mercadolibre.com/sites/MLB/search?q=$', 'COMPUTADOR')
  .then((element) => {
    element.results.forEach((product) => {
      const sectionItems = document.getElementsByClassName('items')[0];
      const newProduct = createProductItemElement(product);
      sectionItems.appendChild(newProduct);
    });
  });
}

window.onload = function onload() { defaultSearch(); };
