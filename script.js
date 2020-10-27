

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
  section.dataset.id = sku;
  return section;
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }
const addInLocalStorage = (item) => {
  localStorage.setItem('item', item);
};

const removeLocalStorange = (remove) => {
  localStorage.removeItem('item', remove);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const ol = document.querySelector('ol');
  const remove = ol.removeChild(event.target);
  removeLocalStorange(remove);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const inicio = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(endpoint);
  const object = await response.json();
  const arrayResults = object.results;
  const obj = {};
  const classe = document.querySelector('.items');
  arrayResults.forEach((i) => {
    obj.sku = i.id;
    obj.name = i.title;
    obj.image = i.thumbnail;
    classe.appendChild(createProductItemElement(obj));
  });
};

const adicionando = () => {
  const clicado = document.querySelector('.items');
  clicado.addEventListener('click', async (event) => {
    const selecionado = event.target.closest('.item').dataset.id;
    const endpoint = `https://api.mercadolibre.com/items/${selecionado}`;
    const response = await fetch(endpoint);
    const object = await response.json();
    const emptyObject = {
      sku: object.id,
      name: object.title,
      salePrice: object.price,
    };
    const creatLi = createCartItemElement(emptyObject);
    const list = document.querySelector('ol');
    const item = list.appendChild(creatLi);
    addInLocalStorage(item);
  });
};

window.onload = function onload() {
  inicio();
  adicionando();
};
