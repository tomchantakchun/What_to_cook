// Get simple search result after entering keyword to search bar
let outOfPage = false;
$('#search-bar button').click((e) => {
    e.preventDefault();

    $('#recipes').html('');

    $.post('/search/recipe', {
        data: $('#search-bar input').val()
    }).done((data) => {
        shuffle(data);
        fetchRecipe(data);
        $('#search-bar input').val('');
    })
})

// Go to checkout cart
$('i.fa-arrow-left, i.fa-shopping-cart').click(() => {
    $.get('/search/checkout')
        .done(() => {
            outOfPage = true;
            $(location).attr('href', '/search/checkout');
        })
})

let fetchRecipe = async (data) => {
    for (let item in data) {
        if (!outOfPage) {
            if (item < 15) {
                await timeout(150);
            }

            if (item < 50) {
                $('#recipes').append(`<div class="recipe-result animated slideInUp" id="result${item}">
                        <img src="${data[item].image}">
                        <h3>${data[item].label}</h3>
                        <i class="far fa-plus-square"></i>
                    </div>`)
        
                // save to cart
                $(`div.recipe-result#result${item} i`).click(() => {
                    $(`div.recipe-result#result${item}`).off('click');
                    recipeChosen(`div.recipe-result#result${item}`,data,item);
                })
        
                $(`div.recipe-result#result${item}`).click(() => {
                    fetchRecipeDetail(data[item].label, item);
                })
            }

            if(window.matchMedia( "(min-width: 800px)" ).matches && item == '0') {
                fetchRecipeDetail(data[item].label, item);
            }
        }

    }
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

                <div class="corner right">
                    <i class="far fa-plus-square"></i>
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

    })
}

// Recipe chosen to cart => fadeout animation
let recipeChosen = async (element,data,item) => {
    await $(element).addClass('animated slideOutLeft faster');
    await timeout(500);
    await $(element).remove();
// think whether need to refractor it to be stored in knex
    if (sessionStorage.getItem('what_to_cook_cart') == null) {
        sessionStorage.setItem('what_to_cook_cart',JSON.stringify(
            [
                {
                    label: data[item].label,
                    image: data[item].image
                }
            ]
        ));
    } else {
        let cart = JSON.parse(sessionStorage.getItem('what_to_cook_cart'))
        cart.push(
            {
                label: data[item].label,
                image: data[item].image
            }
        )
        sessionStorage.setItem('what_to_cook_cart',JSON.stringify(cart))
    }

    // Stored on server, less preferable
    // await $.post('/search/cart', {
    //     label: data[item].label,
    //     image: data[item].image
    // }).done(() => { })
}

// Shuffle array randomly
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Promisify SetTimeout
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}