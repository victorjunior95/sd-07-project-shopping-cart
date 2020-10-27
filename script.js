const clickSelection = window.document;

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
  const sectionShowProducts = document.querySelector('#presentationItems');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return sectionShowProducts.appendChild(section);
}

const setCartItem = (idReceived, callback) => {
  const endpoint = `https://api.mercadolibre.com/items/${idReceived}`;
  fetch(endpoint)
    .then((response) => {
      response.json().then((data) => {
        const product = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        callback(product);
      });
    });
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (evt) => {
    if (evt.target.nodeName === 'BUTTON' && evt.target.className === 'item__add') {
      setCartItem();
    }
  });
  return ol.appendChild(li);
};

const loadItemLocalStorage = () => {
  let getLocalStorageAll = localStorage;
  getLocalStorageAll = Object.keys(getLocalStorageAll);
  getLocalStorageAll.forEach((product) => {
    let element = localStorage.getItem(product);
    element = JSON.parse(element);
    element = {
      sku: element.SKU,
      name: element.NAME,
      salePrice: element.PRICE,
    };
    return createCartItemElement(element);
  });
};

const removeItemOfHtml = () => {
  const ol = document.querySelector('.cart__items');
  while (ol.lastElementChild) {
    ol.removeChild(ol.lastElementChild);
  }
  return loadItemLocalStorage();
};

const localStorageCreateItem = ({ sku, name, salePrice }) => {
  const sendLocalStorageItem = { SKU: sku, NAME: name, PRICE: salePrice };
  localStorage.setItem(sku, JSON.stringify(sendLocalStorageItem));
  // document.location.reload(true);
  return removeItemOfHtml();
};

function listItemsForSelect(dataSearch) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${dataSearch}`;
  fetch(endpoint)
    .then((response) => {
      response.json().then((data) => {
        data.results.forEach((productItem) => {
          const sku = productItem.id;
          const name = productItem.title;
          const image = productItem.thumbnail;
          const product = { sku, name, image };
          createProductItemElement(product);
        });
      });
    });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const getClickElements = () => {
  clickSelection.addEventListener('click', function (event) {
    if (event.target.nodeName === 'BUTTON' && event.target.className === 'item__add') {
      const elementClickedId = event.path[1].firstChild.innerText;
      setCartItem(elementClickedId, localStorageCreateItem);
    }
  });
};

const cartItemClickListener = () => {
  clickSelection.addEventListener('click', (event) => {
    if (event.target.nodeName === 'LI') {
      const itemSelected = event.target.innerText;
      const idOfItemSelected = itemSelected.split(' ');
      localStorage.removeItem(idOfItemSelected[1]);
      removeItemOfHtml();
    }
  });
};

const clearAllCart = () => {
  const buttonCart = document.querySelector('.empty-cart');
  buttonCart.addEventListener('click', () => {
    localStorage.clear();
    return removeItemOfHtml();
  });
};

window.onload = function onload() {
  listItemsForSelect('computador');
  getClickElements();
  loadItemLocalStorage();
  cartItemClickListener();
  clearAllCart();
};
