function createProductImageElement(imageSource) {
  const img = document.createElement("img");
  img.className = "item__image";
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const addSectionItems = (section) => {
  const sectionItems = document.querySelector(".items");
  sectionItems.appendChild(section);
};

const newObjectItems = (object) => {
  const newObj = {};
  newObj.sku = object.id;
  newObj.name = object.title;
  newObj.image = object.thumbnail;
  return newObj;
};

const createNewSectionItems = (object) => {
  addSectionItems(createProductItemElement(object));
};

const fetchApiShopping = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endPoint)
    .then((response) => response.json())
    .then((data) =>
      data.results.forEach((object) => {
        // console.log(object);
        createNewSectionItems(newObjectItems(object));
      })
    );
};

// SOMANDO ITEMS DA LISTA
// const sumPriceListItems = () => {
//   let count = 0;

//   Object.keys(localStorage).forEach((key) => {
//     const storage = JSON.parse(localStorage.getItem(key));
//     count += storage[key].price;
//     // console.log(count);
//   });

//   const p = document.createElement('p');
//   p.classList.add('total-price');
//   p.innerHTML = `<strong>Valor Total: R$${count}</strong>`;
//   addLiCartItem(p);
// };

// ADICIONANDO LOCAL STORAGE
const addLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  // sumPriceListItems();
};

// CRIANDO ARRAY NO LOCAL STORAGE
const arrayLocalStorage = () => {
  const array = [];
  const ol = document.querySelector(".cart__items");
  ol.childNodes.forEach((li) => array.push(li.innerText));
  return array;
}

// REMOVENDO ITENS DO STORAGE
function cartItemClickListener(event) {
  const parent = event.target.parentNode;
  // console.log(JSON.parse(localStorage.getItem('list')));
  const array = JSON.parse(localStorage.getItem("list"));
  // console.log(event.target.innerText)
  array.forEach((li) => {
    if (event.target.innerText === li) {
      parent.removeChild(event.target);
      localStorage.clear();
      addLocalStorage("list", arrayLocalStorage());
    }
  });
}

// ADD LI NA OL
const addLiCartItem = (li) => {
  const ol = document.querySelector(".cart__items");
  ol.appendChild(li);
};

// ADD NO LOCAL STORAGE
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener("click", cartItemClickListener);
  addLiCartItem(li);
  addLocalStorage("list", arrayLocalStorage());
}

// ATUALIZAR LOCAL STORAGE
const updateLiStorage = () => {
  // console.log(JSON.parse(localStorage.getItem('list'))[1]);
  let array = JSON.parse(localStorage.getItem("list"));
  array.forEach((info) => {
    // console.log(info)
    const li = document.createElement("li");
    li.className = "cart__item";
    li.innerText = info;
    li.addEventListener("click", cartItemClickListener);
    addLiCartItem(li);
  });
};

// RESGATAR ID DOS ITENS
function getSkuFromProductItem(item) {
  return item.querySelector("span.item__sku").innerText;
}

// ADD ITEM DA LISTA
const fetchApiIds = (event) => {
  // console.log(event.target.parentNode)
  const id = getSkuFromProductItem(event.target.parentNode);
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endPoint)
    .then((response) => response.json())
    .then((data) => {
      createCartItemElement(data);
    });
};

// CRIANDO PRODUTOS
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement("section");
  section.className = "item";

  section.appendChild(createCustomElement("span", "item__sku", sku));
  section.appendChild(createCustomElement("span", "item__title", name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement(
    "button",
    "item__add",
    "Adicionar ao carrinho!"
  );
  button.addEventListener("click", fetchApiIds);
  section.appendChild(button);
  return section;
}

// LIMPANDO TODA LISTA
const clearItems = () => {
  const ol = document.querySelector(".cart__items");
  ol.innerHTML = "";
  localStorage.clear();
};

// EVENTO DE LIMPAR BOTÃO
const clearShoppingCar = () => {
  const button = document.querySelector(".empty-cart");
  button.addEventListener("click", clearItems);
};

window.onload = function onload() {
  fetchApiShopping("computador");
  updateLiStorage();
  clearShoppingCar();
};
