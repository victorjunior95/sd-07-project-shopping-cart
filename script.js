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
// forEach feito com a ajuda da resolução realizada pelo Vitor no fechamento do dia 26/10
const fetchProducts = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  try {
    const responseURL = await fetch(endpoint);
    const object = await responseURL.json();
    adaptJSONResponses(object); 
  } catch (Error) {
  alert(Error);
  }
}

const adaptJSONResponses = (object) => {
  const itemsElementHTML = document.querySelector('.items');
  object.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const item = createProductItemElement({ sku, name, image });
    itemsElementHTML.appendChild(item);
  });
  buttonAddShopCart();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// add um evento ao botão 'Adicionar ao carrinho
// realizar uma requisição para o endpoint 
// "https://api.mercadolibre.com/items/$ItemID"
// substituindo $ItemId pelo id selecionado. 
// retornará um json com UM item
// usar função acima para criar os componentes HTML
// FILHO do cart_items

const buttonAddShopCart = () => {
  const allButtonsAddItem = document.getElementsByClassName('.item_add');
  allButtonsAddItem.forEach((button) => { 
    button.addEventListener('click', () => {
      console.log("teste");
    });
  });
}

window.onload = function onload() {
  fetchProducts();
};
