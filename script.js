window.onload = function onload() {
  listCompadorsSearch();
};

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

// Usar para criar os componentes HTML referentes a um produto
function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
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

// Utilizar para remover um item do carrinho
function cartItemClickListener(event) {
  // coloque seu código aqui
}

// Utilizar para criar os componentes HTMAL referentes a um item do carrinho
function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const listCompadorsSearch = async (query) => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador&limit=10';

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {

      handleResultes(object.results);
    }
  } catch (error) {
    console.log(error)
  }
}

const handleResultes = (results) => {
  const resultesEntries = Object.values(results);
  const sectionFather = document.querySelector('.items');

  resultesEntries.forEach(computer => sectionFather.appendChild(createProductItemElement(computer)));
}
