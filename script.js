// const findItemAndReturnArrayObject = async (item) => {
//   const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
//   try {
//     const response = await fetch(endPoint);
//     const object = await response.json();
//     if (object.error) {
//       throw new Error(object.error);
//     } else {
//       return object.results;
//     }
//   } catch (error) {
//     return alert(error);
//   }
// };

// function appendElementInAClass(classFather, classChild) {
//   father = document.querySelector(classFather);
//   child = document.querySelector(classChild);
//   father.appendChild(child);
// }

// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
// }

// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// function createProductItemElement({ sku, name, image }) {
//   const section = document.createElement('section');
//   section.className = 'item';
//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
//   return section;
// }

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// const fetchWithProductID = async (productID) => {
//   const endPoint = `https://api.mercadolibre.com/items/${productID}`;
//   try {
//     const response = await fetch(endPoint);
//     const object = await response.json();
//     console.log(object);
//     if (object.error) {
//       throw new Error(object.error);
//     } else {
//       return object.results;
//     }
//   } catch (error) {
//     return alert(error);
//   }
// };

// const getProductId = (event) => {
//   const clickedParent = event.target.parentNode;
//   const idElement = getSkuFromProductItem(clickedParent);
//   const cartToAdd = fetchWithProductID(idElement);
//   const { id: sku, title: name, price: salePrice } = cartToAdd;
//   const cart = createCartItemElement({sku, name, salePrice});
//   const cartList = document.querySelector('cart__items');
//   cartList.appendChild(cart);
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// const loadProducts = () => {
//   const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$COMPUTADOR';
//   fetch(endPoint)
//   .then(response => (response.json()))
//   .then(response => response.results.forEach((product) => {
//     const items = document.querySelector('.items');
//     const { id: sku, title: name, thumbnail: image } = product;
//     const item = createProductItemElement({ sku, name, image });
//     items.appendChild(item);
//   }));
// };

// window.onload =  async function onload() {
//   await loadProducts();
//   getProductId();
//   // const arrayOfProducts = await findItemAndReturnArrayObject();
//   // console.log(arrayOfProducts);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function showCart(id) {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  await fetch(endPoint)
  .then(response => response.json())
  .then((object) => {
    document.querySelector('ol').appendChild(createCartItemElement(object));
  });
}

function clickBtn() {
  const selectButton = document.querySelectorAll('button.item__add');
  selectButton.forEach(element => element.addEventListener('click', () => {
    showCart(getSkuFromProductItem(element.parentElement));
  }));
}

function showList(array) {
  document.querySelector('.loading').remove();
  const items = Object.entries(array);
  console.log(items);
  items.forEach(entry => document.querySelector('.items').appendChild(createProductItemElement(entry[1])));
}

loadProducts = async () => {
  const endPoint =
    'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(endPoint)
    .then(response => response.json())
    .then(object => showList(object.results))
    .then(arrayOfResults => clickBtn(arrayOfResults));
};

function clearCart() {
    document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
  });
}

window.onload = function onload() {
  loadProducts();
  clearCart();
};
