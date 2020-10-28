const findItemAndReturnArrayObject = async (item) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  try {
    const response = await fetch(endPoint);
    const object = await response.json();
      if (object.error) {
       throw new Error(object.error);
     } else {
      return object.results;
    }
  } catch (error) {
    alert(error);
  }
};

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

function appendElementInAClass(classFather, classChild) {
  father = document.querySelector(classFather);
  child = document.querySelector(classChild);
  father.appendChild(child);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadProducts = () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$COMPUTADOR';
  fetch(endPoint)
  .then(response => (response.json()))
  .then(response => response.results.forEach((product) => {
    const items = document.querySelector('.items');
    const { id: sku, title: name, thumbnail: image } = product;
    const item = createProductItemElement({ sku, name, image });
    items.appendChild(item);
  }));
};

window.onload = async function onload() {
  loadProducts();
  const arrayOfProducts = await findItemAndReturnArrayObject();
  console.log(arrayOfProducts);
};
