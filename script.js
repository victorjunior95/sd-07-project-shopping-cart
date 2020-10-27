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

const addSectionItems = (section) => {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
};

const newObjectItems = (object) => {
  const newObj = {};
  newObj.sku = object.id;
  newObj.name = object.title;
  newObj.image = object.thumbnail;
  return newObj;
};

const createNewSectionItems = (object) => {
  addSectionItems(createProductItemElement(object));
};

const fetchApiShopping = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endPoint)
    .then(response => response.json())
    .then(data =>
      data.results.forEach((object) => {
        // console.log(object);
        createNewSectionItems(newObjectItems(object));
      }),
    );
};

// ADD LI NA OL
const addLiCartItem = (li) => {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

// SOMANDO ITEMS DA LISTA
// const sumPriceListItems = () => {
//   let count = 0;

//   Object.keys(localStorage).forEach((key) => {
//     const storage = JSON.parse(localStorage.getItem(key));
//     count += storage[key].price;
//     // console.log(count);
//   });

//   const p = document.createElement('p');
//   p.classList.add('total-price');
//   p.innerHTML = `<strong>Valor Total: R$${count}</strong>`;
//   addLiCartItem(p);
// };

// REMOVENDO ITENS DO STORAGE
function cartItemClickListener(event) {
  // console.log(event.target.innerText)
  const parent = event.target.parentNode;

  Object.keys(localStorage).forEach((key) => {
    // console.log(item[key].id)
    if (parent.children[key] === event.target) {
      // console.log('funfou');
      localStorage.removeItem(key);
      parent.removeChild(event.target);
    }
  });
}

// ADICIONANDO LOCAL STORAGE
const addLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  // sumPriceListItems();
};

// ADD NO LOCAL STORAGE
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  addLiCartItem(li);
  const ol = document.querySelector('.cart__items');
  const newArrayStorage = ol.children.forEach(li => console.log(li))
  // console.log(newArrayStorage);
  addLocalStorage('list', newArrayStorage);
}

// ATUALIZAR LOCAL STORAGE
const updateLiStorage = () => {
  
};

// RESGATAR ID DOS ITENS
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// ADD ITEM DA LISTA
const fetchApiIds = (event) => {
  // console.log(event.target.parentNode)
  const id = getSkuFromProductItem(event.target.parentNode);
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endPoint)
    .then(response => response.json())
    .then((data) => {
      createCartItemElement(data);
    });
};

// CRIANDO PRODUTOS
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  button.addEventListener('click', fetchApiIds);
  section.appendChild(button);
  return section;
}

// LIMPANDO TODA LISTA
const clearItems = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = '';
  localStorage.clear();
};

// EVENTO DE LIMPAR BOTÃO
const clearShoppingCar = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearItems);
};


window.onload = function onload() {
  fetchApiShopping('computador');
  updateLiStorage();
  clearShoppingCar();
};
