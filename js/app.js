function showCategories() {
  const parentElement = document.getElementById('left');

  for (let categoryKey in categories) {
    const category = categories[categoryKey];

    let element = document.createElement('div');
    element.textContent = category.name;
    element.setAttribute('data-category', categoryKey);
    element.addEventListener('click', () => {
      const center = document.getElementById('center');
      center.innerHTML = '';
      
      const right = document.getElementById('right');
      right.innerHTML = '';

      const message = document.querySelector('h2');
      if (message) {
        message.remove();
      }

      const categoryProducts = categories[categoryKey].products;
      showProducts(categoryProducts, categoryKey);

    });

    parentElement.appendChild(element);
  }
}

function showProducts(products, category) {
  const parentElement = document.getElementById('center');
  parentElement.innerHTML = '';

  for (let product of products) {
    let element = document.createElement('div');
    element.textContent = `${product.name} $${product.price}`;
    element.setAttribute('data-product', product.id);
    element.setAttribute('data-category', category);

    parentElement.appendChild(element);
    element.addEventListener('click', () => {
      showDescription(product);
    })
  }
}

showCategories(); 

let selectedProductInfo = '';
let selectedProductPrice = 0

function showDescription(product) {
  const description = document.getElementById('right');
  description.innerHTML = '';

  const element = document.createElement('div');
  const buy = document.createElement('button');

  selectedProductPrice = product.price;

  element.textContent = `${product.description}`;

  buy.textContent = 'Купить';

  description.appendChild(element);
  description.appendChild(buy);

  buy.addEventListener('click', showForm);
  selectedProductInfo = `
    <h2>Выбранный товар:</h2>
    <p>Наименование: ${product.name}</p>
    <p>Цена: $${product.price}</p>
    <p>Описание: ${product.description}</p>
  `;
}

function showForm(){
  const form = document.querySelector('.form');
  form.style.display = 'block';
} 

function getForm() {
  const form = document.forms.order;
  const name = form.elements.name.value;
  const city = form.elements.city.value;
  const post = form.elements.post.value;
  const payment = form.elements.payment.value;
  const amount = form.elements.amount.value;
  const comment = form.elements.comment.value;
  const errorContainer = document.querySelector('.error-container');
 
  const order = {
    name: name,
    city:  city,
    post: post,
    payment: payment,
    amount: amount,
    comment: comment,
    errorContainer: errorContainer
  }
  return order;
}

function isValidate(){
  const order = getForm();
  const { name, city, post, payment, amount, comment, errorContainer } = order;
  errorContainer.textContent = '';
  
  if (name.trim() === '') {
    errorContainer.textContent += 'Введите корректные данные для имени фамилии отчества.\n';
  } else if (!isNaN(name)) {
    errorContainer.textContent += 'Имя не может быть числом.\n';
  } else if (name.length < 10 || name.length > 50) {
    errorContainer.textContent += 'Имя фамилия отчество должно содержать от 10 до 50 символов.\n';
  }
  
  if (post.trim() === '') {
    errorContainer.textContent += 'Введите корректные данные для почтового индекса.\n';
  }
  
  if (!payment) {
    errorContainer.textContent += 'Выберите способ оплаты.\n';
  }
  
  if (amount === '') {
    errorContainer.textContent += 'Выберите количество.\n';
  } else {
    const quantity = parseInt(amount);

    if (!isNaN(quantity) && quantity > 0) {
      return true;
    } else {
      errorContainer.textContent += 'Введите корректное количество (целое положительное число).\n';
    }
  }
  
  return false;
}

function addInfoOrder() {
  const isValid = isValidate();

  if (isValid) {
    const order = getForm();
    const { name, city, post, payment, amount, comment } = order;
    const quantity = parseInt(amount);
    const totalPrice = selectedProductPrice * quantity;

    const orderData = {
      productName: selectedProductInfo.name,
      productPrice: selectedProductPrice,
      name: name,
      city: city,
      post: post,
      payment: payment,
      quantity: quantity,
      comment: comment,
      totalPrice: totalPrice.toFixed(2)
    };

    // Преобразуйте объект в строку JSON.
    const orderDataJSON = JSON.stringify(orderData);
    
    const orderKey = `orderData`;

    // Сохранение данных заказа в Local Storage.
    localStorage.setItem(orderKey, orderDataJSON);

    const resultContainer = document.querySelector('.result-container');
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
      ${selectedProductInfo}
      <h2>Ваши данные:</h2>
      <p>Имя: ${name}</p>
      <p>Город: ${city}</p>
      <p>Почтовый индекс: ${post}</p>
      <p>Способ оплаты: ${payment}</p>
      <p>Количество: ${quantity}</p>
      <p>Комментарий: ${comment}</p>
      <p>К оплате: $${totalPrice.toFixed(2)}</p>
    `;
    
    const form = document.forms.order;
    form.style.display = 'none';
  }
}

function showUserOrder(orderTime, totalPrice){
  const parentElement = document.getElementById('left');

  const item = document.createElement('div');
  item.textContent = `Время заказа: ${orderTime.toLocaleString()}, Цена: $${totalPrice}`;

  parentElement.appendChild(item);
}

function userOrder(){
  const orderKey = 'orderData'; // Замените этим ключем, если вы использовали другой ключ.
  const orderDataJSON = localStorage.getItem(orderKey);

  if(orderDataJSON){
    const orderData = JSON.parse(orderDataJSON);

    const orderTime = new Date(parseInt(orderKey.split('_')[1]));
    const totalPrice = parseFloat(orderData.totalPrice).toFixed(2);
    showUserOrder(orderTime,totalPrice);
  }
}

document.getElementById('left').addEventListener('click', event => {
  document.querySelector('.result-container').innerHTML ='';
  if (event.target.nodeName === 'DIV') {
    const categoryKey = event.target.getAttribute('data-category');
    const categoryProducts = categories[categoryKey].products;
    showProducts(categoryProducts, categoryKey);
  }
});


document.getElementById('center').addEventListener('click', event => {
  if (event.target.nodeName === 'DIV') {
    const productId = event.target.getAttribute('data-product');
    const categoryKey = event.target.getAttribute('data-category');

    const product = categories[categoryKey].products.find(product => product.id == productId);
    showDescription(product);
  }
});

document.querySelector('.save').addEventListener('click', addInfoOrder);

document.querySelector('.btn_order').addEventListener('click',()=>{
  const left = document.getElementById('left');
  left.innerHTML = '';

  userOrder()
})