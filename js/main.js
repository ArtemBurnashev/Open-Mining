"use strict";

function addActive(elem) {
  elem.classList.add("_active");
}

function removeActive(elem) {
  elem.classList.remove("_active");
}

/* Menu */
var header = document.querySelector(".header");

window.addEventListener("scroll", function () {
  if (parseInt(window.pageYOffset) > 80) {
    header.classList.add("_fixed");
  } else if (parseInt(window.pageYOffset) < 10) {
    header.classList.remove("_fixed");
    removeActive(header);
  }
  if (parseInt(window.pageYOffset) > 150) {
    addActive(header);
  }
});

var anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
    animationTime = 300,
    framesCount = 110;

anchors.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    var coordY = document.querySelector(item.getAttribute("href")).getBoundingClientRect().top + parseInt(window.pageYOffset);
    var scroller = setInterval(function () {
      var scrollBy = coordY / framesCount;
      var pageYOffsetEnd = document.documentElement.scrollHeight - window.innerHeight - 10;

      if (scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight && window.pageYOffset < pageYOffsetEnd) {
        window.scrollBy(0, scrollBy);
      } else {
        window.scrollTo(0, coordY);
        clearInterval(scroller);
      }
    }, animationTime / framesCount);
  });
});

/* Burger menu */
var burgerMenu = document.querySelector(".menu-burger"),
    closeMenu = document.querySelector(".close__menu"),
    menu = document.querySelector(".menu");

burgerMenu.addEventListener("click", function (event) {

  event.preventDefault();
  addActive(menu);
  document.body.classList.add('before-active');

  document.body.addEventListener('click', function (event) {

    var target = event.target;
    if (target.tagName === 'BODY') {
      removeActive(menu);
      document.body.classList.remove('before-active');
    }
  });
});

closeMenu.addEventListener("click", function (event) {
  event.preventDefault();
  removeActive(menu);
  document.body.classList.remove('before-active');
});

menu.addEventListener("click", function (event) {
  event.preventDefault();
  var target = event.target;
  if (target && (target.classList.contains("close__menu") || target.tagName === "A")) {
    removeActive(menu);
    document.body.classList.remove('before-active');
  }
});
/* Inputs */
var ranges = document.querySelectorAll(".income-row__range"),
    inputs = document.querySelectorAll(".income-row__input"),
    select = document.querySelector(".income-row__select"),
    list = document.querySelector(".income-row__list"),
    resultCurrency = document.querySelector(".income__result__currency .income__result__value"),
    spanCurrency = document.querySelector(".income__result__currency .income__result__value span"),
    price = document.querySelector(".income__result__price .income__result__value").firstChild,
    pay = document.querySelector(".income__result__value--pay");

contractPrice(price, inputs);
activeCrrency(document.querySelector('#btc .check'));


ranges.forEach(function (item, index) {
  var ie = true;
  item.addEventListener("input", function () {
    ie = false;
    range(item);
    addPayoutCurrency(pay, inputs);
    InputValue(inputs[index], item);
    contractPrice(price, inputs);
   
  });
  if(ie){
    item.addEventListener("change", function () {
      range(item);
      InputValue(inputs[index], item);
      contractPrice(price, inputs);
    });
  }
  

  item.addEventListener('touchend', function () {
    addPayoutCurrency(pay, inputs);
  });
});

select.addEventListener("click", function () {
  selectActive(select);
  selectActive(list);
});

list.addEventListener("click", function (event) {
  var target = event.target,
      textContentSelect = target.innerHTML,
      checks = document.querySelectorAll(".check"),
      checkmark = target.querySelector(".check");

  if (target && target.classList.contains("income-row__curren")) {
    checks.forEach(function (check) {
      removeActive(check);
    });
    select.innerHTML = textContentSelect;

    addActive(checkmark);
    removeActive(select);
    removeActive(list);
    currency(select, resultCurrency);
    currency(select, spanCurrency);
    addPayoutCurrency(pay, inputs);
    select.querySelector(".check").remove();
  }
});

function range(item) {
  var numZero = 100;

  if (item.max < 1000) {
    numZero = 10;
  }
  var value = ((item.value - item.min + item.step) / item.step / numZero).toFixed(0) * 100 / ((item.max - item.min) / item.step);
  var color = "linear-gradient(90deg, #87B645 0%, #87B645 " + value + "%, #d3d3d3 " + value + "%, #d3d3d3 100%)";
  item.style.background = color;
}
function activeCrrency(id) {
  addActive(id);
}
function InputValue(input, elem) {
  input.value = elem.value;
}

function currency(elem, cur) {
  var curren = elem.querySelector("span").textContent;
  cur.textContent = curren;
}

function selectActive(elem) {
  elem.classList.toggle("_active");
}

function contractPrice(elem, inp) {
  var value1 = parseInt(inp[0].value);
  var value2 = parseInt(inp[1].value);

  if (isNaN(value1) || isNaN(value2)) {
    elem.textContent = 0 + " ";
  } else {
    var val = value1 * value2 * 10 + " ";
    elem.textContent = prettify(val);
  }
}
function prettify(num) {
  var n = num.toString();
  return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ");
}


//-------------------------------------------------------------------------------------
//Since github pages only displays static files, the Fetch request will not be active.
//-------------------------------------------------------------------------------------

/* function request(elem, input) {
  fetch("https://api.nomics.com/v1/currencies/ticker?key=f85bec304dca51caaf857f737e9603d96e299567&ids=BTC,LTC,ETH,RPL&interval=1d&convert=RUB&per-page=100&page=1").then(function (response) {
    return response.json();
  }).then(function (data) {
    var payLastChild = elem.querySelector(".income__curren-days").textContent;
    var result = void 0;
    switch (payLastChild) {
      case "BTC":
        result = resultPay(input, data[0]);
        break;
      case "ETH":
        result = resultPay(input, data[1]);
        break;
      case "LTC":
        result = resultPay(input, data[2]);
        break;
      case "RPL":
        result = resultPay(input, data[3]);
        break;
    }

    return Promise.all([result]);
  }).then(function (res) {

    var value1 = parseInt(input[0].value);
    var value2 = parseInt(input[1].value);
    if (isNaN(value1) || isNaN(value2)) {
      elem.firstChild.textContent = 0 + " ";
    } else {
      elem.firstChild.textContent = function (number) {
        var parts = number.toString().split(".");

        if (parseInt(parts[0].length) > 3) {
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return parts.join(".") + " ";
      }(res[0].toFixed(4));
    }
  }).catch(function (error) {
    return console.error(error);
  });
} */


function request(elem, input){
  var  dataPrice = {"BTC": 3510878.17, "ETH":257995.22, "LTC":13495.63, "RPL":2282.74};
  var payLastChild = elem.querySelector(".income__curren-days").textContent;
  var result = void 0;
  
  switch (payLastChild) {
    case "BTC":
      result = resultPay(input,  dataPrice["BTC"]);
      break;
    case "ETH":
      result = resultPay(input,  dataPrice["ETH"]);
      break;
    case "LTC":
      result = resultPay(input,  dataPrice["LTC"]);
      break;
    case "RPL":
      result = resultPay(input,  dataPrice["RPL"]);
      break;
  }

 return result.toFixed(4);
  
}

function addPayoutCurrency(elem, input){

  var value1 = parseInt(input[0].value);
  var value2 = parseInt(input[1].value);

  if (isNaN(value1) || isNaN(value2)) {
    elem.firstChild.textContent = 0 + " ";
  } else {
    elem.firstChild.textContent = function (number) {
      var parts = number.toString().split(".");

      if (parseInt(parts[0].length) > 3) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return parts.join(".") + " ";
    }(request(elem, input));
  }
}

addPayoutCurrency(pay, inputs);

function resultPay(input, data) {
  return Math.pow(parseInt(input[0].value) * parseInt(input[1].value), 2) / data / 4000;
}

/* Accordion */
var acc = document.querySelectorAll(".faq-item__title");

acc.forEach(function (item) {
  item.addEventListener("click", function () {
    this.classList.toggle("_active");

    var panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

/* Slider */
var infoContent = document.querySelector(".swiper-container--info"),
    advantageContent = document.querySelector(".swiper-container--advantage");

var infoSlider = new Swiper(infoContent, {
  slidesPerView: "auto"
});

var advantageSlider = new Swiper(advantageContent, {
  slidesPerView: "auto"
});
