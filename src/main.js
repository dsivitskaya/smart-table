import "./fonts/ys-display/fonts.css";
import "./style.css";

import { getIndexes, getRecords } from "./data.js"; 
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";


// Исходные данные используемые в render()
const api = { getIndexes, getRecords };

function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {};
  query = applyFiltering(query, state, action);
  query = applyPagination(query, state, action);
  const { total, items } = await api.getRecords(query);
  updatePagination(total, query);
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);
//const applySearching = initSearching('search');  

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

/*const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);*/

const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();
  
  // Обновляем селект с продавцами
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
  });
}

init().then(render);
