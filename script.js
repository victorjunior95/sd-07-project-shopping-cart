// função que cria a imagem de um produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função que cria um elemento HTML
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log(event);
}

// pega o ID do produto
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// cria o item no carrinho de compras
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* função que faz a requisição para a API com informações de um produto pelo seu ID
e adiciona-o ao carrinho */
const fetchAddToCart = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json()
      .then((data) => {
        const cartItems = document.querySelector('.cart__items');
        // objeto com ID, nome e preço do produto
        const productCartInfo = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        // adiciona as informações do produto que foi adicionado ao carrinho
        cartItems.appendChild(createCartItemElement(productCartInfo));
      }),
    );
};

// cria o elemento com as informaçõe do produto (id, nome e imagem)
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  // exibe na página as informações dos produtos
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // cria o botão e o evento ao clicar no botão 'adicionar ao carrinho!'
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', async (event) => {
    const parentElement = await event.target.parentElement;
    await fetchAddToCart(getSkuFromProductItem(parentElement));
  });
  section.appendChild(button);
  return section;
}

// função carrega lista de produtos
const loadProductList = () => {
  // faz requisição para a API pelo termo 'computador'
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    // resposta da API convertida em javascript
    .then(response => response.json())
    // dados dos produtos requisitados (array de produtos)
    .then((data) => {
      const items = document.querySelector('.items');
      /* para cada produto do array, cria um elemento com as informações
      daquele produto (código, nome e imagem)e lança-o como filho da section items */
      data.results.forEach((productInfo) => {
        const { id: sku, title: name, thumbnail: image } = productInfo;
        const product = createProductItemElement({ sku, name, image });
        items.appendChild(product);
      });
    });
};

const onLoadPage = () => {
  loadProductList();
};

window.onload = onLoadPage();
