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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__id').innerText;
// }

function getRandomNumber() {
  const ramdom = Math.random() * 49;
  const aleatorio = Math.floor(ramdom) + 1;
  return aleatorio;
}

function responseForID(id) {
  const endpointID = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpointID)
    .then(response => response.json())
    .then((productelected) => {
      console.log(productelected);
    })
    .catch(error => alert(error));
}
/*jshint latedef: nofunc */
function cartItemClickListener(event, product) {
  const btnAddItem = document.querySelectorAll('.item__add');
  const addLis = document.querySelector('.cart__items');
  for (let item = 0; item < btnAddItem.length; item += 1) {
    btnAddItem[item].addEventListener(event, () => {
      const itemSelected = product.find((itemSelect) => {
        responseForID(itemSelect.id);
        return console.log(itemSelect.id);
      });
      console.log(itemSelected);
      const createLi = createCartItemElement(product);
      addLis.appendChild(createLi);
      console.log('passei aqui');
    });
  }
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `ID: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCartElement(product) {
  const itemSelect = product.results[getRandomNumber()];
  const items = document.querySelector('.items');
  const elementCreated = createProductItemElement(itemSelect);
  items.appendChild(elementCreated);
  return itemSelect;
}

function creategrid(product) {
  const itemSelect1 = createCartElement(product);
  const itemSelect2 = createCartElement(product);
  const itemSelect3 = createCartElement(product);
  const itemSelect4 = createCartElement(product);
  const itemSelect5 = createCartElement(product);
  const itemSelect6 = createCartElement(product);
  const itemSelect7 = createCartElement(product);
  const itemSelect8 = createCartElement(product);
  return [
    itemSelect1,
    itemSelect2,
    itemSelect3,
    itemSelect4,
    itemSelect5,
    itemSelect6,
    itemSelect7,
    itemSelect8,
  ];
}

function responseDate(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((product) => {
      const itensSelected = creategrid(product);
      cartItemClickListener('click', itensSelected);
    })
    .catch(error => alert(error));
}

window.onload = () => {
  responseDate('computador');
};
