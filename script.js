const fecthAndParse = (link, toSearch) => {
  const response = fetch(`${link}${toSearch}`)
  .then(resultOfFetch => resultOfFetch.json()
  .then(resultOfJSON => resultOfJSON));
  return response;
};

function defaultSearch() {
  fecthAndParse('https://api.mercadolibre.com/sites/MLB/search?q=$', 'COMPUTADOR')
  .then((element) => {
    element.results.forEach((product) => {
      const sectionItems = document.querySelector('.items');
      const newProduct = createProductItemElement(product);
      sectionItems.appendChild(newProduct);
    });
  });
}

function emptyButtonListener() {
  const btnEmptyCart = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  btnEmptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.mlDeoriProductIds = '';
  });
}

async function loadShoppingCart() {
  if (localStorage.mlDeoriProductIds){
    const ids = localStorage.mlDeoriProductIds.split(' ');
    const link = 'https://api.mercadolibre.com/items/';
    for (const id of ids) {
      await fecthAndParse(link, id).then(async (productDetails) => {
        const cartItem = createCartItemElement(productDetails);
        const listOfItems = document.querySelector('.cart__items');
        listOfItems.appendChild(cartItem);
      })
    };
  }
}

function saveOnLocalStorage(id) {
  if (localStorage.mlDeoriProductIds) {
    localStorage.mlDeoriProductIds += ` ${id}`;
  } else {
    localStorage.setItem('mlDeoriProductIds', id);
  }
}

function removeFromLocalStorage(id) {
  const idsLocalStorage = localStorage.mlDeoriProductIds.split(' ');
  console.log(id);
  console.log(idsLocalStorage);
  idsLocalStorage.forEach((idLocal, index) => {
    if (idLocal === id) {
      idsLocalStorage.splice(index, 1);
    }
  })
  let response = '';
  idsLocalStorage.forEach((idLocal, index) => {
    if (index !== 0) {
      response += ' ';
    }
    response += `${idLocal}`;
  });
  localStorage.mlDeoriProductIds = response;
}

function cartItemClickListener(event) {
  selected = event.currentTarget;
  id = selected.innerText.split(' ')[1];
  parentNodeElement = selected.parentNode;
  parentNodeElement.removeChild(selected);
  removeFromLocalStorage(id);
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

function buttonEventClick(event) {
  const link = 'https://api.mercadolibre.com/items/';
  const id = getSkuFromProductItem(event.currentTarget.parentNode);
  fecthAndParse(link, id).then((productDetails) => {
    const cartItem = createCartItemElement(productDetails);
    const listOfItems = document.getElementsByClassName('cart__items')[0];
    listOfItems.appendChild(cartItem);
    saveOnLocalStorage(id);
  });
}

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
  if (element === 'button') {
    e.addEventListener('click', buttonEventClick);
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

window.onload = function onload() {
  defaultSearch();
  loadShoppingCart();
  emptyButtonListener();
};
