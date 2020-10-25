window.onload = function onload() { };
const showAlert = (message) => {
  window.alert(message);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

const productOnScreen = (vector) => {
  const items = document.querySelector('.items');
  vector.forEach(item => items.appendChild(createProductItemElement(item)));
};
const fecthComputerAsyncAwait = async () => {
  const endpoints = 'https://api.mercadolibre.com/sites/MLB/search?q=computador&limit=8';
  try {
    const response = await fetch(endpoints);
    const objekt = await response.json();
    if (objekt.error) {
      throw new Error(objekt.error);
    } else {
      productOnScreen(objekt.results);
    }
  } catch (error) {
    showAlert(error);
  }
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
  // coloque seu código aqui
//  }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }


fecthComputerAsyncAwait();
