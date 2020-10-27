

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

function cartItemClickListener() {
  document.querySelector('.cart__items').removeChild(event.target);
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function addProductToShoppingCar() {
  const itemID = getSkuFromProductItem(event.target.parentNode);
  console.log(itemID);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(result => result.json()
      .then(({ id, title, price }) => {
        const object = {
          sku: id,
          name: title,
          salePrice: price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(object));
      }),
    );
}
const addProductItemElement = (section, local) => document.querySelector(local)
  .appendChild(section);

function products(arrayProducts) {
  arrayProducts.forEach(({ title, id, thumbnail }) => {
    const objectProduct = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const section = createProductItemElement(objectProduct);
    addProductItemElement(section, 'section.items');
  });
  document.querySelectorAll('.item__add').forEach(element => element
    .addEventListener('click', addProductToShoppingCar));
}
const getListOfProducts = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const arrayProducts = await fetch(url)
    .then(response => response.json())
    .then(object => object.results);

  products(arrayProducts);
};

window.onload = function onload() {
  getListOfProducts();
};
