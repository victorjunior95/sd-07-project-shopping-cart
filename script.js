
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

const consulta = () => {
  const QUERY = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  consulta();
};


// ao clicar no botao ... add event listener
const add = document.querySelector('.item__add');
add.addEventListener('click', addInShopCar());
// 'ao clicar no botao' faça a requisição da api em que $ItemID deve ser o valor id
const addInShopCar = () => {
  const ItemID = add.id;
  const endpoint = `https://api.mercadolibre.com/items/${ItemID}`
}
// receber apenas 1 item para passar nojson
// desestruturar o produto para { sku, name, salePrice }
// passar o produto desestruturado no createCartItemElement
// retornar o prudoto como filho de <ol class="cart__items">