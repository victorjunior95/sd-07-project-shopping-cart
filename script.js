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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addProductInCart = (event) => {
  const itemClicked = event.target.parentNode;
  const cart = document.querySelector('.cart__items');
  const itemId = itemClicked.querySelector('.item__sku');
  const addHtml = itemId.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${addHtml}`)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const destructionAll = {
        sku,
        name,
        salePrice,
      };
      const itemToCart = createCartItemElement(destructionAll);
      cart.appendChild(itemToCart);
    });
};

const checkProdutct = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((item) => {
    item.addEventListener('click', addProductInCart);
  });
};
//  Requisito 1 feito com a juda da logica do Vitor em aula
async function itemsFounded() {
  const itemsBox = document.querySelector('.items');
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
        const changedParam = createProductItemElement({ sku, name, image });
        itemsBox.appendChild(changedParam);
      }),
    );
}

window.onload = async function onload() {
  await itemsFounded();
  checkProdutct();
};
