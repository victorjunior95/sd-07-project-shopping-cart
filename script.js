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

function createProductItemElement({ sku, name, image }) {
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint).then(response => response.json()).then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
    });
  });
};
const addClickedItem = () => {
  const buttonClicked = document.querySelector('.items');
  buttonClicked.addEventListener('click', async (event) => {
    const selected = event.target.closest('.item').dataset.id;
    const API_URL_ITEM = `https://api.mercadolibre.com/items/${selected}`;
    const siteResponse = await fetch(API_URL_ITEM).then(response => response.json());
    const object =
      {
        sku: siteResponse.id,
        name: siteResponse.title,
        salePrice: siteResponse.price,
      };
    const createLi = createCartItemElement(object);
    const listOl = document.querySelector('ol');
    listOl.appendChild(createLi);
  });
};

const fetchItemList = async () => {
  const siteReturn = await fetch(API_URL_SEARCH)
  .then(response => response.json())
  .then(data => data.results);

  siteReturn.forEach((element) => {
    const obj = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const addItem = document.querySelector('.items');
    const a = createProductItemElement(obj);
    addItem.appendChild(a);
  });
};

const clearCart = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
  });
};


window.onload = function onload() {
  loadProducts();
};
