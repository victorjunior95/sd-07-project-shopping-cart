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

const removeItemOfHtml = (nameClassOfFather, callback) => {
  const elemFather = document.querySelector(nameClassOfFather);
  while (elemFather.lastElementChild) {
    elemFather.removeChild(elemFather.lastElementChild);
  }
  if (callback === undefined) {
    return undefined;
  }
  return callback();
};

const localStorageCreateItem = ({ sku, name, salePrice }) => {
  const sendLocalStorageItem = { SKU: sku, NAME: name, PRICE: salePrice };
  localStorage.setItem(sku, JSON.stringify(sendLocalStorageItem));
  return removeItemOfHtml('.cart__items', loadItemLocalStorage);
};

const listItemsForSelect = async (dataSearch) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${dataSearch}`;
  try {
    const response = await fetch(endpoint);
    await removeItemOfHtml('.items');
    const object = await response.json();
    return object.results;
  } catch (erro) {
    return alert(erro);
  }
};

const getDataApi = async () => {
  const data = await listItemsForSelect('computador');
  data.forEach((productItem) => {
    const sku = productItem.id;
    const name = productItem.title;
    const image = productItem.thumbnail;
    const product = { sku, name, image };
    createProductItemElement(product);
  });
};

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
      removeItemOfHtml('.cart__items', loadItemLocalStorage);
    }
  });
};

const clearAllCart = () => {
  const buttonCart = document.querySelector('.empty-cart');
  buttonCart.addEventListener('click', () => {
    localStorage.clear();
    return removeItemOfHtml('.cart__items', loadItemLocalStorage);
  });
};

window.onload = function onload() {
  // listItemsForSelect('computador');
  getDataApi();
  loadItemLocalStorage();
  getClickElements();
  cartItemClickListener();
  clearAllCart();
};
