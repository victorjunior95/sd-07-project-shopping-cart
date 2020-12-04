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

const sentItemstoLocalStorage = () => {
  const sentList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_products', sentList);
};

function cartItemClickListener(event) {
  // coloque seu código aqui,
  event.target.remove();
  sentItemstoLocalStorage();
}

const retrievingLocalStorage = () => {
  const retrieveList = localStorage.getItem('cart_products');
  document.querySelector('.cart__items').innerHTML = retrieveList;
  const cartItems = document.querySelector('.cart__items');
  cartItems.addEventListener('click', cartItemClickListener);
};

function createCartItemElement({ sku, name, salePrice }) {
  const list = document.createElement('li');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.addEventListener('click', cartItemClickListener);
  return list;
}

const itemToCart = (itemObject) => {
  const itensInCart = document.querySelector('.cart__items');
  const { id, title, price } = itemObject;
  const good = {
    sku: id,
    name: title,
    salePrice: price,
  };
  itensInCart.appendChild(createCartItemElement(good));
  // totalPrice();
};
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (r) => {
    const skuClicked = r.target.parentNode.firstChild.innerText;

    fetch(`https://api.mercadolibre.com/items/${skuClicked}`)
    .then(response => response.json())
    .then(json => itemToCart(json))
    .then(() => sentItemstoLocalStorage());
  });

  section.appendChild(button);
  return section;
}
createCustomElement();
/* Elemento que é criado pela função createProductItemElement
  <section class='item'>
    <span class='item__sku'>ASDE123456</span>
    <span class='item__title'> Computador Dell </span>
    <img src='...' class ='item__image' />
    <button class='item__add'>Adicionar ao carrinho!</button>
  </section>
*/

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const firsLoading = async ($QUERY) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`;
  const data = await fetch(endpoint);
  // const resultado = await data.json();
  const { results } = await data.json();
  // console.log(results);

  const items = document.getElementsByClassName('items');
  results.forEach(({ id, title, thumbnail }) => {
    const section = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items[0].appendChild(section);
  });
};

window.onload = async () => {
  firsLoading('computador');
  retrievingLocalStorage();
  // const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  // const data = await fetch(endpoint);
  // const { results } = await data.json();

  // const items = document.getElementsByClassName('items');
  // results.forEach(({ id, title, thumbnail }) => {
  //   const section = createProductItemElement({ sku: id, name: title, image: thumbnail });
  //   items[0].appendChild(section);
  // });
};
