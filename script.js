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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const retrievesLastItemsInTheCart = () => JSON.parse(localStorage.getItem('cartItens'));

function cartItemClickListener(event) {
  // coloque seu código aqui
  const id = event.target.id;
  event.currentTarget.remove('');
  const array = retrievesLastItemsInTheCart();
  const result = array.filter(product => product.sku !== id);
  localStorage.setItem('cartItens', JSON.stringify(result));
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const reqProduct = (event) => {
  const itemId = event.target.parentNode.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(endpoint).then(res => res.json().then((data) => {
    const { id: sku, title: name, price: salePrice } = data;
    const objCart = { sku, name, salePrice };
    const oldCartItens = retrievesLastItemsInTheCart();
    oldCartItens.push(objCart);
    localStorage.setItem('cartItens', JSON.stringify(oldCartItens));
    const cartItens = document.querySelector('.cart__items');
    cartItens.appendChild(createCartItemElement({ sku, name, salePrice }));
  }));
};

const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(endpoint).then(res => res.json().then((content) => {
    const itensContent = document.querySelector('.items');
    content.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      item.querySelector('.item__add').addEventListener('click', reqProduct);
      itensContent.appendChild(item);
    });
  }));
};

const verifyIfHasSomethingInTheWebStorage = () => {
  if (!localStorage.getItem('cartItens')) {
    localStorage.setItem('cartItens', '[]');
  }

  if (localStorage) {
    const oldCartItens = retrievesLastItemsInTheCart();
    if (oldCartItens.length > 0) {
      const cartItens = document.querySelector('.cart__items');
      console.log(oldCartItens);
      oldCartItens.forEach((item) => {
        const { sku, name, salePrice } = item;
        cartItens.appendChild(createCartItemElement({ sku, name, salePrice }));
      });
    }
  }
};

window.onload = function onload() {
  verifyIfHasSomethingInTheWebStorage();
  loadProducts();
};
