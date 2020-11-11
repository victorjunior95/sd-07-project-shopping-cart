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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createItemInLocalStorage({ id: sku, title: name, price: salePrice }) {
  const object = {
    id: sku,
    title: name,
    price: parseFloat(salePrice),
  };

  const verifyItem = JSON.parse(localStorage.getItem(object.id));
  if (verifyItem !== null) {
    object.price += verifyItem.price;
    const objectLocalStorage = JSON.parse(localStorage.getItem(sku));
    object.amount = objectLocalStorage.amount + 1;
    localStorage.setItem(sku, JSON.stringify(object));
  } else if (verifyItem === null) {
    object.amount = 1;
    localStorage.setItem(sku, JSON.stringify(object));
  }
}

function removeItemFromLocalStorage(event) {
  const id = event.target.id;
  const verifyItemlocalStorage = JSON.parse(localStorage.getItem(id));
  const amountLocalStorage = JSON.parse(verifyItemlocalStorage.amount);
  const unityPrice = verifyItemlocalStorage.price / amountLocalStorage;

  if (verifyItemlocalStorage.price !== 0) {
    const newPrice = verifyItemlocalStorage.price - unityPrice;
    verifyItemlocalStorage.price = newPrice;
    verifyItemlocalStorage.amount = amountLocalStorage - 1;
    localStorage.setItem(id, JSON.stringify(verifyItemlocalStorage));
    if (verifyItemlocalStorage.price === 0) {
      localStorage.removeItem(id);
    }
  }
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  removeItemFromLocalStorage(event);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleItems() {
  const valuesLocalStorage = Object.values(localStorage);
  let acc;
  const tagOl = document.querySelector('.cart__items');
  valuesLocalStorage.forEach((element) => {
    acc = JSON.parse(element);
    for (let i = 0; i < acc.amount; i += 1) {
      tagOl.appendChild(createCartItemElement(acc));
    }
  });
}

const fetchProductAndAddCart = (itemID) => {
  const ol = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(response => response.json())
    .then((product) => {
      createItemInLocalStorage(product);
      ol.appendChild(createCartItemElement(product));
    });
};

const productId = (event) => {
  const parentElement = event.target.parentElement;
  const id = parentElement.firstChild.innerText;

  return id;
};

const createButtonAndAddEvent = () => {
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (event) => {
    fetchProductAndAddCart(productId(event));
  });

  return button;
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createButtonAndAddEvent());
  return section;
}

const createListItems = (QUERY) => {
  section = document.querySelector('.items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${QUERY}`)
    .then(response => response.json())
    .then(data => data.results.forEach((result) => {
      section.appendChild(createProductItemElement(result));
    }));

  return section;
};

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  const tagCartItems = document.querySelector('.cart__items');
  clearButton.addEventListener('click', () => localStorage.clear());
  clearButton.addEventListener('click', () => {
    for (let i = 1; i <= tagCartItems.clientHeight; i += 1) {
      tagCartItems.removeChild(tagCartItems.firstChild);
    }
  });
}

window.onload = function onload() {
  createListItems('computadores');
  handleItems();
  clearCart();
};

// Os requisitos 1 e 2 foram feitos após as apresentações sobre cada um
// feitas por @vitor-rc1 e @ThiagoEsdras, por isso as lógicas
// podem estar bastante parecidas.
