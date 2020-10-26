window.onload = function onload() {
  addSections()
 };


 const setupEventListeners = () =>{

 }

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

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  button.setAttribute('name',sku)
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  button.addEventListener('click',addCartItemEventListener);
  section.appendChild(button);

  return section;
}


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function addCartItemEventListener(event) {
 const {name} = event.target
 const {title,price,id} =  await fetchItemPrice(name)
 const product = {sku:id, name:title, salePrice:price}
 const elementHtml =  createCartItemElement(product)
 addCart(elementHtml)
}

function cartItemClickListener({target}) {
  const cartList =  document.querySelector('.cart__items')
  cartList.removeChild(target)

}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addSections = async () =>{
  const products  = await fetchComputers()
  const section = document.querySelector('.items')
  products.forEach(({id,title,thumbnail}) => {

    const cardItem = {name:title, sku:id, image:thumbnail}
    const child = createProductItemElement(cardItem)
    section.appendChild(child)
  });
}

const fetchComputers = async () =>{
  const {results} = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
                          .then(resolve => resolve.json())
                          .catch(response => {throw new Error(response)})


  return results
}

const fetchItemPrice = async (id) => {
  const results = await fetch(`https://api.mercadolibre.com/items/${id}`)
                    .then(resolve=>resolve.json())
                    .catch(response=>{throw new Error(response)})
  return results
}

const addCart = (cart) =>{
  const cartList = document.querySelector('.cart__items')
  cartList.appendChild(cart)
}


