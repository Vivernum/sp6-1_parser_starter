
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

getAllTheMeta();
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