const array = [];

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    li.remove(event);
  });
  localStorage.setItem(0, document.getElementsByClassName('cart__items')[0].innerHTML);
  return li;
}

function cartItemClickListener(event) {
  const name = array.find(element => element[0] === event.path[0].id)[1];
  const price = array.find(element => element[0] === event.path[0].id)[3];
  document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(event.path[0].id, name, price));
  localStorage[0] = document.getElementsByClassName('cart__items')[0].innerHTML;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.id = id;
    e.addEventListener('click', cartItemClickListener);
  }
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// } cc

const fetchItens = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      for (let i = 0; i < 50; i += 1) {
        document.getElementsByClassName('items')[0].appendChild(createProductItemElement(object.results[i].id, object.results[i].title, object.results[i].thumbnail));
        array.push([object.results[i].id,
          object.results[i].title,
          object.results[i].thumbnail,
          object.results[i].price]);
      }
    }
  } catch (error) {
    // showAlert(error);
  }
};

window.onload = function onload() {
  function clearCart() {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.setItem(0, document.getElementsByClassName('cart__items')[0].innerHTML);
  }
  fetchItens();
  if (localStorage[0] !== undefined) {
    document.getElementsByClassName('cart__items')[0].innerHTML = localStorage[0];
  }
  const clear = document.getElementById('clear');
  clear.addEventListener('click', clearCart);
};
