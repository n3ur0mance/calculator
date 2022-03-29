let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let operators = ["+", "-", "*", "/"];
let equal = "=";
let reset = "C";
let backspace = "←";

let errors = ["деление на ноль", "введите выражение", "ограничение на количество разрядов числа", "ограничение на количество действий в выражении"];
let result;

let form = document.createElement("form");
document.querySelector("main").append(form);

let input = document.createElement("input");
document.querySelector("form").append(input);
input.readOnly = true;

let div = document.createElement("div");
document.querySelector("main").append(div);

// создание кнопок с числами
for(let i = 0; i < nums.length; i++) {
  let button = document.createElement("button");
  document.querySelector("div").append(button);
  button.textContent = nums[i];
  button.classList.add("digit");
  button.setAttribute("data-digit", nums[i]);
  button.addEventListener("click", function () {  // обработка нуля после символов или самого первого нуля в поле - замена
    if(input.value[input.value.length - 1] == "0" && 
        (input.value[input.value.length - 2] == "+" ||
         input.value[input.value.length - 2] == "-" ||
         input.value[input.value.length - 2] == "*" ||
         input.value[input.value.length - 2] == "/" ||
         !input.value[input.value.length - 2])) {
           input.value = input.value.slice(0, input.value.length - 1);
    }

    let splits = input.value.split(/[\*\/\+-]/g);
    if (button.dataset.digit == "0" && input.value[input.value.length - 1] == "/") {  // деление на ноль
      alert("ошибка: " + errors[0]); 
    } else if (splits[splits.length - 1].length > 7) { // проверка на кол-во разрядов
      alert(errors[2]);
    } else input.value += button.dataset.digit;
  });
}

// создание кнопок с операторами
for (let i = 0; i < operators.length; i++) {
  let button = document.createElement("button");
  document.querySelector("div").append(button);
  button.textContent = operators[i];
  button.classList.add("operator");
  button.setAttribute("data-operator", operators[i]);

  button.addEventListener("click", function () {
    switch(input.value[input.value.length - 1]) {
      case undefined: // если первое число в поле отрицательное - отобразить "-"
        button.dataset.operator == "-" ? input.value += button.dataset.operator : false;
        break;

      case input.value[input.value.length - 1].match(/\d/) ? input.value[input.value.length - 1] : false:
        // проверка на кол-во операторов
        if (input.value.match(/[\*\/\+-]/g) == null || input.value.match(/[\*\/\+-]/g).length < 4) {
          input.value += button.dataset.operator;
        } else alert(errors[3]);
        break;

      case "*":
      case "/": // возможность введения отриц.числа
        button.dataset.operator == "+" || button.dataset.operator == "-" ? input.value += button.dataset.operator : false;
      break;

      case "+": // замена плюса на минус при нажатии
        if (button.dataset.operator == "-") {
          input.value = input.value.slice(0, input.value.length - 1);
          input.value += button.dataset.operator;
        }
        break;

      case "-": // ...и наоборот
      if (button.dataset.operator == "+") {
        input.value = input.value.slice(0, input.value.length - 1);
        input.value += button.dataset.operator;
      }
      break;
    }
  });
}

// знак "равно"
button = document.createElement("button");
document.querySelector("div").append(button);
button.textContent = equal;
button.addEventListener("click", function() {
  switch(input.value[input.value.length - 1]) {
    case undefined: // "равно" в пустом поле
    case input.value[input.value.length - 1].match(/[*/+-]/) ? input.value[input.value.length - 1] : false: // "равно" после знака
      alert(errors[1]); 
      break;

    case input.value[input.value.length - 1].match(/\d/) ? input.value[input.value.length - 1] : false: // "равно" после цифры
      !input.value.match(/^-?\d+[*/+-]\d+/) ? alert(errors[1]) : false;  // проверка на НАЛИЧИЕ вычислений

      result = String(eval(input.value));
      result.indexOf(".") != "-1" ? input.value = Number(result).toFixed(3) : input.value = result;  // проверка на наличие дроби в результате
      break;
  }
});

// reset
button = document.createElement("button");
document.querySelector("div").append(button);
button.textContent = reset;
button.addEventListener("click", function() {
  document.location.reload();
});

// backspace
button = document.createElement("button");
document.querySelector("div").append(button);
button.textContent = backspace;
button.addEventListener("click", function() {
  input.value = input.value.slice(0, input.value.length - 1);
});