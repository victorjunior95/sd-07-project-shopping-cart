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
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const showAlert = (message) => {
  window.alert(message);
};

const handleQuery = (myQueryObject) => {
  const itemsList = document.querySelector('.items');
  myQueryObject.forEach((entry) => {
    const item =
      createProductItemElement({ sku: entry.id, name: entry.title, image: entry.thumbnail });
    itemsList.appendChild(item);
  });
};

const fetchQuery = async (myQuery) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${myQuery}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      handleQuery(object.results);
    }
  } catch (error) {
    showAlert(error);
  }
};

window.onload = function onload() {
  // Query for computer
  const QUERY = 'computador';
  fetchQuery(QUERY);
};
