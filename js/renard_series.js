console.log("console start");

const _str_2_ = document.getElementById("str_2");
const _table_2_ = document.getElementById("table_2");
const _input_2_ = document.getElementById("input_field_002");

const R40 = [
    1, 1.06, 1.12, 1.18, 1.25, 1.32, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.12,
    2.24, 2.36, 2.5, 2.65, 2.8, 3.0, 3.15, 3.35, 3.55, 3.75, 4.0, 4.25, 4.5, 4.75,
    5.0, 5.3, 5.6, 6.0, 6.3, 6.7, 7.1, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0
];

const _R_series_ = [5, 10, 20, 40];
const startTableRenard = "";

function clearStr2() { _str_2_.innerHTML = ""; }
function clearTable2() { _table_2_.innerHTML = ""; }
function clearInput2Field() {
    _input_2_.value = "";
    _input_2_.blur();
}
function clearButton2() {
    clearInput2Field();
    clearStr2();
    _table_2_.innerHTML = startTableRenard;
}

function output_2(value) {
    let table_2 = '<table><tbody><tr><td>Ряд</td><td colspan="2">Номинал</td>';
    for (let i = 0; i < _R_series_.length; i++) table_2 += findInRenard(value, _R_series_[i]);
    table_2 += '</tr></tbody></table>';
    _table_2_.innerHTML = table_2;
}

function findInRenard(value, series) {
    // Расчёты
    const decs = Math.pow(10, Math.floor(Math.log10(value)));  // Степень 10

    let offset = 40 / series;                            // берем каждое первое, второе, четвертое, восьмое значение из ряда R40
    let ind = Math.ceil(Math.log10(value / decs) / Math.log10(Math.pow(10, 1.0 / series))) * offset; // находим номер близкого значения
    let left = R40[ind - offset] * decs;
    let right = R40[ind] * decs;

    // Возвращаем данные в таблицу
    if (Math.abs(value - left) > 0.001 && Math.abs(value - right) > 0.001)
        return `<tr><td>R${series}</td><td>${left.toFixed(2)} (${(100 * (1 - value / left)).toFixed(1)}%)</td> <td>${right.toFixed(2)} (${(100 * (1 - value / right)).toFixed(1)}%)</td></tr>`;
    else if (Math.abs(value - left) < 0.001)
        return `<tr><td>R${series}</td><td colspan="2">${left.toFixed(2)}</td></tr>`;
    else
        return `<tr><td>R${series}</td><td colspan="2">${right.toFixed(2)}</td></tr>`;
}

function calculation_2() {
    // Ввод
    let in_value_2 = _input_2_.value;

    clearStr2();

    // приводим к Float
    let value_2 = Number.parseFloat(in_value_2);

    //Проверки
    // Проверка на знак
    if (value_2 <= 0) {
        _table_2_.innerHTML = startTableRenard;
        _input_2_.value = "";
        alert("Значение должно быть больше ноля!");
    }

    // Проверка на валидность
    else if (Number.isNaN(value_2)) {
        _table_2_.innerHTML = startTableRenard;
        _input_2_.value = "";
        alert("Введена пустая строка!");
    }

    // Расчёт и вывод результата
    else {
        _input_2_.blur();
        _str_2_.innerHTML = "Вы ввели: " + value_2 + '&nbsp <button class="clear_btn btn" type="button" id="clear_btn_002" onclick="clearButton2()">Сброс</button>';
        // Расчёт и вывод
        output_2(value_2);
    }
}

input_field_002.onkeydown = (e) => (e.key == "Enter" ? calculation_2() : 1);