let fetchIngredient = async (data) => {
    let labelList = [];
    for (let index in data) {
        labelList.push(data[index].label);
    }

    let ingredientTable = [];
    let categoryTable = [];
    let uniqueCategoryTable = [];
    let promises = [];
    $.post('/checklist/ingredients', { labelList: labelList })
        .done((ingredients) => {
            for (let i in ingredients) {
                for (let j in ingredients[i].ingredientLine) {
                    // console.log(ingredients[i].ingredientLine[j]);
                    promises.push($.post('checklist/category', { ingredientLine: ingredients[i].ingredientLine[j] })
                        .done((result) => {
                            ingredientTable.push([result[0], result[1], ingredients[i].label]);
                        }))
                }
            }
            Promise.all(promises).then(() => {
                ingredientTable.sort(function (a, b) {
                    if (a[0] < b[0]) { return -1; }
                    if (a[0] > b[0]) { return 1; }
                    return 0;
                })

                for (let i = 0; i < ingredientTable.length; i++) {
                    categoryTable.push(ingredientTable[i][0]);
                }

                uniqueCategoryTable = categoryTable.filter(function (item, pos) {
                    return categoryTable.indexOf(item) == pos;
                })

                fullLoop(uniqueCategoryTable);

                for (let i = 0; i < ingredientTable.length; i++) {

                    let displayTable = `
                        <tr>
                            <th>Ingredient</th>
                            <th>Recipe</th>
                        </tr>
                        <tr>
                            <td>${ingredientTable[i][1]}</td>
                            <td>${ingredientTable[i][2]}</td>
                        </tr>
                    `

                    while (i + 1 < ingredientTable.length && ingredientTable[i][0] == ingredientTable[i + 1][0]) {
                        i++;
                        displayTable += `
                            <tr>
                                <td>${ingredientTable[i][1]}</td>
                                <td>${ingredientTable[i][2]}</td>
                            </tr>
                        `
                    }

                    $(`#checklist`).append(`
                    <div class='category-ingredient'>
                        <div class='category' id='category${i}'>
                            <div class='category-label'>
                                <p>
                                    ${ingredientTable[i][0]}
                                </p>
                                <i class="fas fa-caret-left" id='arrow${i}'></i>
                            </div>
                            <div class='online-shopping'>
                                <div class='loading'>
                                    <img src='./public/gif/Spinner-1s-200px.gif'>
                                    <p>Looking for price</p>
                                </div>
                            </div>
                        </div>
                        <div class='ingredients' id='ingredient${i}'>
                            <table>
                                ${displayTable}
                            </table>
                        </div>
                    </div>
                    `);

                    $(`#arrow${i}`).click(() => {
                        if ($(`#arrow${i}`).hasClass('fa-caret-right')) {
                            if($(`#ref-table`).hasClass('active')) {
                                $(`#ref-table`).css('transform','translate3d(100vw, 0, 0)')
                                $(`#arrow${i}`).addClass('fa-caret-left')
                                $(`#arrow${i}`).removeClass('fa-caret-right')
                                $(`#ref-table`).removeClass('active')
                            } else {
                                $(`#arrow${i}`).addClass('fa-caret-left')
                                $(`#arrow${i}`).removeClass('fa-caret-right')
                            }
                        } else {
                            if($(`#ref-table`).hasClass('active')) {
                                $(`#ref-table`).html(`
                                    <table>
                                        ${displayTable}
                                    </table>
                                `)
                                $(`#arrow${i}`).removeClass('fa-caret-left')
                                $(`#arrow${i}`).addClass('fa-caret-right')
                            } else {
                                $(`#ref-table`).html(`
                                    <table>
                                        ${displayTable}
                                    </table>
                                `)
                                $(`#ref-table`).css('transform','translate3d(0, 0, 0)')
                                $(`#ref-table`).addClass('active')
                                $(`#arrow${i}`).removeClass('fa-caret-left')
                                $(`#arrow${i}`).addClass('fa-caret-right')
                            }
                        }
                        
                    })
                }
            })
        })
}

let cart = JSON.parse(sessionStorage.getItem('what_to_cook_cart'));
fetchIngredient(cart);

async function fullLoop(table) {
    for (let item in table) {
        await fetchCitySuper(table[item], item);
    }
}

let fetchCitySuper = async (item, index) => {
    await $.post('/checklist/online-shopping', { category: item })
        .done((data) => {
            
            console.log(data);
            if (data == 'No result found') {
                $(`#category${index} div.online-shopping`).html(`
                    <div class='no-result'>
                        <p>No result found</p>
                    </div>
                `)
            } else {
                $(`#category${index} div.online-shopping`).html(`
                    <div class='result'>
                        <img src='http://cdn.shopify.com/s/files/1/2597/8324/files/logo-citysuper.png?v=1515052045' class='citysuper'>
                        <img src='${data[0]}' class='thumbnail'>
                        <h5>${data[1]}</h5>
                        <p>${data[2]}</p>
                    </div>
                `)

                $(`#category${index} div.online-shopping`).click(() => {
                    window.open(`https://online.citysuper.com.hk/pages/search-results?q=${item.replace(/ /gi, '%20')}&p=1`);
                })
            }
        })
}

// back to cart button
$(`.back-to-cart`).click(async () => {
    $.get('/search/checkout')
        .done(() => {
            $(location).attr('href', '/search/checkout');
        })
})