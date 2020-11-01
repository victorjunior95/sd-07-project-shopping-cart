function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
    addItemCart({ sku });
  });

  section.appendChild(button);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const loadProducts = () => {
  const QUERY = 'computador'
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach(({ id, title, thumbnail }) => {
      const item = { sku: id, name: title, image: thumbnail };
      items.appendChild(createProductItemElement(item));
    });
  });
};
//
const saveCarItens = () => localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);

const filterNumber = value => value.match(/([0-9.]){1,}$/);

const totalPrice = () => {
  const products = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  const total = [...products].map(product => filterNumber(product.textContent))
    .reduce((acc, curr) => (acc + parseFloat(curr)), 0);
  totalPrice.innerText = total;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  saveCarItens();
  totalPrice();
};


const emptyItens = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  saveCarItens();
  totalPrice();
};


window.onload = async () => {
  loadProducts();
  const empty = document.querySelector('.empty-cart');
  empty.addEventListener('click', function () {
    emptyItens();
  });
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
  document.querySelectorAll('li')
  .forEach(product => product.addEventListener('click', cartItemClickListener));
};

/*const consulta = () => {
  const QUERY = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    });
};*/

/*window.onload = function onload() {
  consulta();
};*/


// ao clicar no botao ... add event listener
// const add = document.querySelector('.item__add');
// add.addEventListener('click', addInShopCar());
// 'ao clicar no botao' faça a requisição da api em que $ItemID deve ser o valor id
// const addInShopCar = () => {
//   const ItemID = add.id;
//   const endpoint = `https://api.mercadolibre.com/items/${ItemID}`
// }
// receber apenas 1 item para passar nojson
// desestruturar o produto para { sku, name, salePrice }
// passar o produto desestruturado no createCartItemElement
// retornar o prudoto como filho de <ol class="cart__items">
