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
let selectedProductPrice = 0;

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
      customerName: name,
      customerCity: city,
      customerPost: post,
      customerPayment: payment,
      orderQuantity: quantity,
      orderComment: comment,
      orderTotalPrice: totalPrice.toFixed(2),
      orderTime: new Date().getTime() // Устанавливаем уникальное время заказа
    };

    // Сохранение данных заказа в Local Storage.
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

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

function deleteOrder(index) {
  const orders = JSON.parse(localStorage.getItem('orders'));

  if (orders && index >= 0 && index < orders.length) {
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Удаляем элемент заказа из DOM
    const orderItems = document.querySelectorAll('.order-item');
    if (orderItems.length > index) {
      orderItems[index].remove();
    }
  }
}

function userOrder() {
  const orders = JSON.parse(localStorage.getItem('orders'));

  if (orders && orders.length > 0) {
    const left = document.getElementById('left');
    left.innerHTML = '';

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const orderTime = new Date(order.orderTime);
      const totalPrice = parseFloat(order.orderTotalPrice).toFixed(2);

      const item = document.createElement('div');
      item.classList.add('order-item'); // Добавляем класс для каждого элемента заказа
      item.setAttribute('data-order-index', i); // Устанавливаем атрибут для хранения индекса заказа

      const orderInfo = document.createElement('p');
      orderInfo.textContent = `Время заказа: ${orderTime.toLocaleString()}, Цена: $${totalPrice}`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Удалить';
      deleteButton.setAttribute('data-order-index', i); // Устанавливаем атрибут для хранения индекса заказа
      deleteButton.addEventListener('click', () => {
        deleteOrder(i);
      });

      item.appendChild(orderInfo);
      item.appendChild(deleteButton);

      left.appendChild(item);
    }
  }
}

function displayOrderInfo(order) {
  const right = document.getElementById('right');
  right.innerHTML = '';

  const orderTime = new Date(order.orderTime);
  const totalPrice = parseFloat(order.orderTotalPrice).toFixed(2);

  const orderInfo = document.createElement('div');
  orderInfo.innerHTML = `
    <h2>Информация о заказе:</h2>
    <p>Время заказа: ${orderTime.toLocaleString()}</p>
    <p>Имя: ${order.customerName}</p>
    <p>Город: ${order.customerCity}</p>
    <p>Почтовый индекс: ${order.customerPost}</p>
    <p>Способ оплаты: ${order.customerPayment}</p>
    <p>Количество: ${order.orderQuantity}</p>
    <p>Комментарий: ${order.orderComment}</p>
    <p>К оплате: $${totalPrice}</p>
  `;

  right.appendChild(orderInfo);
}

document.getElementById('left').addEventListener('click', event => {
  if (event.target.classList.contains('order-item')) {
    const orderIndex = event.target.getAttribute('data-order-index');
    const orders = JSON.parse(localStorage.getItem('orders'));

    if (orders && orderIndex >= 0 && orderIndex < orders.length) {
      const selectedOrder = orders[orderIndex];
      displayOrderInfo(selectedOrder);
    }
  }
});;

document.getElementById('center').addEventListener('click', event => {
  if (event.target.nodeName === 'DIV') {
    const productId = event.target.getAttribute('data-product');
    const categoryKey = event.target.getAttribute('data-category');

    const product = categories[categoryKey].products.find(product => product.id == productId);
    showDescription(product);
  }
});

document.querySelector('.save').addEventListener('click', () => {
  addInfoOrder();// Перезагружаем список заказов после сохранения
});

document.querySelector('.btn_order').addEventListener('click', () => {
  const left = document.getElementById('left');
  left.innerHTML = '';
  const center = document.getElementById('center');
  center.innerHTML = '';
      
  const right = document.getElementById('right');
  right.innerHTML = '';

  document.querySelector('.result-container').innerHTML ='';

  userOrder();
});
