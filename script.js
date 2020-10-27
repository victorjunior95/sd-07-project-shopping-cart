window.onload = function onload() { 
  loadProducts();
};

const allItems = document.querySelector('.items');

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

const loadProducts = () => {
  const term = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
  .then((response) => {
    response.json()
    .then((data) => {
      if (data.results.length > 0) {
        data.results.forEach((product) => {
          const { id: sku, title: name, thumbnail: image } = product;
          const item = createProductItemElement({ sku, name, image });
          allItems.appendChild(item);
        })
      } else {
        console.error('TERM INVALID');
      }
    })
    .catch(error => console.error('ERROR! Nao foi possivel converter pra json. Link ou term invalido.'));
  })
  .catch(error => console.error('ERROR! Link invalido.'));
}
