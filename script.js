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

function cartItemClickListener() {
  // coloque seu código aqui
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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
  getSkuFromProductItem();
  cartItemClickListener();
  createCartItemElement();
};
