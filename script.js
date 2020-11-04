function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function loadCartPrice() {
  return new Promise((resolve) => {
    const sumCartItems = JSON.parse(localStorage.getItem('sumCartItems'));
    let sum = 0;
    for (let i = 0; i < sumCartItems.length; i += 1) sum += sumCartItems[i];
    resolve(`Total: $${sum}`);
  },
  );
}

async function createPriceElement() {
  const totalPrice = document.querySelector('.total-price');
  const log = await loadCartPrice();
  console.log(log);
  totalPrice.innerHTML = log;
}

function clearCartItems() {
  document.querySelector('.empty-cart')
    .addEventListener('click', () => {
      document.querySelector('.cart__items').innerHTML = '';
      const cartItemsStorage = [];
      const sumCartItems = [];
      localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
      localStorage.setItem('sumCartItems', JSON.stringify(sumCartItems));
      loadCartPrice();
      createPriceElement();
    });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }s

function cartItemClickListener(event) {
  console.log(event.target.getAttribute("data-sku"));
  let items = JSON.parse(localStorage.getItem('sumCartItems'));
items.splice(items.indexOf(event),1);
  
  localStorage.setItem('sumCartItems', JSON.stringify(items));

  event.target.remove();

}

function createCartItemElement({ sku, name, salePrice }) {
  if(const cartItemsStorage.length === 0) {

  }  
  //const cartItemsStorage = JSON.parse(localStorage.getItem('cartItems'));
  const sumCartItems = JSON.parse(localStorage.getItem('sumCartItems'));
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.dataset.sku = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  console.log(li);
  console.log(cartItemsStorage);
  cartItemsStorage.push(li);
  console.log(cartItemsStorage);
  document.querySelector('ol').appendChild(li);
  //cartItemsStorage.push({ sku, name, salePrice });
  //cartItemsStorage.push(li);
  //sumCartItems.push(salePrice);
  //localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
  //localStorage.setItem('sumCartItems', JSON.stringify(sumCartItems));
  createPriceElement();
}

function loadCartFromStorage() {
  const itemsStorage = JSON.parse(localStorage.getItem('cartItems'));
  for (let i = 0; i < itemsStorage.length; i += 1) {
    console.log(itemsStorage[i]);
    // const li = document.createElement('li');
    // li.className = 'cart__item';
    // li.innerText = `SKU: ${itemsStorage[i].sku} | NAME: ${itemsStorage[i].name} | PRICE: $${itemsStorage[i].salePrice}`;
    // li.addEventListener('click', cartItemClickListener);
    //document.querySelector('ol').appendChild(itemsStorage[i]);
  }
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (e.className === 'item__add') {
    e.addEventListener('click', () => {
      const item = (e.parentNode.childNodes[0].textContent);
      const endPointItem = `https://api.mercadolibre.com/items/${item}`;
      fetch(endPointItem)
      .then(async (responseItem) => {
        const { id, title, price } = await responseItem.json();
        createCartItemElement({ sku: id, name: title, salePrice: price });
      },
      );
    });
  }
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

const fetchApiShopping = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endPoint)
    .then(response => response.json())
      .then(({ results }) => {
        const items = document.querySelector('.items');
        results.forEach((result => (
          (items.appendChild(
            createProductItemElement({
              sku: result.id,
              name: result.title,
              image: result.thumbnail }),
          ))
        )
      ));
      });
};

window.onload = function onload() {
  if (!localStorage.getItem('cartItems')) {
    const cartItemsStorage = [];
    const sumCartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
    localStorage.setItem('sumCartItems', JSON.stringify(sumCartItems));
  } else {
    console.log('Storage já existe!');
    loadCartFromStorage();
  }
  fetchApiShopping('computador');
  clearCartItems();
  createPriceElement();
};
