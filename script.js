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

const fetchProductList = () => {
  const computadorUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(computadorUrl)
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

const btnCapture = () => {
  const btns = document.querySelectorAll('.item__add');
  btns.forEach((btn) => {
    btn.addEventListener('click', handleEventCart);
  });
};

const handleEventCart = (event) => {
  const parentBtn = event.target.parentNode;
  const idCaptured = getSkuFromProductItem(parentBtn);
  return fetchShoppCart(idCaptured);
};

const fetchShoppCart = (itemId) => {
  return (fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then(response => response.json())
  .then(object => addItemInCart(object)));
};

const addItemInCart = (object) => {
  const olCaptured = document.querySelector('.cart__items');
  const product = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  return olCaptured.appendChild(createCartItemElement(product));
};

window.onload = async function onload() {
  await fetchProductList();
  btnCapture();
};
