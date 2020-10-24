function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const showAlert = (message) => {
  console.log(message);
};

const addToHTML = (parent, child) => {
  document.querySelector(parent).appendChild(child);
};

const setLocalSave = () => {
  localStorage.setItem(
    'Cart_Items',
    document.querySelector('.cart__items').innerHTML,
  );
};

function cartItemClickListener(event) {
  event.target.remove();
  setLocalSave();
}

const getLocalSave = () => {
  const currentSave = localStorage.getItem('Cart_Items');

  const list = document.querySelector('.cart__items');
  list.innerHTML = currentSave;
  document.querySelectorAll('.cart__item').forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  return currentSave;
};

const PRICES_ARRAY = [];

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

  PRICES_ARRAY.push(salePrice);

  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const sum = () => {
//   return PRICES_ARRAY.reduce(
//     (acumulator, currentValue) => currentValue + acumulator,
//     0,
//   );
// };

const handleAPIRequestToPrice = (API_REQ) => {
  fetch(API_REQ)
    .then(function (response) {
      return response.json();
    })
    .then((obj) => {
      if (obj.error) {
        throw new Error(obj.error);
      }
      return obj;
    })
    .then((resp) => {
      addToHTML('.cart__items', createCartItemElement(resp));
      sum();
      setLocalSave();
    })
    .catch(showAlert);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const productItemClickListener = (event) => {
  const itemSection = event.target.parentNode;
  const id = getSkuFromProductItem(itemSection);
  handleAPIRequestToPrice(`https://api.mercadolibre.com/items/${id}`);
};

const setupEventHandlers = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    setLocalSave();
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', productItemClickListener);
  }
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

const handleAmountOfElementsOnHTML = (res) => {
  const product = Object.entries(res);

  product.forEach((entry) => {
    const elementCreated = createProductItemElement(entry[1]);
    addToHTML('.items', elementCreated);
  });
};

const handleAPIRequest = async (API_REQ) => {
  try {
    const req = await fetch(API_REQ);
    const jso = await req.json();
    if (jso.error) {
      throw new Error(jso.error);
    }
    handleAmountOfElementsOnHTML(jso.results);
  } catch (error) {
    showAlert(error);
  }
};

window.onload = function onload() {
  handleAPIRequest(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  getLocalSave();
  setupEventHandlers();
};
