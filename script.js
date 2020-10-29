function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Referencia de estudos de caso : Aluno Daniel Cespedes
const addElementToChart = () => {
  const arrayElements = document.querySelector('.items');
  arrayElements.addEventListener('click', async (event) => {
    const btnSelected = event.target;
    // element.closet -> https://developer.mozilla.org/pt-BR/docs/Web/API/Element/closest
    const elementId = btnSelected.closest('.item').firstChild.innerText;
    const endPoint = `https://api.mercadolibre.com/items/${elementId}`;
    const resultEndPoint = await fetch(endPoint);
    const jasonItem = await resultEndPoint.json();
    const { id: sku, title: name, price: salePrice } = jasonItem;
    const itemSelected = { sku, name, salePrice };
    const li = createCartItemElement(itemSelected);
    li.classList.add('selected');
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getImageItems = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(endpoint)
    .then(response => response.json()).then((object) => {
      const items = document.querySelector('.items');
      object.results.forEach((productList) => {
        const { id: sku, title: name, thumbnail: image } = productList;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    });
};

window.onload = function onload() {
  getImageItems();
  addElementToChart();
};
