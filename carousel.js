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
  
  let cart = JSON.parse(sessionStorage.getItem('what_to_cook_cart'))
  
  if (cart[0] != undefined) {
    $('#carousel').append(`
      <div class="selected">
        <img src="${cart[0].image}">
        <h6>${cart[0].label}</h6>
      </div>
    `)
  }
  
  if (cart[1] != undefined) {
    $('#carousel').append(`
      <div class="next">
        <img src="${cart[1].image}">
        <h6>${cart[1].label}</h6>
      </div>
    `)
  }
  
  if (cart[2] != undefined) {
    $('#carousel').append(`
      <div class="nextRightSecond">
        <img src="${cart[2].image}">
        <h6>${cart[2].label}</h6>
      </div>
    `)
  }
  
  let carti = 3
  while (cart[carti] != undefined) {
    $('#carousel').append(`
      <div class="hideRight">
        <img src="${cart[carti].image}">
        <h6>${cart[carti].label}</h6>
      </div>
    `)
  }
  
  $('#carousel div').click(function() {
    moveToSelected($(this));
  });