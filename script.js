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

const inserirItemHtml = (produto) => {
  const secao = document.querySelector('.items');
  secao.appendChild(createProductItemElement(produto));
};

const showAlert = (message) => {
  window.alert(message);
};

// segunda func criada (primeiro requisito)
const converteObjetosDesejados = (objetosDoResult) => {
  objetosDoResult.map((item) => {
    const cadaProduto = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    return inserirItemHtml(cadaProduto);
  });
};

let total = 0;
const sumPrice = (price) => {
  total += Number(price.toFixed(2));
  document.querySelector('.total-price').innerHTML = total;
};

const subtractPrice = async () => {
  const totalPrice = document.querySelector('.cart__item').innerHTML.split('$');
  total -= Number(totalPrice[1]).toFixed(2);
  if (total.toFixed(2) < 0 || document.querySelector('.cart__item').innerHTML === '') {
    // se o cart__item estiver sem item tambem zera
    total = 0;
  }
  document.querySelector('.total-price').innerHTML = Number(total.toFixed(2));
};

// requisto 3 , somente esse retorno
function cartItemClickListener(evento) {
  subtractPrice();
  evento.target.remove();
  // o prorpio li selecionado vai ser apagado
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrice(salePrice);
  return li;
}

// terceira func criada (segundo requisito)
const trataID = (id) => {
  const umItem = `https://api.mercadolibre.com/items/${id}`;
  console.log(umItem);
  fetch(umItem)
  .then(res => res.json())
  .then((objeto) => {
    const listaOl = document.querySelector('.cart__items');
    console.log(objeto);
    produto = {
      sku: objeto.id,
      name: objeto.title,
      salePrice: objeto.price,
    };
    listaOl.appendChild(createCartItemElement(produto));
  })
  .catch(error => showAlert(error));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
  // vou selecionar do parentNode esse elemento e trazero texto dele
}

// segunda func criada ( segundo requisito)
const pegarIdComputadorClicando = (evento) => {
  const idItem = getSkuFromProductItem(evento.target.parentNode);
  // evento target se refere ao proprio botao nesse caso
  // esse parent node é um monte de coisas
  trataID(idItem);
};

// primeira func criada ( segundo requisito)
function addButtonsEvent() {
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach(button => button.addEventListener('click', pegarIdComputadorClicando));
  // para cada botao que eu apertar eu vou gerar um evento que vai chamar a função e
  // vou criar um evento que vai buscar o no desejado dentro daquele item que eu apertei o botao
}

// primeira func criada (primeiro requisito)
const CarregaProdutos = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  // não posso transformar direto em json porque tem que esperar respostas do servidor
  fetch(endpoint)
    .then(resposta => resposta.json()) // endpoint convertido em json
    .then((objeto) => { // dentro do objeto eu busquei os results
      converteObjetosDesejados(objeto.results);
    })
    .then(addButtonsEvent) // vou chamar essa funçao apos o carregamento +)
    .catch(error => showAlert(error));
};

window.onload = function onload() {
  CarregaProdutos();
  // primeira função a ser feita,vai buscar os dados
};
