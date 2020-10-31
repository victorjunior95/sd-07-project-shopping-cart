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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.currentTarget.remove('');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addProductInCart = (event) => {
  const itemClicked = event.target.parentNode;
  const cart = document.querySelector('.cart__items');
  const itemId = itemClicked.querySelector('.item__sku');
  const addHtml = itemId.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${addHtml}`)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const destructionAll = {
        sku,
        name,
        salePrice,
      };
      const itemToCart = createCartItemElement(destructionAll);
      cart.appendChild(itemToCart);
    });
};

const checkProdutct = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((item) => {
    item.addEventListener('click', addProductInCart);
  });
};
const addLoading = () => {
  const createSpan = document.createElement('span');
  createSpan.className = 'loading';
  const item2 = document.querySelector('.items').appendChild(createSpan);
  const items = document.querySelector('.loading');
  items.innerHTML = '<h1>Loading...</h1>';
};

const removeLoading = () => {
  setTimeout(() => {
    const items = document.querySelector('h1');
    items.innerText = '';
  }, 2500);
};
async function itemsFounded() {
  addLoading();
  const itemsBox = document.querySelector('.items');
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
        const changedParam = createProductItemElement({ sku, name, image });
        itemsBox.appendChild(changedParam);
        removeLoading();
      }),
    );
}

const btnClear = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
};

window.onload = async function onload() {
  await itemsFounded();
  checkProdutct();
  btnClear();
};
