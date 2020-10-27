const returnTotalPrice = () => {
  const items = document.querySelectorAll('.cart__item');
  let price = 0;
  items.forEach((element) => {
    const string = element.innerText;
    const positionInitial = string.indexOf('PRICE') + 8;
    const positionFinal = string.length;
    const substring = string.substr(positionInitial, positionFinal);
    price = parseFloat(substring);
  });

  return price;
};
