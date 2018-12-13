// For carousel moving

function moveToSelected(element) {
  if (element == "next") {
    var selected = $(".selected").next();
  } else if (element == "prev") {
    var selected = $(".selected").prev();
  } else {
    var selected = element;
  }

  var next = $(selected).next();
  var prev = $(selected).prev();
  var prevSecond = $(prev).prev();
  var nextSecond = $(next).next();

  $(selected).removeClass().addClass("selected");

  $(prev).removeClass().addClass("prev");
  $(next).removeClass().addClass("next");

  $(nextSecond).removeClass().addClass("nextRightSecond");
  $(prevSecond).removeClass().addClass("prevLeftSecond");

  $(nextSecond).nextAll().removeClass().addClass('hideRight');
  $(prevSecond).prevAll().removeClass().addClass('hideLeft');
}

// inserting carousel

// example
let cart = [
  { 
    "label": "Chicken-and-Garlic Chowder", 
    "image": "https://www.edamam.com/web-img/eee/eee811712e83dc270a5ca244a9e6dd77.jpg" 
  }, 
  { 
    "label": "Carrot-Avocado Salad", 
    "image": "https://www.edamam.com/web-img/7bf/7bf6e8586158d7046557a2fa1aba09ec.jpg" 
  }, 
  { 
    "label": "Asian Rice Salad", 
    "image": "https://www.edamam.com/web-img/d8c/d8cd611dba11055e3f9404125b5d4900.jpg" 
  }, 
  { 
    "label": "Bacon and Egg Savory Oat Bake", 
    "image": "https://www.edamam.com/web-img/7bf/7bf74604ec3051557bd0c123413edabf.jpg" 
  }, 
  { 
    "label": "Soy-Braised Turkey with Turkey Rice", 
    "image": "https://www.edamam.com/web-img/4af/4af7c8c129b2d8ed0669649a19591e04.jpg" 
  }
]

if (cart[0] != undefined) {
  $('#carousel').append(`
    <div class="selected">
      <i class="fas fa-times-circle"></i>
      <img src="${cart[0].image}">
      <h6>${cart[0].label}</h6>
    </div>
  `)
}

if (cart[1] != undefined) {
  $('#carousel').append(`
    <div class="next">
      <i class="fas fa-times-circle"></i>
      <img src="${cart[1].image}">
      <h6>${cart[1].label}</h6>
    </div>
  `)
}

if (cart[2] != undefined) {
  $('#carousel').append(`
    <div class="nextRightSecond">
      <i class="fas fa-times-circle"></i>
      <img src="${cart[2].image}">
      <h6>${cart[2].label}</h6>
    </div>
  `)
}

let carti = 3
while (cart[carti] != undefined) {
  $('#carousel').append(`
    <div class="hideRight">
      <i class="fas fa-times-circle"></i>
      <img src="${cart[carti].image}">
      <h6>${cart[carti].label}</h6>
    </div>
  `)
}

$('#carousel div').click(function () {
  moveToSelected($(this));
});