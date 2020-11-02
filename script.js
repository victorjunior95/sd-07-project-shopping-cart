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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemCart(itemId) {
  const urlItemEndpoint = `https://api.mercadolibre.com/items/${itemId}`;

  try {
    const response = await fetch(urlItemEndpoint);
    const objectDataItem = await response.json();
    const listOl = document.querySelector('.cart__items');

    if (objectDataItem.error) {
      throw new Error(objectDataItem.error);
    } else {
      listOl.appendChild(createCartItemElement(objectDataItem));
      localStorage.setItem('cart', listOl.innerHTML);
    }
  } catch (error) {
    alert(error);
  }
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAddItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAddItem.addEventListener('click', function (event) {
    const item = event.target.parentElement;
    addItemCart(getSkuFromProductItem(item));
  });

  section.appendChild(buttonAddItem);
  return section;
  // aqui segui a mesma lógica do Tiago Esdras, no dia do fechamento (último dia do projeto).
}

async function loadProducts() {
  const urlEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  try {
    const response = await fetch(urlEndpoint);
    const objectData = await response.json();

    if (objectData.error) {
      throw new Error(objectData.error);
    } else {
      const items = document.querySelector('.items');
      objectData.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    }
  } catch (error) {
    alert(error);
  }
}

function loadCartItems() {
  const listOl = document.querySelector('.cart__items');
  const cartItems = localStorage.getItem('cart');
  if (cartItems) listOl.innerHTML = cartItems;
}

window.onload = function onload() {
  loadProducts();
  loadCartItems();
};
