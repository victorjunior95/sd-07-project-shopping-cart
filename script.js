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

// Cria elementos que vão receber os valores totais

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const sumOfItems = () => {
  const cart = document.querySelector('.cart__items').childNodes;
  let totalSum = 0;
  cart.forEach(item => {
    const itemValue = item.innerText.split('$');
    totalSum += parseFloat(itemValue[1]);
  });
  const divSumAllItems = document.querySelector('.total-price');
  divSumAllItems.innerText = totalSum;
};

function cartItemClickListener(event) {
  event.target.remove();
  sumOfItems();
}

const emptyCartButton = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    sumOfItems();
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumOfItems();
  return li;
}

// adapta JSON para item do carrinho
const adaptJSONItem = (object) => {
  const cartItems = document.querySelector('.cart__items');
  const { id: sku, title: name, price: salePrice } = object;
  cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
  // cartItems.appendChild(item);
};

// busca o JSON e chama função pra adaptar o objeto.
const functionFetchJSON = async (endpoint, adaptFunction) => {
  try {
    const responseURL = await fetch(endpoint);
    const object = await responseURL.json();
    adaptFunction(object);
  } catch (Error) {
    alert(Error);
  }
};

const addToCart = async (itemID) => {
  const endpointByID = `https://api.mercadolibre.com/items/${itemID}`;
  functionFetchJSON(endpointByID, adaptJSONItem);
};

const buttonAddToCart = () => {
  const allButtonsAddItem = document.querySelectorAll('.item__add');
  allButtonsAddItem.forEach((button) => {
    button.addEventListener('click', () => {
      const cartItem = button.parentNode.querySelector('.item__sku').innerText;
      addToCart(cartItem);
    });
  });
};

// forEach feito com a ajuda da resolução realizada pelo Vitor no fechamento do dia 26/10
const adaptJSONResponses = (object) => {
  const itemsElementHTML = document.querySelector('.items');
  object.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const item = createProductItemElement({ sku, name, image });
    itemsElementHTML.appendChild(item);
  });
  buttonAddToCart();
};

const fetchProducts = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  functionFetchJSON(endpoint, adaptJSONResponses);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const elementsHTMLSumOfItems = () => {
  const elementSumHTML = document.createElement('div');
  elementSumHTML.className = 'div-sum-prices';
  elementSumHTML.innerHTML = 'Valor total:';
  const divSumAllItems = document.createElement('div');
  divSumAllItems.className = 'total-price';
  elementSumHTML.appendChild(divSumAllItems);
  const containerHTML = document.querySelector('.container');
  containerHTML.appendChild(elementSumHTML);
};

window.onload = function onload() {
  fetchProducts();
  elementsHTMLSumOfItems();
  emptyCartButton();
};
