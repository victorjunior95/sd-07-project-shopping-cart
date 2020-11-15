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

function setLocal() {
  const cardItems = document.querySelector('.cart__items');
  // innerHTML TRANSFORMA O OBJETO  EM UM TEXTO.
  localStorage.setItem('items', cardItems.innerHTML);
}

function cartItemClickListener(event) {
  // recuperando o filho
  const son = event.target;
  // recuperando o pai do filho
  const father = son.parentNode;
  // removendo o filho do pai
  father.removeChild(son);
  setLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoading() {
  const container = document.querySelector('.container');
  const createLoad = createCustomElement('h1', 'load', 'loading...');
  return container.appendChild(createLoad);
}
// criando um load para aparecer na requisições
function renderLoad() {
  // criado um variavel para armazenar a class '.load'
  const loadCaptured = document.querySelector('.load');
  // verificando e o load retorna alguma coisa.
  if (!loadCaptured) {
    return createLoading();
  }
  // caso se existe o load e retirado
  return loadCaptured.remove();
}
// pega informaçao do produto do id do carrinho
const addCart = (id) => {
  renderLoad();
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
      setLocal();
      renderLoad();
    });
};

function getLocal() {
  // pega o  item do html
  const cardItems = document.querySelector('.cart__items');
  // pegando o item no localStorage
  const localGetItem = localStorage.getItem('items');

  // convertendo em interpretação de javascript
  cardItems.innerHTML = localGetItem;

  // pegando o item individual
  const cardItem = document.querySelectorAll('.cart__item');
  cardItem.forEach(li => li.addEventListener('click', cartItemClickListener));
}

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
const searchAppi = (element = '$QUERY') => {
  renderLoad();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${element}&limit=6`)
    .then(objJson => objJson.json())
    .then((data) => {
      const elementSection = document.querySelector('.items');

      data.results.forEach((product) => {
        // renomeando o paramento para do createProductItemElement
        const { id: sku, title: name, thumbnail: image } = product;
        const productAppende = createProductItemElement({ sku, name, image });
        elementSection.appendChild(productAppende);
      });
      renderLoad();
    });
  // const objJson = await endpoint.json();
  // console.log(objJson.results);
  // return objJson.results ;
};

const cleanInput = () => {
  const clearAllButton = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  clearAllButton.addEventListener('click', () => {
    ol.innerHTML = '';
    setLocal();
  });
};

window.onload = function onload() {
  searchAppi('computador');
  getLocal();
  cleanInput();
};
