import loadRawData from "./data";

let intervalId;
let tableElement;
let data;

document.addEventListener("DOMContentLoaded", () => {
  tableElement = document.querySelector("table");
  if (!tableElement) {
    alert("Не найден элемент table. Работа программы будет завершена!");
    return;
  }

  data = getData();

  rendererData(data);

  const sortParamsGenerator = generateSortParams();
  const sortExecFunc = () => {
    const sortParams = sortParamsGenerator.next().value;
    sortTable(sortParams.column, sortParams.direction);
  };
  intervalId = setInterval(sortExecFunc, 2000);
});

function* generateSortParams() {
  while (true) {
    for (const direction of ["desc", "asc"]) {
      for (const column of ["id", "title", "year", "imdb"]) {
        yield {column: column, direction: direction};
      }
    }
  }
}

function getData() {
  try {
    return JSON.parse(loadRawData());
  } catch (e) {
    alert("Ошибка загрузки данных " + e);
  }
}

function rendererData(data, sortColumn, directionSort) {
  for (const trData of data) {
    const trElement = createTrElement(trData);
    tableElement.appendChild(trElement);
    trElement.appendChild(createTdElement("#" + trData.id));
    trElement.appendChild(createTdElement(trData.title));
    trElement.appendChild(createTdElement("(" + trData.year + ")"));
    trElement.appendChild(createTdElement("imdb: " + trData.imdb.toFixed(2)));
  }
  for (const th of tableElement.querySelectorAll("tr th")) {
    const thContent = th.textContent;
    if (thContent === sortColumn) {
      th.classList.add(`sort-${directionSort}`);
    } else {
      th.classList.remove(`sort-desc`);
      th.classList.remove(`sort-asc`);
    }
  }
}

function createTrElement(rowData) {
  const trElement = document.createElement("tr");

  trElement.dataset.id = rowData.id;
  trElement.dataset.imdb = rowData.imdb;
  trElement.dataset.title = rowData.title;
  trElement.dataset.year = rowData.year;

  return trElement;
}

function createTdElement(str) {
  const tdElement = document.createElement("td");
  tdElement.textContent = str;
  return tdElement;
}

function sortTable(column, direction) {
  const sortedData = data.sort((row1, row2) => {
    const value1 = row1[column];
    const value2 = row2[column];
    if (column === "id" || column === "imdb" || column === "year") {
      return direction === "asc" ? value1 - value2 : value2 - value1;
    } else {
      return direction === "asc" ? value1.localeCompare(value2) : value2.localeCompare(value1);
    }
  });
  clearTable();
  rendererData(sortedData, column, direction);
}

function clearTable() {
  const trList = Array.from(tableElement.querySelectorAll("tr")).slice(1);
  trList.forEach(el => tableElement.removeChild(el));
}