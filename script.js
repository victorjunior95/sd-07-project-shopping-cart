function showError(message) {
  return window.alert(message);
}

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

function pageLoading() {
  document.querySelector('.container').appendChild(
    createCustomElement('h1', 'loading', 'loading...'));
  setTimeout(() => {
    document.querySelector('.container').removeChild(
      document.querySelector('.loading'));
  }, 300);
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

async function searchProducts(prdoduct) {
  const items = document.querySelector('.items');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${prdoduct}`)
    .then(result => result.json())
    .then((object) => {
      pageLoading();
      object.results.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    })
    .catch(erro => showError(erro));
}

window.onchange = function () {
  localStorage.setItem('saved-cart', document.querySelector('.cart').innerHTML);
};

window.onload = function onload() {
  const prdoduct = 'computador';
  searchProducts(prdoduct);
  // document.querySelector('.cart').innerHTML = localStorage.getItem('saved-cart');
};
