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

const addItemToCart = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const cartList = document.querySelector('.cart__items');
    if (object.error) {
      throw new Error(object.error);
    } else {
      cartList.appendChild(createCartItemElement(object));
    }
  } catch (error) {
    showError(error);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function capturingItemId(event) {
  const targetItem = event.target.parentElement;
  const itemId = getSkuFromProductItem(targetItem);
  addItemToCart(itemId);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', capturingItemId);
  section.appendChild(addToCartButton);

  return section;
}

const findProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((produto) => {
        const { id: sku, title: name, thumbnail: image } = produto;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    });
};

window.onload = function onload() {
  findProducts();
};
