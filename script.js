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

function updateLocalStorage() {
  const cartItems = document.querySelector('.cart__items').outerHTML;
  const totalPrice = document.querySelector('.total-price').outerHTML;
  localStorage.setItem('cart-items', cartItems);
  localStorage.setItem('total-price', totalPrice);
}

async function updateTotalCart(price) {
  let totalPrice = document.querySelector('.total-price');
  if (totalPrice.innerText !== '') {
    totalPrice.innerText = parseInt(totalPrice.innerText, 10) + price;
  } else {
    totalPrice.innerText = price;
  }
}

function cartItemClickListener(event) {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    if (item === event.target) {
      document.querySelector('.cart__items').removeChild(item);
      updateLocalStorage();
      const priceReduce = parseInt(event.target.innerText.split('$')[1], 10) * (-1);
      updateTotalCart(priceReduce);
    }
  });
}

const loadLocalStorage = () => {
  if (localStorage.length !== 0) {
    document.querySelector('.cart__items').outerHTML = localStorage.getItem('cart-items');
    document.querySelector('.total-price').outerHTML = localStorage.getItem('total-price');

    document.querySelectorAll('.cart__item')
    .forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  console.log(salePrice);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(event) {
  const itemID = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(result => result.json()
      .then(({ id, title, price }) => {
        const object = {
          sku: id,
          name: title,
          salePrice: price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(object));
        updateTotalCart(price);
        updateLocalStorage();
      }),
    );
}

const clearCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerText = '';
  updateLocalStorage();
};

const loading = (status) => {
  if (status) {
    const section = document.createElement('section');
    section.className = 'loading';
    section.innerText = 'loading...';
    document.body.appendChild(section);
  } else {
    document.body.removeChild(document.querySelector('.loading'));
    document.querySelector('.container').style.visibility = 'visible';
  }
};

async function fetchItems() {
  loading(true);
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        data.results
        .forEach(({ id, title, thumbnail }) => {
          const object = {
            sku: id,
            name: title,
            image: thumbnail,
          };
          document.querySelector('.items').appendChild(createProductItemElement(object));
          document.querySelectorAll('.item__add').forEach(element => element
            .addEventListener('click', addItemToCart));
        });
      });
    },
  );
  loading(false);
}

window.onload = function onload() {
  fetchItems();
  loadLocalStorage();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};
