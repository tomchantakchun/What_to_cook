// Get what is in the cart now

let listResult = async (data) => {
    for (let item in data) {
        await timeout(150);
        $('#recipes-cart').append(`
                <div class="recipe-result animated slideInUp" id="result${item}">
                    <img src="${data[item].image}">
                    <h3>${data[item].label}</h3>
                    <i class="fas fa-times"></i>
                </div>
                `)

        $(`div.recipe-result#result${item} i`).click(async () => {
            $(`div.recipe-result#result${item}`).off('click');
            removeRecipe(`div.recipe-result#result${item}`,item,'single');
        })

        $(`div.recipe-result#result${item}`).click(() => {
            fetchRecipeDetail(data[item].label, item);
        })

        if(window.matchMedia( "(min-width: 800px)" ).matches && item == '0') {
            fetchRecipeDetail(data[item].label, item);
        }
    }
}

let cart = JSON.parse(sessionStorage.getItem('what_to_cook_cart'));
listResult(cart);

$(`#back-to-search`).click(() => {
    $.get('/search')
        .done(() => {
            $(location).attr('href', '/search');
        })
})

$(`#clear-all`).click(async () => {
    for (let i = 0; i < 300; i++) {
        if ($(`#result${i}`).length === 1) {
            await removeRecipe(`div.recipe-result#result${i}`,i,'all');
            cart = [];
            sessionStorage.setItem('what_to_cook_cart',JSON.stringify(cart))
        }
    }
})

$(`#checklist`).click(async () => {
    $.get('/checklist')
        .done(() => {
            $(location).attr('href', '/checklist');
        })
})

let removeRecipe = async (element,item,status) => {
    cart.splice(item,1);
    sessionStorage.setItem('what_to_cook_cart',JSON.stringify(cart));
    await $(element).addClass('animated slideOutRight faster');
    if (status === 'all') {
        await timeout(100);
    } else {
        await timeout(500);
    }
    await $(element).remove();
}

// If pressed with individual recipe, detailed recipe slide out
let fetchRecipeDetail = async (label, item) => {
    $.post('/search/recipe-detail', {
        data: label
    }).done((data) => {
        $('section#recipe-detail').html('');

        let ingredientList = '';
        for (let item in data[0].ingredientLine) {
            ingredientList += `<li>${data[0].ingredientLine[item]}</li>`
        }

        let instructionList = '';
        for (let item in data[0].instructionLine) {
            instructionList += `<li>${data[0].instructionLine[item]}</li>`
        }

        if(window.matchMedia( "(max-width: 800px)" ).matches) {
            $('section#recipe-detail').html(`
                <div class="corner left">
                    <i class="fas fa-times"></i>
                </div>

                <div id="large-photo">
                    <img src="${data[0].image}">
                </div>
                <h1>${data[0].label}</h1>

                <table>
                    <tr class="table-header">
                        <th>Source</th>
                        <th>Serving</th>
                    </tr>
                    <tr>
                        <th>
                            <a href='${data[0].sourceUrl}'>Delish</a>
                        </th>
                        <th>${data[0].serving}</th>
                    </tr>
                </table>

                <h4>Ingredient</h4>
                <ul>
                    ${ingredientList}
                </ul>

                <h4>Instruction</h4>
                <ol>
                    ${instructionList}
                </ol>
            `)

            $('section#recipe-detail').css('transform', 'translate3d(0, 0, 0)')
            $('section#recipe-detail').css('transition', 'transform 0.6s')

            $('section#recipe-detail i.fa-times').click(() => {
                $('section#recipe-detail').css('transform', 'translate3d(100vw, 0, 0)')
            })

        } else {

            $('section#recipe-detail').html(`
                <h1>${data[0].label}</h1>
                <div id="large-photo">
                    <img src="${data[0].image}">
                </div>
                <div class='ingredient-column'>
                    <h4>Ingredient</h4>
                    <ul>
                        ${ingredientList}
                    </ul>
                </div>

                <table>
                    <tr class="table-header">
                        <th>Source</th>
                        <th>Serving</th>
                    </tr>
                    <tr>
                        <th>
                            <a href='${data[0].sourceUrl}'>Delish</a>
                        </th>
                        <th>${data[0].serving}</th>
                    </tr>
                </table>

                <h4 class='instruction-column'>Instruction</h4>
                <ol class='instruction-column'>
                    ${instructionList}
                </ol>
            `)
        }

        $('section#recipe-detail').css('transform', 'translate3d(0, 0, 0)')
        $('section#recipe-detail').css('transition', 'transform 0.6s')

        $('section#recipe-detail i.fa-times').click(() => {
            $('section#recipe-detail').css('transform', 'translate3d(100vw, 0, 0)')
        })
    })
}

// Promisify SetTimeout
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//push cart to a group
var tempReceipt
var tempGroup

$('#add-to-group').click(function () {
    tempReceipt = JSON.parse(sessionStorage.getItem('what_to_cook_cart'))
    tempGroup = JSON.parse(sessionStorage.getItem('what_to_cook_group'))
    $.post("../../group/receipe", {tempReceipt: tempReceipt, tempGroup: tempGroup})
    .done(
        window.location.href = '/group/chat/' + tempGroup[0].groupid
    )
 })