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
  const cartList = document.querySelector('.cart__items');
  // removeItem([...(event.target).parentNode.children].indexOf(event.target));
  cartList.removeChild(event.target);
  localStorage.setItem('cartContent', cartList.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const showAlert = (message) => {
//   window.alert(message);
// };

const fetchCart = async (toMyCart) => {
  const endpoint = `https://api.mercadolibre.com/items/${toMyCart}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      const cartList = document.querySelector('.cart__items');
      const { id, title, price } = object;
      const cartItem = createCartItemElement({
        sku: id,
        name: title,
        salePrice: price,
      });
      cartList.appendChild(cartItem);
      localStorage.setItem('cartContent', cartList.innerHTML);
    }
  } catch (error) {
    console.log(error);
  }
};

const handleQuery = (myQueryObject) => {
  const itemsList = document.querySelector('.items');
  myQueryObject.forEach((gondola) => {
    const { id, title, thumbnail } = gondola;
    const item = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });
    item.addEventListener('click', () => fetchCart(getSkuFromProductItem(item)));
    itemsList.appendChild(item);
    // item.addEventListener('click', ...)
  });
};

const fetchQuery = async (myQuery) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${myQuery}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      handleQuery(object.results);
    }
  } catch (error) {
    console.log(error);
  }
};

const reload = () => {
  const list = localStorage.getItem('cartContent');
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = list;
  cartList.childNodes.forEach(element => 
    element.addEventListener('click', cartItemClickListener)
  );
}

window.onload = function onload() {
  // Query for computer
  const QUERY = 'computador';
  fetchQuery(QUERY);
  reload();
};

// function salvaLista() {
//   localStorage.clear();
//   const cartList = document.querySelectorAll('li');
//   for (let element = 0; element < cartList.length; element += 1) {
//     const  = {
//       task: listaTarefas[elemento].innerText,
//       status: situacao,
//     };
//     const starefa = JSON.stringify(tarefa);
//     localStorage.setItem(elemento, starefa);
//   }
// }

// function apagaLista() {
//   localStorage.clear();
//   inicioListaTarefas.innerHTML = 'Lista de Tarefas';
// }
// function recriaLista() {
//   for (let elemento = 0; elemento < localStorage.length; elemento += 1) {
//     const starefa = localStorage.getItem(elemento);
//     const tarefa = document.createElement('li');
//     const objetoTarefa = JSON.parse(starefa);
//     tarefa.innerText = objetoTarefa.task;
//     if (objetoTarefa.status === 'completed') {
//       tarefa.classList.toggle('completed');
//     }
//     inicioListaTarefas.appendChild(tarefa);
//   }
// }
