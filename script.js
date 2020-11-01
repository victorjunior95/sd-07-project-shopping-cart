function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// const addTotal = () => {
//   let section = document.createElement('section');
//   section.classList.add('total-price');
//   let postionEl = document.querySelector('.cart');
//   postionEl.appendChild(section);
//   section.innerText = `Preço total $${2+2}`;
// }

const destruct = (obj) => {
  const { id: sku, title: name, price: salePrice, thumbnail: image } = obj;
  const itemSelected = { sku, name, salePrice, image };
  return itemSelected;
};

const clearAll = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    localStorage.clear();
  });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// remove an item individually
function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const thisItem = event.target;
  const word = thisItem.innerText;
  const test = word.split('');
  const array = [];
  for (let index = 5; index < 18; index += 1) {
    array.push(test[index]);
  }
  if (array.includes(' ')) {
    array.pop();
  }
  const key = array.join('');
  if (thisItem.className === 'cart__item selected') {
    localStorage.removeItem(key);
  }
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const myObjetct = {sku, name, salePrice};
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(sku ,JSON.stringify(myObjetct));
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

// const soma = (...obj) => {
// let {}
// };
// Referencia de estudos de caso : Aluno Daniel Cespedes
const addElementToChart = () => {
  const arrayElements = document.querySelector('.items');
  arrayElements.addEventListener('click', async (event) => {
    try {
      const btnSelected = event.target;
    // element.closet -> https://developer.mozilla.org/pt-BR/docs/Web/API/Element/closest
      const elementId = btnSelected.closest('.item').firstChild.innerText;
      const endPoint = `https://api.mercadolibre.com/items/${elementId}`;
      const resultEndPoint = await fetch(endPoint);
      const jasonItem = await resultEndPoint.json();
      const li = createCartItemElement(destruct(jasonItem));
      li.classList.add('selected');
      const ol = document.querySelector('.cart__items');
      ol.appendChild(li);
    } catch (error) {
      console.log(`Sorry we are facing some problems: ${error}`);
    }
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getImageItems = () => {
  try {
    const buildElement = document.createElement('p');
    buildElement.innerHTML = 'Loading...';
    buildElement.classList.add('loading');
    const getSection = document.querySelector('.items');
    getSection.appendChild(buildElement);
    const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    fetch(endpoint)
      .then(response => response.json())
      .then((object) => {
        const items = document.querySelector('.items');
        getSection.removeChild(buildElement);
        object.results.forEach((productList) => {
          const item = createProductItemElement(destruct(productList));
          items.appendChild(item);
        });
      });
  } catch (error) {
    console.log(`Sorry, we are facing some problems: ${error}`);
  }
};

window.onload = function onload() {
  getImageItems();
  addElementToChart();
  clearAll();
  // addTotal();
}
