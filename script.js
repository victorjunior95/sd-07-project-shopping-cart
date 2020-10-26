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

function addItem(element) {
  const section = document.querySelector('.items');
  section.appendChild(element);
}

function createProductItemElement(name, sku, image) {
  const section = document.createElement('section');
  section.className = 'items';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addItem(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function fetchProduct(products) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${products}`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const name = element.title;
        const sku = element.id;
        const image = element.thumbnail;
        createProductItemElement(name, sku, image);
      });
    });
}

window.onload = function onload() {
  fetchProduct('computador');
};
