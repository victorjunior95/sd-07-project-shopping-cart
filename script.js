function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const showAlert = (message) => {
  console.log(message);
};

const addToHTML = (parent, child) => {
  document.querySelector(parent).appendChild(child);
};

function cartItemClickListener(event) {
  console.log(event.target);
  return event;
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const handleAPIRequestToPrice = (API_REQ) => {
  fetch(API_REQ)
    .then(function (response) {
      return response.json();
    })
    .then((obj) => {
      if (obj.error) {
        throw new Error(obj.error);
      }
      return obj;
    })
    .then((resp) => {
      const cartItem = {
        sku: resp.id,
        name: resp.title,
        salePrice: resp.price,
      };
      addToHTML('.cart__items', createCartItemElement(cartItem));
    })
    .catch(showAlert);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const productItemClickListener = (event) => {
  const itemSection = event.target.parentNode;
  const id = getSkuFromProductItem(itemSection);
  handleAPIRequestToPrice(`https://api.mercadolibre.com/items/${id}`);
};

// const setupEventHandlers = () => {
//   const cartAddButton = document.querySelectorAll('.item__add');
// };

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', productItemClickListener);
  }
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
    if (jso.error) {
      throw new Error(jso.error);
    }
    console.log(jso);
    handleAmountOfElementsOnHTML(50, jso);
  } catch (error) {
    showAlert(error);
  }
};

window.onload = function onload() {
  handleAPIRequest(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
};
