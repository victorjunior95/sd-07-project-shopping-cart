const showAlert = (message) => {
  window.alert(message);
};

function handleLocalStorage(sku, li, action) {
  if (action === 'set') localStorage.setItem(JSON.stringify(sku, li));
  if (action === 'get') localStorage.getItem(JSON.parse(sku, li));
  if (action === 'remove') localStorage.removeItem(sku, li);
  if (action === 'clear') localStorage.clear();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// function getSkuFromProductItem(item) {
//   console.log(item.querySelector('span.item__sku').innerText);
// }

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  // console.log(event.target);
  // handleLocalStorage(sku, li, 'remove');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // console.log(li.innerText);
  // console.log(sku);
  // console.log(salePrice);
  // handleLocalStorage(sku, li, 'set');
  return li;
}
// function sumPrice(saleprice) {
  // const totalSum = document.querySelector('.total-price');
  // totalSum.innerHTML = sumPrice;
  // let sum = sum.push(saleprice);
  // let totalPrice = (acc, saleprice) => acc + saleprice;
  // console.log(sum.reduce(totalPrice));
  // return sum;
  // }

function addItemInOl({ id: sku, title: name, price: salePrice }) {
  const cartItemsOl = document.querySelector('.cart__items');
  const item = createCartItemElement({ id: sku, title: name, price: salePrice });
  // sumPrice(salePrice);
  cartItemsOl.appendChild(item);
}

const fetchProductByIDAwaitAsync = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      addItemInOl(object);
    }
  } catch (error) {
    showAlert(error);
  }
};

function findId(event) {
  const btEvent = event.target.parentNode;
  const itemSku = btEvent.querySelector('.item__sku').innerText;
  fetchProductByIDAwaitAsync(itemSku);
}

const handleResults = (results) => {
  const items = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const item = createProductItemElement({ sku, name, image });
    items.appendChild(item);
  });
  const btItemAdd = document.querySelectorAll('.item__add');
  btItemAdd.forEach(btn => btn.addEventListener('click', findId));
};

function removeToLoad() {
  spanLoad = document.querySelector('.loading');
  spanLoad.innerHTML = ' ';
}

const fetchProductsAwaitAsync = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    removeToLoad();
    if (object.error) {
      throw new Error(object.error);
    } else {
      handleResults(object.results);
    }
  } catch (error) {
    showAlert(error);
  }
};

const btClearCart = document.querySelector('.empty-cart');
btClearCart.addEventListener('click', () => {
  const cartItemsOl = document.querySelector('.cart__items');
  // console.log(cartItemsOl);
  cartItemsOl.innerHTML = ' ';
  handleLocalStorage('', '', 'clear');
});

window.onload = function onload() {
  fetchProductsAwaitAsync();
};
