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

const request = async () => {
  const apiUrl = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResults = await apiUrl.json();
  const result = jsonResults.results;
  result.forEach((products) => {
    const { id, title, thumbnail } = products;
    const product = { sku: id, name: title, image: thumbnail };
    const itemsList = document.querySelector('.items');
    itemsList.appendChild(createProductItemElement(product));
  });
};

window.onload = function onload() {
  request();
};
