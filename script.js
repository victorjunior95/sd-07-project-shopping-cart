function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
const fetchComputer = search => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;

  fetch(endpoint)
    .then(response => response.json())
    .then(object => {
      if (object.error) {
        throw new Error(object.error);
      } else {
        // Abstração facilitada pelo colega Vitor Rodrigues
        const itemsSection = document.querySelector('.items');
        const resultProduct = object.results;
        resultProduct.forEach(product => {
          const { id: sku, title: name, thumbnail: image } = product;
          const eachItem = createProductItemElement({ sku, name, image });
          itemsSection.appendChild(eachItem);
        });
      }
    });
};
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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

window.onload = function onload() {
  fetchComputer('computador');
};
