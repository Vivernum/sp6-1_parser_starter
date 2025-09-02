function getAllTheMeta() {
  const meta = {};
  meta.opengraph = {};
  
  // const alternativeMeta = {}; думал попробовать тут допом через
  // reduce сделать то же самое, но мне стало лень

  const headElements = Array.from(document.querySelector('head').children);
  
  // ПОЛУЧАЕМ НЕСТАНДАРТНЫЕ ДАННЫЕ (Нужно будет потом пройтись тримом)

  meta.language = document.querySelector('html').lang;
  [meta.title, musor] = document.querySelector('head title').textContent.split("—");

  // ПОЛУЧАЕМ ОСТАЛЬНЫЕ ДАННЫЕ

  headElements.forEach(item => {
    if (!item.name && !item.getAttribute('property') || item.name === "viewport") {
      return;
    } else if (!item.hasAttribute('property')) {
      meta[item.name] = item.content;
    } else {
      meta.opengraph[item.getAttribute('property').split(":")[1]] = item.content;
    }
  })

  // ПРИВОДИМ К МАССИВУ KEYWORDS

  meta.keywords = meta.keywords.split(",");

  // console.log(headElements);
  // console.log(meta);
}

// getAllTheMeta();


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
  product.price = product.price.trim().split('₽')[1];
  product.oldPrice = product.oldPrice.trim().split('₽')[1];
  
  // ТУТ ПОЛУЧАЕМ ВАЛЮТУ
  const currency = document.querySelector('.price').children[0].textContent.split('');
  if (currency[0] === '₽') product.currency = 'RUB';
  else if (currency[0] === '$') product.currency = 'USD';
  else if (currency[0] === '€') product.currency = 'EUR';

  // ТУТ ПОЛУЧАЕМ СКИДКУ
  const discount = () => {
    product.oldPrice - product.price > 0 ?
    product.discount = product.oldPrice - product.price :
    product.discount = 0;

    if (product.discount === 0) product.discountPercent = '0%';
    else {
      product.discountPercent = `${(1 - product.price / product.oldPrice) * 100}%`;
    }
  }

  discount();
  // ЗДЕСЬ ПОЛУЧАЕМЯ КЛЮЧ: ЗНАЧЕНИЕ У PROPERTIES 

  const props = Array.from(document.querySelector('.properties').children);
  product.properties = {};
  
  props.forEach(item => {
    const arr = item.querySelectorAll('span');
    product.properties[arr[0].textContent] = arr[1].textContent;
  })

  // ТУТ ПОЛУЧАЕМ ПОЛНОЕ ОПИСАНИЕ

  product.description = document.querySelector('.description').innerHTML;

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

  // console.log(product);
}

// getProductData();

// @todo: напишите здесь код парсера

function parsePage() {
  return {
    meta: {},
    product: {},
    suggested: [],
    reviews: []
  };
}

window.parsePage = parsePage;