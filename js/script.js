console.log("console start");

const _str_1_ = document.getElementById("str_1");
const _table_1_ = document.getElementById("table_1");
const _input_1_ = document.getElementById("input_field_001");

const startTable =
  "<table><tbody><tr><td>Ряд</td><td>Допуск</td></tr><tr><td>E3</td><td>&plusmn;50%</td></tr><tr><td>E6</td><td>&plusmn;20%</td></tr><tr><td>E12</td><td>&plusmn;10%</td></tr><tr><td>E24</td><td>&plusmn;5%</td></tr><tr><td>E48</td><td>&plusmn;2%</td></tr><tr><td>E96</td><td>&plusmn;1%</td></tr><tr><td>E192</td><td>&plusmn;0.5%, 0.25%, 0.1% и точнее</td></tr></tbody></table>";

_table_1_.innerHTML = startTable;

const e24 = [
  1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3, 4.7,
  5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10,
];

const _series_ = [3, 6, 12, 24, 48, 96, 192];

function clearHTML() {
  // Очищаем html формы
  _str_1_.innerHTML = "";
}

function clearTable() {
  _table_1_.innerHTML = "";
}

function clearInput1Field() {
  _input_1_.value = "";
  _input_1_.blur();
}

function clearButton() {
  clearInput1Field();
  _str_1_.innerHTML = "";
  _table_1_.innerHTML = startTable;
}

function output(value) {
  let table = '<table><tbody><tr><td>Ряд</td><td colspan="2">Номинал</td>';
  for (let i = 0; i < _series_.length; i++) table += findInESeries(value, _series_[i]);
  table += '</tr></tbody></table>';
  _table_1_.innerHTML = table;
}

function findInESeries(value, series) {
  // Расчёты
  const decs = Math.pow(10, Math.floor(Math.log10(value)));

  let ind = 0;
  let left = 0;
  let right = 0;

  if (series < 48) {
    const offset = 24 / series;
    ind = Math.ceil(Math.log10(value / decs) / Math.log10(Math.pow(10, 1.0 / series))) * offset;
    left = e24[ind - offset] * decs;
    right = e24[ind] * decs;
  } else {
    ind = Math.ceil(
      Math.log10(value / decs) / Math.log10(Math.pow(10, 1.0 / series))
    );
    left = ind - 1 === 185 ? 9.2 * decs : (Math.round(100 * Math.pow(10, (ind - 1.0) / series)) / 100) * decs;
    right = ind === 185 ? 9.2 * decs : (Math.round(100 * Math.pow(10, ind / series)) / 100) * decs;
  }

  if (Math.abs(value - left) > 0.001 && Math.abs(value - right) > 0.001)
    return `<tr><td>E${series}</td><td>${left.toFixed(2)} (${(100 * (1 - value / left)).toFixed(1)}%)</td> <td>${right.toFixed(2)} (${(100 * (1 - value / right)).toFixed(1)}%)</td></tr>`;
  else if (Math.abs(value - left) < 0.001)
    return `<tr><td>E${series}</td><td colspan="2">${left.toFixed(2)}</td></tr>`;
  else
    return `<tr><td>E${series}</td><td colspan="2">${right.toFixed(2)}</td></tr>`;
}

function calculation_1() {
  // Ввод числа
  let in_value = _input_1_.value;


  // Очищаем html формы
  clearHTML();

  // Приводим к float
  let value = Number.parseFloat(in_value);

  // Проверки
  // Проверка на знак
  if (value <= 0) {
    clearHTML();
    // _check_1_.innerHTML = "Сопротивление должно быть больше ноля!";
    _table_1_.innerHTML = startTable;
    _input_1_.value = "";
    alert("Номинал должен быть больше ноля!");
  }
  // Проверка на валидность
  else if (Number.isNaN(value)) {
    clearHTML();
    // _check_1_.innerHTML = "Введена пустая строка!";
    _table_1_.innerHTML = startTable;
    _input_1_.value = "";
    alert("Введена пустая строка!");
  } else {
    // Вывод введённого числа
    _input_1_.blur();
    _str_1_.innerHTML = "Вы ввели: " + value + '&nbsp <button class="clear_btn btn" type="button" id="clear_btn_001" onclick="clearButton()">Сброс</button>';
    // Расчёт и вывод
    output(value);
  }
}

input_field_001.onkeydown = (e) => (e.key == "Enter" ? calculation_1() : 1);
