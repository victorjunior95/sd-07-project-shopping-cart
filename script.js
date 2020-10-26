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

// const removeFronLocalStorage = () => {
//   const liList = document.querySelectorAll('.cart__item');
//   const split = liList[0].innerText.split('|||');
//   console.log(split);
//   console.log(split[0].substr(5, 12));
//   console.log(split[1].substr(7, split[1].length - 1));
//   console.log(split[2].substr(9));
// };

const cartItemClickListener = (event) => {
  event.target.remove();
  // removeFronLocalStorage();
};

const localStorageQuery = () => localStorage.getItem('shopList');

const addLocalStorage = async ({ sku, name, salePrice }) => {
  let shopList = JSON.parse(localStorageQuery());
  const productObject = {
    sku,
    name,
    salePrice,
  };
  if (shopList === null) {
    shopList = [];
  }
  shopList.push(productObject);
  localStorage.setItem('shopList', JSON.stringify(shopList));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} ||| NAME: ${name} ||| PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadShopCar = async (object) => {
  newObject = JSON.parse(object);
  if (newObject !== null) {
    newObject.forEach((atual, index) => {
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createCartItemElement(newObject[index]));
    });
  }
};

const endpointQuery = async (endpoint) => {
  const result = await fetch(endpoint);
  const object = await result.json();
  return object;
};

async function searchItemByID(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  const object = await endpointQuery(endpoint);
  const objDetails = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(objDetails));
  await addLocalStorage(objDetails);
}

window.onload = async function onload() {
  await loadShopCar(localStorageQuery());
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const object = await endpointQuery(endpoint);
  const objectResults = object.results;
  objectResults.forEach((atual) => {
    const produto = {
      sku: atual.id,
      name: atual.title,
      image: atual.thumbnail,
    };
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(produto));
  });
  document.querySelectorAll('.item').forEach((item) => {
    item.childNodes[3].addEventListener('click', () => {
      searchItemByID(item.childNodes[0].innerText);
    });
  });
};
