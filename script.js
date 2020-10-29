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
  // remove elemento que foi clicado
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const selectedItem = (event) => {
  const idItem = event.target.parentNode.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${idItem}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const cartItems = document.querySelector('.cart__items');
      const objectProduct = {
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      };
      cartItems.appendChild(createCartItemElement(objectProduct));
      // console.log(objectProduct);
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', selectedItem);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addToCartButton);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// função limpar carrinho de compras
function emptyShoppingCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const allCartItems = document.querySelector('.cart__items');
    allCartItems.innerHTML = '';
  });
}
const fetchItems = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const items = document.querySelector('.items');
      const arrayResults = object.results;
      arrayResults.forEach((element) => {
        const objectProduct = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        items.appendChild(createProductItemElement(objectProduct));
      });
    });
};

window.onload = function onload() {
  fetchItems();
  emptyShoppingCart();
};
