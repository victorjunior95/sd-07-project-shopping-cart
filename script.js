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

const printItem = (object) => {
  const items = document.querySelector('.items');
  object.results.forEach(item =>
    items.appendChild(
      createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }),
    ),
  );
};

const showAlert = message => window.alert(message);

const deleteLoading = () => {
  const container = document.querySelector('.container');
  const loadingMsg = container.children[0];
  container.removeChild(loadingMsg);
};
// const setupApiOne = async () => {
//   const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
//   try {
//     const response = await fetch(endpoint);
//     const object = await response.json();
//     deleteLoading();
//     if (object.error) {
//       throw new Error(object.error);
//     } else {
//       printItem(object);
//     }
//   } catch (error) {
//     showAlert(error);
//   }
// };

const setupApi = async (id = '', endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador', op = 0) => {
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    deleteLoading();
    if (object.error) {
      throw new Error(object.error);
    } else if (op === 0) {
      printItem(object);
    } else {
      printItemInCart(object);
    }
  } catch (error) {
    showAlert(error);
  }
};

let totalPrice = 0;

function calculateTotal(price = 0, op = 0) {
  const totalPriceSpan = document.querySelector('.total-price');
  if (op !== 0) {
    totalPrice -= price;
  } else {
    totalPrice += price;
  }
  totalPriceSpan.innerText = `O valor total é de R$${totalPrice.toFixed(2)} reais.`;
}

function cartItemClickListener(event) {
  const valor = event.target.innerText.indexOf('$');
  const itemDeletedPrice = parseFloat(event.target.innerText.slice(valor + 1));
  calculateTotal(itemDeletedPrice, 1);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

let itemPrice;
const printItemInCart = (object) => {
  const cartItems = document.querySelector('.cart__items');
  let id;
  let title;
  let price;
  for (item in Object.keys(object)) {
    if (Object.entries(object)[item][0] === 'id') id = Object.entries(object)[item][1];
    if (Object.entries(object)[item][0] === 'title') title = Object.entries(object)[item][1];
    if (Object.entries(object)[item][0] === 'price') {
      price = Object.entries(object)[item][1];
      itemPrice = price;
    }
  }
  cartItems.appendChild(
    createCartItemElement({
      sku: id,
      name: title,
      salePrice: price,
    }),
  );
  calculateTotal(itemPrice);
};

document.addEventListener('DOMContentLoaded', () => {
  const emptyButton = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  emptyButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    const totalPriceSpan = document.querySelector('.total-price');
    totalPrice = 0;
    totalPriceSpan.innerText = `O valor total é de R$${totalPrice.toFixed(2)} reais.`;
  });
});

window.onload = async function onload() {
  // await setupApiOne();
  await setupApi();
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach(button =>
    button.addEventListener('click', (event) => {
      const id = event.target.parentNode.firstChild.innerText;
      // const setupApiTwo = async () => {
      //   const endpoint = `https://api.mercadolibre.com/items/${id}`;
      //   try {
      //     const response = await fetch(endpoint);
      //     const object = await response.json();
      //     if (object.error) {
      //       throw new Error(object.error);
      //     } else {
      //       printItemInCart(object);
      //     }
      //   } catch (error) {
      //     showAlert(error);
      //   }
      // };
      // setupApiTwo();
      setupApi(id, `https://api.mercadolibre.com/items/${id}`, 1);
    }),
  );
};
