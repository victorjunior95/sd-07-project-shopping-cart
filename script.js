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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__id').innerText;
}

function getRandomNumber() {
  const ramdom = Math.random() * (49);
  const aleatorio = Math.floor(ramdom) + 1;
  return aleatorio;
}

function cartItemClickListener(event, produto) {
  const btnAddItem = document.querySelectorAll('.item__add');
  const addLis = document.querySelector('.cart__items');
  for (let item of btnAddItem) {
    item.addEventListener(event, () => {
      let index = 0;
     const itemSelected = produto.find(itemSelect => {
      })
      //console.log(itemSelected)
      const createLi = createCartItemElement(produto);
      addLis.appendChild(createLi);
      console.log("passei aqui")
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

function createCartElement(produtos) {
  const itemSelect = produtos.results[getRandomNumber()];
  const items = document.querySelector('.items');
  const elementCreated = createProductItemElement(itemSelect);
  items.appendChild(elementCreated);
  return itemSelect;
}

function creategrid(produtos) {
  const itemSelect1 = createCartElement(produtos);
  const itemSelect2 = createCartElement(produtos);
  const itemSelect3 = createCartElement(produtos);
  const itemSelect4 = createCartElement(produtos);
  const itemSelect5 = createCartElement(produtos);
  const itemSelect6 = createCartElement(produtos);
  const itemSelect7 = createCartElement(produtos);
  const itemSelect8 = createCartElement(produtos);
  return [itemSelect1, itemSelect2, itemSelect3,
    itemSelect4, itemSelect5, itemSelect6, itemSelect7, itemSelect8]
}

function responseDate(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((produtos) => {
      const itensSelected = creategrid(produtos);
      cartItemClickListener('click', itensSelected);
    })
    .catch(error => alert(error));
}

function responseForID(query) {
  const endpoint = `https://api.mercadolibre.com/items/${query}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((produtos) => {
      const itensSelected = creategrid(produtos);
      cartItemClickListener('click', itensSelected);
    })
    .catch(error => alert(error));
}

window.onload = () => {
  responseDate('computador');
};
