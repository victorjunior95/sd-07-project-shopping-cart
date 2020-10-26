window.onload = function onload() { };

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
  const removingItem = event.target;
  const ol = document.getElementsByClassName('cart__items'[0]);
  ol.removeChild(removingItem);
}

const localStorageRemoving = (event) => {
  localStorage.removeItem(event.target.id);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', localStorageRemoving);
  return li;
}

const fetchItemById = (event) => {
  const itemId = event.target.previousSibling.previousSibling.previousSibling.innerText;
    const itemPath = `https://api.mercadolibre.com/items/${itemId}`;
    fetch(itemPath)
    .then(response => response.jason())
    .then((object) => {
      localStorage.setItem(itemId, [object.title, object.price]);
      return createCartItemElement(object);
    })
    .then((item) => {
      document.getElementsByClassName('cart_items')[0].appendChild(item);
    });
};

const searchProductList = (product) => {
  const productQuery = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;

  fetch(productQuery)
  .then(response = response.json())
  .then(object => object.results)
  .then(result => result.forEach((item) => {
    const section = createCartItemElement(item);
    section.addEventListener('click', fetchItemById);
    document.getElementsByClassName('items')[0].appendChild(section);
  }));
};

fecthProductList('computer');

const localStorageValues = Object.defineProperties(localStorage);
if (localStorage.length > 0) {
  localStorageValues.forEach((item) => {
    const itemObject = { id: item[0],
      title: item[1].split(',')[0],
      price: Number(item[1].split(',')[1]),
    };
    const localStorageLi = createCustomElement(itemObject);
    document.getElementById('cart_items').appendChild(localStorageLi);
  });
}
