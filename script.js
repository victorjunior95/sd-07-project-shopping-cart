// const showAlert = (error) => {
//   window.alert(error);
// };

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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const url = `https://api.mercadolibre.com/items/${sku}`;
  button.addEventListener('click', () => {
    fetch(url)
      .then(response => response.json())
      .then((object) => {
        const { id, title, price } = object;
        const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
        const cartList = document.querySelector('.cart__items');
        cartList.appendChild(cartItem);
      });
  });
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

const createProductsList = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const sectionItems = document.querySelector('.items');
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((item) => {
        const { id: sku, title: name, thumbnail: image } = item;
        const productItem = createProductItemElement({ sku, name, image });
        sectionItems.appendChild(productItem);
      });
    });
};

window.onload = function onload() {
  createProductsList();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
