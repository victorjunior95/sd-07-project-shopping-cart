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
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return sectionProducts.appendChild(section);
}
const carItems = (idReceived, callback) => {
  const endpoint = `https://api.mercadolibre.com/items/${idReceived}`;
  fetch(endpoint).then((response) => {
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) => {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (evt) => {
    if (evt.target.nodeName === 'BUTTON' && evt.target.className === 'item__add') {
      carItems();
    }
  });
  return ol.appendChild(li);
};
const loadItemLocalStorage = () => {
  let arrayPropagationData = [];
  const productLoadStorage = localStorage.getItem('products');
  if (arrayPropagationData === null) {
    arrayPropagationData = [];
    return arrayPropagationData;
  }
  return arrayPropagationData;
};

const removeItemOfHtml = (nameClassOfFather, callback) => {
  const fatherElement = document.querySelector(nameClassOfFather);
  while (fatherElement.lastElementChild);
}
if (callback === undefined) {
  return undefined;
}
return callback();
};
let productsForSendLocal = [];

const cartSum = async () => {
  const carts = await loadItemLocalStorage();
  const sumProductsCart = await carts.reduce((acc, curr) => acc + curr.PRICE, 0);
  const pricePage = document.querySelector('.total-price');
  pricePage.innerText = sumProductsCart;
};

const productGeneralSave = (products) => {
  removeItemOfHtml('.cart__items');
  products.forEach((productElement) => {
    createCartItemElement({
      sku: productElement.SKU,
      name: productElement.NAME,
      salePrice: productElement.PRICE,
    });
  });
localStorage.setItem('products', JSON.stringify(productsForSendLocal));
cartSum();
productsForSendLocal = [];
};
const convertArraysforObjects = (newProduct) => {
  const productsLocalStorage = loadItemLocalStorage();
  if (productsLocalStorage.length !=== 0) {
    productsLocalStorage.forEach((element) => {
      productsForSendLocal.push(element);
    });
  }
  if (typeof (newProduct) !== 'undefined') {
    productsForSendLocal.push({
      SKU: newProduct.sku, NAME: newProduct.name, PRICE: newProduct.salePrice,
    });
  }
  return productGeneralSave(productsLocalStorage);
}
const listItemsSelect = async (dataSearch) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${dataSearch}`;
  try {
    const response = await fetch(endpoint);
    await removeItemOfHtml(".items");
    const objects = await response.json();
    return objects.results;
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
      setCartItem(elementClickedId, convertProductsArrayForObjects);
    }
  });
};
const cartItemClickListener = () => {
  clickSelection.addEventListener('click', (event) => {
    if (event.target.nodeName === 'LI') {
      productsForSendLocalStorage = [];
      const itemSelected = event.target.innerText;
      const captureDataLocalStorage = loadItemLocalStorage();
      const idOfItemSelected = itemSelected.split(' ');
      const indexLocale = [];
      captureDataLocalStorage.forEach((productElem, index) => {
        if (productElem.SKU === idOfItemSelected[1]) {
          indexLocale.push(index);
        }
      });
      captureDataLocalStorage.splice(indexLocale[0], 1);
      productsForSendLocalStorage = captureDataLocalStorage;
      productGenerateAndSave(productsForSendLocalStorage);
    }
  });
};

const clearAllCart = () => {
  const buttonCart = document.querySelector('.empty-cart');
  buttonCart.addEventListener('click', () => {
    localStorage.clear();
    return removeItemOfHtml('.cart__items', convertProductsArrayForObjects);
  });
};
const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint).then(response => response.json()).then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
    });
  });
};
window.onload = function onload() {
  getDataApi();
  convertProductsArrayForObjects();
  getClickElements();
  cartItemClickListener();
  clearAllCart();
  loadProducts();
};
