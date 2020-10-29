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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const selectedItem = event.target;
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(selectedItem);
}

// function cartItemClickListener(event) {
//   return event;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// atividade 2
const fetchProductByID = (ItemID) => {
  const apiProductByID = `https://api.mercadolibre.com/items/${ItemID}`;
  fetch(apiProductByID)
    .then(response => response.json())
    .then((product) => {
      const items = document.querySelector('.cart__items');
      const { id: sku, title: name, price: salePrice } = product;
      const item = createCartItemElement({ sku, name, salePrice });
      items.appendChild(item);
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addCartButton = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.appendChild(addCartButton);
  addCartButton.addEventListener('click', (event) => {
    const id = getSkuFromProductItem(event.target.parentElement);
    fetchProductByID(id);
    // console.log(id);
  });
  return section;
}

// Atividade 1 - Função implementada com a ajuda da excelente explicação do Victor Junior.
const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    });
};

// Atividade 6 - Botão para limpar carrinho de compras
const eraseCartItems = () => {
  const cartItems = document.querySelector('ol', '.cart__items');
  cartItems.innerHTML = ' ';
};

window.onload = function onload() {
  loadProducts();
  eraseCartItems();
};
