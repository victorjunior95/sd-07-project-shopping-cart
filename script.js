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
  const tagFather = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  tagFather.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Utilizar para remover um item do carrinho
function cartItemClickListener(event) {
  // coloque seu código aqui

}

// Utilizar para criar os componentes HTML referentes a um item do carrinho
function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const tagFather = document.querySelector('.cart')
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  tagFather.appendChild(li);
}

const handleResultes = (results) => {
  const resEnt = Object.values(results);
  resEnt.forEach(comp => createProductItemElement(comp));
};

const listComputersSearch = async (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}&limit=10`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      handleResultes(object.results);
    }
  } catch (error) {
    console.log(error);
  }
};

const computerSearch = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      createCartItemElement(object);
    }
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() {
  document.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      computerSearch(event.target.parentElement.firstChild.innerText);
    }
  })
  listComputersSearch('computador');
};
