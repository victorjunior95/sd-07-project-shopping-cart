window.onload = function onload() { };

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//codigo aqui
window.onload = () => {
  searchItem();
}


const searchItem = async (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=computador`;
  
  fetch(endpoint).then(response => response.json().then(data => {
    const items = document.querySelector('.items');
    data.results.forEach(product =>{
      const {id: sku, title: name, thumbnail: image} = product;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
    })
  }))
}


const listItems = (local) => {
  const place = document.querySelector('.items');
  place.innerHTML = local;
}