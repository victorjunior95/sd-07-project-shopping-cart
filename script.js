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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function reloadCart() {
  const cartList = document.querySelector('.cart__items');
  if (localStorage.getItem('Carrinho de Compras') !== 'undefined' || localStorage.getItem('Carrinho de Compras') !== 'null') {
    const newList = localStorage.getItem('Carrinho de Compras');
    JSON.parse(newList).forEach((item) => {
      const newElement = document.createElement('li');
      cartList.appendChild(newElement);
      item.addEventListener('click', cartItemClickListener);
    });
  }
}

function saveCart() {
  const arrayOfData = [];
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => arrayOfData.push(item.innerText))
  localStorage.setItem('Carrinho de Compras', JSON.stringify(arrayOfData));
  console.log(arrayOfData);
}

function cartItemClickListener(event) {
  const itemSelected = event.target;
  const itemParent = document.querySelector('.cart__items');
  itemParent.removeChild(itemSelected);
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getFilteredProducts = () => {
  const itemsSection = document.querySelector('.items');
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(endPoint)
    .then(response => response.json())
    .then(data => data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const itemToBeInserted = createProductItemElement({ sku, name, image });
      itemsSection.appendChild(itemToBeInserted);
    }));
};

const insertProductInCart = (event) => {
  const itemSelected = event.target.parentNode;
  const cartSection = document.querySelector('.cart__items');
  const idSelected = itemSelected.querySelector('.item__sku').innerText;
  const endPoint = `https://api.mercadolibre.com/items/${idSelected}`;
  fetch(endPoint)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const newItemCart = {
        sku,
        name,
        salePrice,
      };
      const itemToBeInsertedInCart = createCartItemElement(newItemCart);
      cartSection.appendChild(itemToBeInsertedInCart);
      saveCart();
    });
};

function getClickForCart() {
  const productButton = document.querySelectorAll('.item__add');
  productButton.forEach((item) => {
    item.addEventListener('click', insertProductInCart);
  });
}

function loadButton() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
}

function clearCart() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
  saveCart();
}

window.onload = async function onload() {
  await getFilteredProducts();
  getClickForCart();
  reloadCart();
  loadButton();
};
