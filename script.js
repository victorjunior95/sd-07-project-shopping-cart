
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = (element) => {
  const idNumber = element.previousSibling.previousSibling.previousSibling.innerText;
  fetch(`https://api.mercadolibre.com/items/${idNumber}`)
    .then(response => response.json())
    .then((response) => {
      const { id, title, price } = response;
      const cartItem = createCartItemElement(id, title, price);
      document.querySelector('.cart__items').appendChild(cartItem);
    });
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

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', function () {
    addItemToCart(event.target);
  });
  section.appendChild(button);

  return section;
}

const createItens = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=cumputador')
    .then(response => response.json())
    .then(response => response.results.forEach((computer) => {
      const { id, title, thumbnail } = computer;
      const item = createProductItemElement(id, title, thumbnail);
      document.querySelector('.items').appendChild(item);
    }),
    );
};

window.onload = function onload() {
  createItens();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
