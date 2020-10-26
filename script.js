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

const appendList = (section) => {
  const listContainer = document.querySelector('.items');
  listContainer.appendChild(section);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}
const handleResult = (object) => {
  const results = {};
  object.forEach((entry) => {
      results.sku = entry.id;
      results.name = entry.title;
      results.image = entry.thumbnail;
      appendList(createProductItemElement(results));
    });
};

const getListItems = async () => {
    try {
      const myRequest = 'computador';
      const endPoint = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${myRequest}`);
      const response = await endPoint.json();
      handleResult(response.results);
    } catch (error) {
      console.log(error);
    }
  };

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  getListItems();
};
