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

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
const handleProducts = (products) => {
  const items = document.querySelector('.items');
  products.forEach((product) => {
    const id = product.id;
    const title = product.title;
    const thumbnail = product.thumbnail;
    const addItem = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });
    items.appendChild(addItem);
  });
};


const showAlert = (message) => {
  window.alert(message);
};
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}
/*------------------------------------*/
const handleProductPerId = (product) => {
  const ol = document.querySelector('.cart__items');
  const addItem = createCartItemElement({
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  });
  ol.appendChild(addItem);
};
const fetchProductPerId = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (response.error) {
      throw new Error(response.error);
    } else {
      handleProductPerId(object);
    }
  } catch (error) {
    showAlert(`Houve um erro ${error} - Entre em contato com o suporte`);
  }
};
const getIdButtonClicked = () => {
  const id = event.target.parentNode.firstChild.innerText;
  fetchProductPerId(id);
};
const getButtonProduct = () => {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((item) => {
    item.addEventListener('click', getIdButtonClicked);
  });
};
const fetchProductsML = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (response.error) {
      throw new Error(response.error);
    } else {
      handleProducts(object.results);
      getButtonProduct();
    }
  } catch (error) {
    showAlert(`Houve um erro ${error} - Entre em contato com o suporte`);
  }
};

window.onload = function onload() {
  fetchProductsML();
};
