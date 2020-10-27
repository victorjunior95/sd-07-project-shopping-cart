const showAlert = (message) => {
  window.alert(message);
}

  const fetchProductsAwaitAsync = async (products) => {
    const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=computador`;  
    try {
      const response = await fetch(endpoint);
      const object = await response.json();  
      if (object.error) {
        throw new Error(object.error);
      } else {
        handleResults(object.results);
      }
    } catch (error) {
      showAlert(error);
    }
  }

  const handleResults = (results) => {     
     const items = document.querySelector('.items');
    results.forEach(product => {
      const {id: sku, title: name , thumbnail: image}  = product;
      const item = createProductItemElement({ sku, name, image});
      items.appendChild(item);     
    }); 
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
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() { 
  fetchProductsAwaitAsync();
  handleResults();
  //setTimeout(() => console.log('loading...'), 5000);
  
};
