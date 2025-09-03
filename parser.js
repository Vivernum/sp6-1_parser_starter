function getAllTheMeta() {
  const meta = {};
  meta.opengraph = {};
  
  // const alternativeMeta = {}; думал попробовать тут допом через
  // reduce сделать то же самое, но мне стало лень

  const headElements = Array.from(document.querySelector('head').children);
  
  // ПОЛУЧАЕМ НЕСТАНДАРТНЫЕ ДАННЫЕ (Нужно будет потом пройтись тримом)

  meta.language = document.querySelector('html').lang;
  [meta.title, musor] = document.querySelector('head title').textContent.split("—");
  meta.title = meta.title.trim();

  // ПОЛУЧАЕМ ОСТАЛЬНЫЕ ДАННЫЕ

  headElements.forEach(item => {
    if (!item.name && !item.getAttribute('property') || item.name === "viewport") {
      return;
    } else if (!item.hasAttribute('property')) {
      meta[item.name] = item.content;
    } else {
      meta.opengraph[item.getAttribute('property').split(":")[1]] = item.content;
    }
  });

  [meta.opengraph.title, ] = meta.opengraph.title.split('—');
  meta.opengraph.title = meta.opengraph.title.trim();

  // ПРИВОДИМ К МАССИВУ KEYWORDS

  let keys = meta.keywords.split(",");
  for (let i = 0; i < keys.length; i++) {
    keys[i] = keys[i].trim();
  }
  meta.keywords = keys;


  return meta;
}

function getCurrency(obj, item) {
    if (item === '₽') obj.currency = 'RUB';
    else if (item === '$') obj.currency = 'USD';
    else if (item === '€') obj.currency = 'EUR';
}

function getProductData() {
  const product = {};
  
  // ПОЛУЧАЕМ ПРОСТЫЕ ДАННЫЕ
  
  product.id = document.querySelector('.product').dataset.id;
  product.name = document.querySelector('h1').textContent;
  product.isLiked = Array.from(document.querySelector('.product .container .like').classList).includes('active') ? true : false;
  
  // ПОЛУЧАЕМ TAGS
  
  const tagsElements = Array.from(document.querySelector('.product .container .about .tags').children);
  product.tags = {};

  tagsElements.forEach(item => {
    const chek = item.className;

    switch(chek) {
      case 'green': product.tags["category"] = [item.textContent];
      case 'blue': product.tags["label"] = [item.textContent];
      case 'red': product.tags["discount"] = [item.textContent]
    }
  });
  
  // ЗДЕСЬ ПРОСТО ПОЛУЧАЕТСЯ ЦЕНА ДЕСТРУКТУРИЗАЦИЕЙ И СПЛИТАМИ
  // Я ОЧЕНЬ НЕ ХОТЕЛ ДЕЛАТЬ ЧТО-ТО БОЛЕЕ НАДЕЖДНОЕ, ПОТОМУ ЧТО МНЕ 
  // НУЖНО ПРОХОДИТЬ ОСТАТОК КУРСА
  
  [, product.price, product.oldPrice] = document.querySelector('.price').textContent.split('\n');
  product.price = +product.price.trim().split('₽')[1];
  product.oldPrice = +product.oldPrice.trim().split('₽')[1];
  
  // ТУТ ПОЛУЧАЕМ ВАЛЮТУ
  const currency = document.querySelector('.price').children[0].textContent.split('')[0];
  getCurrency(product, currency);

  // ТУТ ПОЛУЧАЕМ СКИДКУ
  const discount = () => {
    product.oldPrice - product.price > 0 ?
    product.discount = product.oldPrice - product.price :
    product.discount = 0;

    if (product.discount === 0) product.discountPercent = '0%';
    else {
      product.discountPercent = `${((1 - product.price / product.oldPrice) * 100).toFixed(2)}%`;
    }
  }

  discount();
  // ЗДЕСЬ ПОЛУЧАЕМЯ КЛЮЧ: ЗНАЧЕНИЕ У PROPERTIES 

  const props = Array.from(document.querySelector('.properties').children);
  product.properties = {};
  
  props.forEach(item => {
    const arr = item.querySelectorAll('span');
    product.properties[arr[0].textContent] = arr[1].textContent;
  });

  // ТУТ ПОЛУЧАЕМ ПОЛНОЕ ОПИСАНИЕ, А ВООБЩЕ Я ПРОСТО ЗАБИЛ НА ЭТОТ МУСОР

  product.description = document.querySelector('.unused');

  // ТУТ БУДЕ ПОЛУЧАТЬ МАССИВ ИЗОБРАЖЕНИЙ

  product.images = [];
  const buttons = Array.from(document.querySelector('.product nav').children);
  buttons.forEach(item => {
    const obj = {};
    const img = item.querySelector('img')
    obj.preview = img.src;
    obj.full = img.dataset.src;
    obj.alt = img.alt;
    product.images.push(obj);
  })

  return product;
}

// ТУТ ПОЛУЧАЕМ SUGGESTED

function getSuggestedItems() {
  const suggested = [];

  const arr = Array.from(document.querySelector('.suggested .items').children);
  arr.forEach(item => {
    const obj = {};

    obj.name = item.querySelector('h3').textContent;
    obj.description = item.querySelector('p').textContent;
    obj.image = item.querySelector('img').src;
    [, obj.price] = item.querySelector('b').textContent.split('₽');

    const currency = item.querySelector('b').textContent.split('')[0];
    getCurrency(obj, currency);

    suggested.push(obj);
  })

  return suggested;
}

// ТУТ БУДЕМ ПОЛУЧАТЬ ОБЗОРЫ

function getReviews() {
  const reviews = [];

  const arr = Array.from(document.querySelector('.reviews .items').children);
  arr.forEach(item => {
    const obj = {};

    obj.title = item.querySelector('h3').textContent;
    obj.description = item.querySelector('p').textContent;
    obj.author = {};
    obj.author.avatar = item.querySelector('.author img').src;
    obj.author.name = item.querySelector('.author span').textContent;

    let dateArr = item.querySelector('.author i').textContent.split('');
    for (let i = 0; i < dateArr.length; i++) {
      if (dateArr[i] === '/') dateArr[i] = '.';
    }
    let result = '';
    for (let i = 0; i < dateArr.length; i++) {
      result += dateArr[i];
    };
    obj.date = result;

    const rating = Array.from(item.querySelector('.rating').children);
    let counter = 0;
    rating.forEach(item => {
      if (item.classList.contains('filled')) counter++;
    })

    obj.rating = counter;

    reviews.push(obj);
  })

  return reviews;
}

// @todo: напишите здесь код парсера

function parsePage() {
  return {
    meta: getAllTheMeta(),
    product: getProductData(),
    suggested: getSuggestedItems(),
    reviews: getReviews()
  };
}

window.parsePage = parsePage;