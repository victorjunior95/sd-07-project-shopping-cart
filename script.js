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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAddItemCart = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(object));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  button.addEventListener('click', async function (event) {
    const parentElement = await event.target.parentElement;
    await fetchAddItemCart(getSkuFromProductItem(parentElement));
  });
  section.appendChild(button);
  return section;
}

const fetchComputer = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computer';
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const items = document.querySelector('.items');
      object.results.forEach((product) => {
        const item = createProductItemElement(product);
        items.appendChild(item);
      });
    });
  // Conforme ajuda do colega Vitor Rodrigues.
};

window.onload = function onload() {
  fetchComputer();
};

// const handleComputers = (computers) => {
//   console.log(computers);
// };
