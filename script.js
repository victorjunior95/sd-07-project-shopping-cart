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

function getSkuFromProductItem(item) {
  return item.querySelector("span.item__sku").innerText;
}

const newObjectItems = (object) => {
  let newObj = {};
  newObj.sku = object.id;
  newObj.name = object.title;
  newObj.image = object.thumbnail;
  return newObj;
};

const addSectionItems = (section) => {
  const sectionItems = document.querySelector(".items");
  sectionItems.appendChild(section);
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

const fetchApiIds = (event) => {
  // console.log(event.target.parentNode)
  let id = getSkuFromProductItem(event.target.parentNode);
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endPoint)
    .then((response) => response.json())
    .then((data) => {
      createCartItemElement(data);
    });
};

function cartItemClickListener(event) {
  // console.log(event.target.innerText)
  let parent = event.target.parentNode;
  // console.log(event.target.innerText);
  Object.keys(localStorage).forEach((key) => {
    let item = JSON.parse(localStorage.getItem(key));
    // console.log(item[key].id)
    if (event.target.innerText.includes(item[key].id)) {
      // console.log('funfou');
      localStorage.removeItem(key);
      parent.removeChild(event.target);
    }
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener("click", cartItemClickListener);
  addLiCartItem(li);
  addLocalStorage(localStorage.length, {
    id: sku,
    title: name,
    price: salePrice,
  });
}

const addLocalStorage = (key, value) => {
  let object = { [key]: value };
  localStorage.setItem(key, JSON.stringify(object));
  sumPriceListItems();
};

const updateLiStorage = () => {
  Object.keys(localStorage).forEach((key) => {
    // console.log(key);
    let object = JSON.parse(localStorage.getItem(key));
    // console.log(object[key]);
    let item = `SKU: ${object[key].id} | NAME: ${object[key].title} | PRICE: $${object[key].price}`;
    // console.log(item);
    const li = document.createElement("li");
    li.className = "cart__item";
    li.innerText = item;
    li.addEventListener("click", cartItemClickListener);
    addLiCartItem(li);
  });
};

const addLiCartItem = (li) => {
  const ol = document.querySelector(".cart__items");
  ol.appendChild(li);
};

const sumPriceListItems = () => {
  let count = 0;

  Object.keys(localStorage).forEach((key) => {
    let storage = JSON.parse(localStorage.getItem(key));
    count += storage[key].price;
    // console.log(count);
  });

  const p = document.createElement("p");
  p.classList.add("total-price");
  p.innerHTML = `<strong>Valor Total: R$${count}</strong>`;
  addLiCartItem(p);
};

const clearShoppingCar = () => {
  const button = document.querySelector(".empty-cart");
  button.addEventListener("click", clearItems);
};

const clearItems = () => {
  const ol = document.querySelector(".cart__items");
  ol.innerHTML = "";
  localStorage.clear();
};

window.onload = function onload() {
  fetchApiShopping("computador");
  updateLiStorage();
  clearShoppingCar();
};
