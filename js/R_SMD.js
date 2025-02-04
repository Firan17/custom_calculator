// Используем jQuery

// ===== CONST =====

const E96 = [
    100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130, 133, 137, 140, 143,
    147, 150, 154, 158, 162, 165, 169, 174, 178, 182, 187, 191, 196, 200, 205, 210,
    215, 221, 226, 232, 237, 243, 249, 255, 261, 267, 274, 280, 287, 294, 301, 309,
    316, 324, 332, 340, 348, 357, 365, 374, 383, 392, 402, 412, 422, 432, 442, 453,
    464, 475, 487, 499, 511, 523, 536, 549, 562, 576, 590, 604, 619, 634, 649, 665,
    681, 698, 715, 732, 750, 768, 787, 806, 825, 845, 866, 887, 909, 931, 953, 976
];

const E24 = [
    100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300,
    330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910
];

const E12 = [
    100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820
];

const m = new Map([
    ['S', 0.01],
    ['Y', 0.01],
    ['R', 0.1],
    ['X', 0.1],
    ['A', 1],
    ['B', 10],
    ['C', 100],
    ['D', 1000],
    ['E', 10000],
    ['F', 100000]
]);

const tolerance = new Map([
    ['E12', '10%'],
    ['E24', '5%'],
    ['E48', '2%'],
    ['E96', '1%']
]);

let valArray = [];

// ===== REG =====
/*
    ===== Кодирование 3 или 4 цифрами =====

           |E24|   |E96|

    1   -   XXX  /  XXXX
    
    ===== С использованием R =====
    
    2   -   RXX  /  RXXX
    3   -   XRX  /  XRXX
    4   -           XXRX

    ===== JIS-C-5201 =====

    5   -   XXA     -   E96
    6   -   AXX     -   E24, E12

    ===== 000 =====

    7   -   000 - нули
*/

let reg1 = /\b[1-9]\d{2,3}\b/;
let reg2 = /\bR\d{2,3}\b/;
let reg3 = /\b[1-9]R\d{1,2}\b/;
let reg4 = /\b[1-9]\dR[1-9]\b/;
let reg5 = /\b0[1-9][A-FSYRX]\b|\b[1-8]\d[A-FSYRX]\b|\b9[0-6][A-FSYRX]\b/;
let reg6 = /\b[A-FSYRX]0[1-9]\b|\b[A-FSYRX][1-5]\d\b|\b[A-FSYRX]60\b/;
// let reg7 = /\b0{1,4}\b/;

// Проверка вводимых символов
let reg_in = /[^A-FRXSY0-9]/g;



// ========== ANALYSIS ==========

const _R_SMD_input_analysis_ = document.querySelector('#R_SMD_input_analysis');

// Ограничение ввода input
_R_SMD_input_analysis_.oninput = function () {
    this.value = this.value.toUpperCase();
    this.value = this.value.slice(0, 4);
    this.value = this.value.replace(reg_in, '');
}

// Обработка нажатия Enter
_R_SMD_input_analysis_.onkeydown = (e) => (e.key == "Enter" ? Analysis() : 1);

// Обработка нажатия кнопки
$('#analysis_btn_r_smd').click(Analysis);

function renderValue() {
    let out_str = '';

    for (let i = 0; i < valArray.length; i++) {
        let this_line = '<div class="R_SMD_analysis_output margin_left_10">'


    }
}

// Вызываемая функция
function Analysis() {

    let in_str = _R_SMD_input_analysis_.value;

    let invalid = false;
    let valArray = [];
    let out_val;

    console.log(in_str);

    // ======== ПРОВЕРКИ ========
    // ===== 3 или 4 цифры =====
    if (reg1.test(in_str)) {
        invalid = true;

        let extent = Number.parseInt(in_str.at(-1));
        let val = Number.parseInt(in_str.slice(0, -1));

        out_val = val * Math.pow(10, extent);

        if (in_str.length > 3) { valArray.push({ val: out_val, tolerance: '1%', series: 'E96', JIS: false }); }
        else { valArray.push({ val: out_val, tolerance: '5%', series: 'E24', JIS: false }); }
    }

    // ==== With R ====
    if (reg2.test(in_str)) {
        invalid = true;

        out_val = Number.parseFloat('0.' + in_str.slice(1));

        if (in_str.length > 3) { valArray.push({ val: out_val, tolerance: '1%', series: 'E96', JIS: false }); }
        else { valArray.push({ val: out_val, tolerance: '5%', series: 'E24', JIS: false }); }
    }

    if (reg3.test(in_str)) {
        invalid = true;

        out_val = Number.parseFloat(in_str[0] + '.' + in_str.slice(2));

        if (in_str.length > 3) { valArray.push({ val: out_val, tolerance: '1%', series: 'E96', JIS: false }); }
        else { valArray.push({ val: out_val, tolerance: '5%', series: 'E24', JIS: false }); }
    }

    if (reg4.test(in_str)) {
        invalid = true;

        out_val = Number.parseFloat(in_str.slice(0, 2) + '.' + in_str.at(-1));

        valArray.push({ val: out_val, tolerance: '1%', series: 'E96', JIS: false });
    }

    // ===== JIS-C-5201 =====
    if (reg5.test(in_str)) {
        invalid = true;

        let ind = Number.parseInt(in_str.slice(0, 2));

        out_val = E96[ind - 1] * m.get(in_str.at(-1));

        valArray.push({ val: out_val, tolerance: '1%', series: 'E96', JIS: true });
    }

    if (reg6.test(in_str)) {
        invalid = true;

        let ind = Number.parseInt(in_str.slice(1));

        if (ind < 25) {
            out_val = E24[ind - 1] * m.get(in_str.at(0));
            valArray.push({ val: out_val, tolerance: '2%', series: 'E24', JIS: true });
        }
        else if (ind > 24 && ind < 49) {
            ind -= 24;
            out_val = E24[ind - 1] * m.get(in_str.at(0));
            valArray.push({ val: out_val, tolerance: '5%', series: 'E24', JIS: true });
        }
        else {
            ind -= 48;
            out_val = E12[ind - 1] * m.get(in_str.at(0));
            valArray.push({ val: out_val, tolerance: '10%', series: 'E12', JIS: true });
        }
    }

    // ===== 000 =====
    /*
    if (reg7.test(in_str)) {}
    */


    if (invalid) {
        _R_SMD_input_analysis_.blur();
        console.log(out_val);
        console.log(Number.parseFloat(out_val.toFixed(5)));
        console.log(valArray);
    }

}


// ========== SYNTHESIS ==========
