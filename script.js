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

const showAlert = (message) => {
  window.alert(message);
};

const updateCart = () => {
  localStorage.setItem('ol', document.querySelector('.cart__items').innerHTML);
};

async function cartItemClickListener(event) {
  await event.target.remove();
  updateCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAddCar = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const ol = document.querySelector('.cart__items');
    if (object.error) {
      throw new Error(object.error);
    } else {
      ol.appendChild(createCartItemElement(object));
    }
  } catch (error) {
    showAlert(error);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', async function (event) {
    const parentElement = await event.target.parentElement;
    await fetchAddCar(getSkuFromProductItem(parentElement));
    updateCart();
  });
  section.appendChild(button);
  return section;
}

const fetchList = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const items = document.querySelector('.items');
    if (object.error) {
      throw new Error('Um erro ocorreu!');
    } else {
      object.results.forEach((result) => {
        items.appendChild(createProductItemElement(result));
      });
    }
  } catch (error) {
    showAlert(error);
  }
};

const loadLocalStorage = () => {
  const ol = document.querySelector('.cart__items');
  if (localStorage.ol) {
    ol.innerHTML = localStorage.getItem('ol');
    ol.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  }
};

window.onload = function onload() {
  fetchList();
  loadLocalStorage();
};
