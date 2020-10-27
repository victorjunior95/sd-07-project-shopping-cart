const saveList = () => {
  localStorage.clear();
  localStorage.setItem('listaComputers', document.querySelector('.cart__items').innerHTML);
};

// Utilizar para remover um item do carrinho
function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    event.target.parentElement.removeChild(event.target);
  }
  saveList();
}

const loadList = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('listaComputers');
  document.querySelectorAll('.cart__item').forEach(li => li.addEventListener('click', cartItemClickListener));
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

// Usar para criar os componentes HTML referentes a um produto
function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  const tagFather = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  tagFather.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

/* const totalPriceSum = async () => {
  const totalPrices = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  const object = await response.json();
  console.log(object);
} */

// Utilizar para criar os componentes HTML referentes a um item do carrinho
function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const tagFather = document.querySelector('.cart__items');
  const totalPrices = document.querySelector('.total-price');

  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  tagFather.appendChild(li);
  totalPrices.innerText = parseInt(totalPrices.innerText, 10) + parseInt(salePrice, 10);
  totalPriceSum();
  saveList();
}

const handleResultes = (results) => {
  const resEnt = Object.values(results);
  resEnt.forEach(comp => createProductItemElement(comp));
};

const listComputersSearch = async (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}&limit=10`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      handleResultes(object.results);
    }
  } catch (error) {
    console.log(error);
  }
};

const computerSearch = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      createCartItemElement(object);
    }
  } catch (error) {
    console.log(error);
  }
};

const clearList = function(){
  return document.querySelector('.cart__items').innerHTML = '';
} 


window.onload = function onload() {
  loadList();
  document.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      computerSearch(event.target.parentElement.firstChild.innerText);
    }
  });
  listComputersSearch('computador');
  document.querySelector('.empty-cart').addEventListener('click', clearList);
};
