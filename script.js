
const getComputerById = async (id) => {
  const objResponse = await (
    await fetch(`https://api.mercadolibre.com/items/${id}`)
  ).json();
  return objResponse;
}

const getComputerList = async () => {
  const resultsComputer = await (
    await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador&limit=8')
  ).json();
  return resultsComputer.results;
}

const saveOrUpdateLS = async (html) => {
  localStorage.setItem('ListCar', html);
}

const loadLocalStorage = () => {
  const carItems = document.querySelector('.cart__items');
  const ListCar = localStorage.getItem('ListCar');
  if (ListCar) carItens.innerHTML = listCar;
}

const updateDisplayTotalPrice = (total) => {
  const spanElement = document.querySelector('.total-price');
  spanElement.innerHTML = total;
}

const sumPricesItemCart = () => {
  const priceItems = document.querySelectorAll('[data-price-items]');
  const total = Array.from(priceItems, ({ dataset: { priceItems}}) =>
  Number(priceItems)).reduce((acc, price) => acc + price, 0);
  return total;
}

const clearCart = () => {
  const cartItems = document.querySelectorAll('.cart__items');
  cartItems.forEach(item => item.remove());
  updateDisplayTotalPrice(sumPricesItemCart());
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, sku = null) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.dataset.idProduct = sku;
    e.dataset.click = 'addCar';
  }

  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
const listProductScreen = async () => {
  const sectionItems = document.querySelector('.items');
  const products = await getComputerList();
  products.forEach(product => sectionItems.appendChild(createProductItemElement(product)));
}

const loadingListComputers = () => {
  setTimeout(() => {
    document.querySelector('.loading').remove();
    listProductScreen();
  }, 3000);
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  event.target.remove();
  saveOrUpdateLS(cartItems.innerHTML);
  updateDisplayTotalPrice(sumPricesItemCart());
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.priceItems = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCar = async (id) => {
  const cartItems = document.querySelector('.cart__items');
  const productId = await getComputerById(id);
  cartItems.appendChild(createCartItemElement(await productId));
  saveOrUpdateLS(cartItems.innerHTML);
  updateDisplayTotalPrice(sumPricesItemCart());
}

const handleEventsClicks = () => {
  document.addEventListener('click', (event) => {
    const dataSetEvent = event.target.dataset.click;
    switch (dataSetEvent) {
      case 'addCar':
        addToCar(event.target.dataset.idProduct);
        break;
      case 'clearCart':
        clearCart();
        break;
      
      default:
        break;
    }
  });
}

window.onload = () => {
  loadingListComputers();
  loadLocalStorage();
  handleEventsClicks();
  updateDisplayTotalPrice(sumPricesItemCart());
}