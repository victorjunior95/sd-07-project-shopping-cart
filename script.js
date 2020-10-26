window.onload = function onload() { };

const createLoadText = () => {
  const itemsSection = document.getElementById('items');
  const span = document.createElement('span');
  span.className = 'loading';
  span.id = 'loading';
  span.innerText = 'Loading...';
  itemsSection.appendChild(span);
};

const sumPricesAssync = async () => {
  const cartItemsId = await document.getElementsByClassName('cart__item');
  let totalCartPrice = 0;
  for (let i = 0; i < cartItemsId.length; i += 1) {
    totalCartPrice += Number(cartItemsId[i].name);
  }
  document.getElementById('total-price').innerText = totalCartPrice;
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

function cartItemClickListener(event) {
  const itemToRemove = event.target;
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.removeChild(itemToRemove);
}

const removeFromLocalStorage = (event) => {
  localStorage.removeItem(event.target.id);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.name = salePrice;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', removeFromLocalStorage);
  li.addEventListener('click', sumPricesAssync);
  return li;
}

const fetchItemById = (event) => {
  const itemId = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const itemPath = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(itemPath)
  .then(response => response.json())
  .then((object) => {
    localStorage.setItem(itemId, [object.title, object.price]);
    return createCartItemElement(object);
  })
  .then((item) => {
    document.getElementsByClassName('cart__items')[0].appendChild(item);
  })
  .then(sumPricesAssync);
};

const fecthProductList = (product) => {
  const productQuery = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(productQuery)
  .then((response) => {
    createLoadText();
    return response.json();
  })
  .then(object => object.results)
  .then(result => result.forEach((item) => {
    const section = createProductItemElement(item);
    section.lastChild.addEventListener('click', fetchItemById);
    document.getElementsByClassName('items')[0].appendChild(section);
  }))
  .then(() => {
    document.getElementById('loading').style.display = 'none';
  });
};

fecthProductList('computer');

const localStorageValues = Object.entries(localStorage);
if (localStorage.length > 0) {
  localStorageValues.forEach((item) => {
    const itemObject = { id: item[0],
      title: item[1].split(',')[0],
      price: Number(item[1].split(',')[1]),
    };
    const localStorageLi = createCartItemElement(itemObject);
    document.getElementById('cart__items').appendChild(localStorageLi);
  });
}

const emptyCart = () => {
  ol = document.getElementById('cart__items');
  ol.innerHTML = '';
  localStorage.clear();
  document.getElementById('total-price').innerText = 0;
};
document.getElementById('empty-cart').addEventListener('click', emptyCart);

sumPricesAssync();
