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

const inserirItemHtml = (produto) => {
  const secao = document.querySelector('.items');
  secao.appendChild(createProductItemElement(produto));
};

const converteObjetosDesejados = (objetosDoResult) => {
  console.log(objetosDoResult);
  objetosDoResult.map((item) => {
    const cadaProduto = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    return inserirItemHtml(cadaProduto);
  });
};

const showAlert = (message) => {
  window.alert(message);
};

const CarregaProdutos = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  // não posso transformar direto em json porque tem que esperar respostas do servidor
  fetch(endpoint)
    .then(resposta => resposta.json()) // endpoint convertido em json
    .then((objeto) => { // dentro do objeto eu busquei os results
      converteObjetosDesejados(objeto.results);
    })
    .catch(error => showAlert(error));
};

window.onload = function onload() {
  CarregaProdutos(); // primeira função a ser feita,vai bucar os dados
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
