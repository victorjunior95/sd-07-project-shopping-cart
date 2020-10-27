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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(productAdd) {
  const itemID = getSkuFromProductItem(productAdd.target.parentElement);
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    const { id: sku, title: name, price: salePrice } = data;
    const productComponents = { sku, name, salePrice };
    const cartItems = document.querySelector('.cart_items');
    cartItems.appendChild(createCartItemElement(productComponents));
    console.log(productComponents);
  } catch (error) {
    console.error(error);
  }
}

async function fetchItems() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    } else {
      for (let index = 0; index < data.results.length; index += 1) {
        const { id: sku, title: name, thumbnail: image } = data.results[index];
        const productComponents = { sku, name, image };
        const items = document.querySelector('.items');
        const product = createProductItemElement(productComponents);
        product.querySelector('button.item_add').addEventListener('click', addToCart);
        items.appendChild(product);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

window.onload = function onload() { fetchItems(); };
