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
  const section = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const handleComputerItem = (object) => {
  object.forEach((computer) => {
    const newObject = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    return createProductItemElement(newObject);
  });
};

const fetchDataComputer = (endpoint) => {
  fetch(endpoint)
    .then(data => data.json())
    .then(data => handleComputerItem(data.results));
};
window.onload = function onload() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchDataComputer(endpoint);
};
