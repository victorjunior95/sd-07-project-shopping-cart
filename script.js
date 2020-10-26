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
  const sectionShowProducts = document.querySelector('#presentationItems');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return sectionShowProducts.appendChild(section);
}

const cartItemClickListener = (event, callback) => {
  const endpoint = `https://api.mercadolibre.com/items/${event}`;
  fetch(endpoint)
    .then((response) => {
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

const createCartItemElement = ({ sku, name, salePrice }) => {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return ol.appendChild(li);
};

function listItemsForSelect(dataSearch) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${dataSearch}`;
  fetch(endpoint)
    .then((response) => {
      response.json().then((data) => {
        data.results.forEach((productItem) => {
          const sku = productItem.id;
          const name = productItem.title;
          const image = productItem.thumbnail;
          const product = { sku, name, image };
          createProductItemElement(product);
        });
      });
    });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const getClickElements = () => {
  clickSelection.addEventListener('click', function (event) {
    if (event.target.nodeName === 'BUTTON') {
      const elementClickedId = event.path[1].firstChild.innerText;
      cartItemClickListener(elementClickedId, createCartItemElement);
    }
  });
};

window.onload = function onload() {
  listItemsForSelect('computador');
  getClickElements();
};
