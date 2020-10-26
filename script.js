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

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  return li;
}

const clickButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const resultButton = event.target.parentNode;
      const textId = resultButton.childNodes[0].innerText;
      fetchProduct(textId);
    });
  });
};

const fetchCurrency = async (currency) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${currency}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      object.results.forEach((item) => {
        // Criação de Div produto
        const classItems = document.querySelector('.items');
        classItems.appendChild(createProductItemElement(item));
        // Criação Title Produto
        createCustomElement('p', 'item-title', item.title);
        // Criação img Produto
        createProductImageElement(item.thumbnail);
      });
      clickButton(object.results);
    }
  } catch (error) {
    console.error(error);
  }
};

const saveStorage = () => {
  createCartItemElement
  localStorage.setItem(0, li.innerHTML)
}

const fetchProduct = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  await fetch(endpoint)
    .then(response => response.json())
    .then(data => createCartItemElement(data))
    .then(save => saveStorage(save))
    .catch(error => error);
};

window.onload = function onload() {
  fetchCurrency('computador');
  if (localStorage[0] !== undefined) {
    document.querySelector('.cart__items').innerHTML = localStorage[0];
  }
};
