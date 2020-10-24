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

async function sumCart() {
  const productsInCart = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let sum = 0;
  for (let item = 0; item < productsInCart.length; item += 1) {
    const priceCart = productsInCart[item]
    .innerText.split(' | ')[2].split(': ')[1].replace('$', '');
    sum += Number(priceCart);
  }
  totalPrice.innerText = `${sum}`;
}

function registeCartLocalStorage(trigered) {
  const productsInCart = document.querySelectorAll('.cart__item');
  if (trigered === 'remove') localStorage.clear();
  for (let item = 0; item < productsInCart.length; item += 1) {
    const skuCart = productsInCart[item].innerText.split(' | ')[0].split(': ')[1];
    localStorage.setItem(`Item-${item}`, skuCart);
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  registeCartLocalStorage('remove');
  sumCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


async function registerToCart(itemID) {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  const { id: sku, title: name, price: salePrice } = data;
  const productComponents = { sku, name, salePrice };
  const cartItems = document.querySelector('.cart__items');
  const productCart = createCartItemElement(productComponents);
  cartItems.appendChild(productCart);
  registeCartLocalStorage('add');
  await sumCart();
}

function addToCart(productAdd) {
  const itemID = getSkuFromProductItem(productAdd.target.parentElement);
  try {
    registerToCart(itemID);
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
        product.querySelector('button.item__add').addEventListener('click', addToCart);
        items.appendChild(product);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function loadCart() {
  for (let getItem = 0; getItem < localStorage.length; getItem += 1) {
    const itemSaved = localStorage[`Item-${getItem}`];
    registerToCart(itemSaved);
  }
}

function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  sumCart();
  localStorage.clear();
}


window.onload = function onload() {
  fetchItems();
  loadCart();

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', clearCart)
};
