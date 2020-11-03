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

const sumPrices = () => {
  const allItemCart = document.querySelectorAll('.cart__item');
  let sum = 0;
  allItemCart.forEach((li) => {
    sum += parseFloat(li.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = sum;
};

const emptyCart = () => {
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    sumPrices();
  });
};

async function cartItemClickListener(event) {
  await event.target.remove();
  sumPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Conforme orientado pelo colega Tiago Esdra.
const fetchAddItemCart = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(object));
  sumPrices();
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
  const button = section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  button.addEventListener('click', async function (event) {
    const parentElement = await event.target.parentElement;
    await fetchAddItemCart(getSkuFromProductItem(parentElement));
  });
  section.appendChild(button);
  return section;
}

const fetchComputer = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computer';
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const items = document.querySelector('.items');
      object.results.forEach((product) => {
        const item = createProductItemElement(product);
        items.appendChild(item);
      });
    });
  // Conforme ajuda do colega Vitor Rodrigues.
};

window.onload = function onload() {
  fetchComputer();
  emptyCart();
};

// const handleComputers = (computers) => {
//   console.log(computers);
// };
