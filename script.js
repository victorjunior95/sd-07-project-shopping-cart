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

function cartItemClickListener(event) {
  // recuperando o filho
  const son = event.target;
  // recuperando o pai do filho
  const father = son.parentNode;
  // removendo o filho do pai
  father.removeChild(son);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// pega informaçao do produto do id do carrinho
const addCart = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(objJson => objJson.json())
  .then((data) => {
    const cart = document.querySelector('.cart__items');
    const productCart = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    cart.appendChild(createCartItemElement(productCart));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonCart.addEventListener('click', (event) => {
    // pega o pai do elemento
    const elementFather = event.target.parentElement;
    addCart(getSkuFromProductItem(elementFather));
  });
  section.appendChild(buttonCart);
  return section;
}

// criando um variavel com paramento para buscar o endereço do appi e transforma em json
const searchAppi = async (element = '$QUERY') => {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${element}`)
  .then(objJson => objJson.json())
  .then((data) => {
    const elementSection = document.querySelector('.items');

    data.results.forEach((product) => {
      // renomeando o paramento para do createProductItemElement
      const { id: sku, title: name, thumbnail: image } = product;
      const productAppende = createProductItemElement({ sku, name, image });
      elementSection.appendChild(productAppende);
    });
  });
  // const objJson = await endpoint.json();
  // console.log(objJson.results);
  // return objJson.results ;
};

window.onload = function onload() {
  searchAppi('computador');
};
