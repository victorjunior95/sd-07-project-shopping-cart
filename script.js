function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function clearCartItems() {
  document.querySelector('.empty-cart')
    .addEventListener('click', () => {
      document.querySelector('.cart__items').innerHTML = '';
    });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }s

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  let cartItemsStorage = JSON.parse(localStorage.getItem("cartItems"));
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('ol').appendChild(li);
  cartItemsStorage.push({ sku: sku, name: name, salePrice: salePrice });
  console.log(cartItemsStorage);
  localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (e.className === 'item__add') {
    e.addEventListener('click', () => {
      const item = (e.parentNode.childNodes[0].textContent);
      const endPointItem = `https://api.mercadolibre.com/items/${item}`;
      fetch(endPointItem)
      .then(async (responseItem) => {
        const { id, title, price } = await responseItem.json();
        createCartItemElement({ sku: id, name: title, salePrice: price });
      },
      );
    });
  }
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

const fetchApiShopping = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endPoint)
    .then(response => response.json())
      .then(({ results }) => {
        const items = document.querySelector('.items');
        results.forEach((result => (
          (items.appendChild(
            createProductItemElement({
              sku: result.id,
              name: result.title,
              image: result.thumbnail }),
          ))
        )
      ));
      });
};

window.onload = function onload() {
  if (!localStorage.getItem('cartItems')) {
    let cartItemsStorage = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
  } else {
    console.log('Storage já existe!')
  }

  fetchApiShopping('computador');
  clearCartItems();
  //verifyCartItemsStorage();
};
