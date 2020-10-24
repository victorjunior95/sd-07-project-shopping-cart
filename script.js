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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

const showAlert = (message) => {
  console.log(message);
};

const addToHTML = (parent, child) => {
  document.querySelector(parent).appendChild(child);
};

const handleAmountOfElementsOnHTML = (amount, jso) => {
  for (let index = 0; index < amount; index += 1) {
    const elementCreated = createProductItemElement({
      sku: jso.results[index].id,
      name: jso.results[index].title,
      image: jso.results[index].thumbnail,
    });
    addToHTML('.items', elementCreated);
  }
};

const handleAPIRequest = async (API_REQ) => {
  try {
    const req = await fetch(API_REQ);
    const jso = await req.json();
    handleAmountOfElementsOnHTML(8, jso);
  } catch (error) {
    showAlert(error);
  }
};

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

window.onload = function onload() {
  handleAPIRequest(
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador',
  );
};
