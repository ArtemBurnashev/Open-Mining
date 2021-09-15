"use strict";

var itemsCLoud = document.querySelectorAll(".advantage-item--cloudy .advantage-item__item"),
    itemsCommon = document.querySelectorAll(".advantage-item--common .advantage-item__item");

var currentHeight = function currentHeight(elem1, elem2) {
  var len = lenghtMain(elem1, elem2);

  for (var i = 0; i < len; i++) {
    elem1[i].style.height = 'auto';
    elem2[i].style.height = 'auto';

    if (elem1[i].clientHeight > elem2[i].clientHeight) {
      elem2[i].style.height = elem1[i].clientHeight + "px";
    } else {

      elem1[i].style.height = elem2[i].clientHeight + "px";
    }
  }
};
var lenghtMain = function lenghtMain(elem1, elem2) {
  return elem1.length < elem2.length ? elem1.length : elem2.length;
};

currentHeight(itemsCLoud, itemsCommon);

var windowWidth = window.innerWidth;
window.addEventListener('resize', function () {
  currentHeight(itemsCLoud, itemsCommon);
});