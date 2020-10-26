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

function createCartElement(product) {
  const items = document.querySelector('.items');
  const elementCreated = createProductItemElement(product);
  items.appendChild(elementCreated);
}

function cartItemClickListener(event) {
  const removeItem = document.querySelector('.cart__items');
  removeItem.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyCart() {
  const itensLista = document.querySelector('.cart__items');
  const itens = document.querySelectorAll('.cart__item');
  for (let item = 0; item < itens.length; item += 1) {
    itensLista.removeChild(itens[item]);
  }
}

function createTotalPrice(value){
  const addLoading = document.querySelector('.total');
  divLoad = document.createElement('div');
  divLoad.className = 'total-price';
  divLoad.innerText = `Preço total do carrinho: $${value}`; 
  addLoading.appendChild(divLoad);
}

function somaTotalPrice(value){
  const addLoading = document.querySelector('.total-price');
  const total = addLoading.innerText;
  addLoading.innerHTML = `Preço total do carrinho: $${(parseFloat(total.split('$')[1]) + value).toFixed(2)}`;
}

function addCartLi(li) {
  const btnempty = document.querySelector('.empty-cart');
  const addLis = document.querySelector('.cart__items');
  addLis.appendChild(li);
  btnempty.addEventListener('click', emptyCart);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__id').innerText;
}

// function openLoading() {
//   const addLoading = document.querySelector('.cart');
//   divLoad = document.createElement('div');
//   divLoad.className = 'loading';
//   divLoad.innerText = `loading`; 
//   addLoading.appendChild(divLoad);
// }

// function closePopup() {
//   const closeLoading = document.querySelector('.loading');
//   closeLoading.remove();
// }

function responseForID(id) {
  const endpointID = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpointID)
    .then(response => response.json())
    .then((productelected) => {
      const addLoading = document.querySelector('.total-price');
      if(addLoading === null ) {
        createTotalPrice(productelected.price);
      }
      else{
        somaTotalPrice(productelected.price);
      }
      addCartLi(createCartItemElement(productelected))
    })
    .catch(error => alert(error));
}

function createItemElement(event) {
  const btnAddItem = document.querySelectorAll('.item__add');
  for (let item = 0; item < btnAddItem.length; item += 1) {
    btnAddItem[item].addEventListener(event, () => {
      const id = getSkuFromProductItem(btnAddItem[item].parentNode);
      responseForID(id);
    });
  }
}

function responseDate(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((product) => {
      product.results.forEach(element => createCartElement(element));
      createItemElement('click');
    })
    .catch(error => alert(error));
}

window.onload = () => {
  responseDate('computador');
};
