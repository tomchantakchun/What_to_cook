const puppeteer = require('puppeteer');

class ChecklistService {
    constructor(knex) {
        this.knex = knex;
    }

    async searchIngredients(labelList) {
        // psql example
        // select "ingredientLine" from "delishRecipe" where label = 'Garlic-Clove Shrimp' or label = 'Multigrain Grilled Cheese Sandwiches';

        if (labelList == undefined) {
            return 'Nothing to search'
        }

        let labelSerial = '';
        for (let i = 0; i < labelList.length; i++) {
            labelSerial += `label = '${labelList[i].replace("'", "''")}'`;
            if (i !== labelList.length - 1) {
                labelSerial += ' or ';
            }
        }

        return await this.knex('delishRecipe').select('label', 'ingredientLine').whereRaw(labelSerial);
    }

    async searchCategory(ingredientLine) {
        // psql example
        // select * from "ingredient-category" where "ingredientLineLine" = '1 tbsp. oil';;

        return await this.knex('ingredient-category').select('*').where('ingredientLineLine', ingredientLine);
    }

    async fetchCitySuper(searchItem) {
        let url = `https://online.citysuper.com.hk/pages/search-results?q=${searchItem.replace(/ /gi, '%20')}&p=1`;

        const USER_DATA_DIR = 'D:\\temp\\puppeteer_user_data';
        const browser = await puppeteer.launch({
            headless: true
            // executablePath: '/mnt/c/Software_dev_course/Javascript_project/Quantopian optimization/node_modules/puppeteer/.local-chromium/chrome-win/chrome.exe',
            // userDataDir: USER_DATA_DIR
        });
        const page = await browser.newPage();
        let result = [];
        
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await page
                .waitForSelector('#search_res_container > div:nth-child(1) > a > div.isp_image_div > img')
                .then(async () => {
                    result.push(await page.evaluate(element => element.getAttribute('src'), await page.$('#search_res_container > div:nth-child(1) > a > div.isp_image_div > img')));
                    result.push(await page.evaluate(element => element.textContent, await page.$('#search_res_container > div:nth-child(1) > a > div.isp_info > span.isp_title')));
                    result.push(await page.evaluate(element => element.textContent, await page.$('#search_res_container > div:nth-child(1) > a > div.isp_info > span.isp_price.money')));
                })
        }
        catch (err) {
            console.log(err);
            result = 'No result found'
        }

        console.log(result);
        return result;
    }

}

module.exports = ChecklistService;


// For reference, the puppeteer way that I did at first. Does not work on multiple asynchronous fetching

// async scrapper(searchItem) {
//     let result = [];
//     const USER_DATA_DIR = 'D:\\temp\\puppeteer_user_data';
//     const browser = await puppeteer.launch({
//         headless: false,
//         executablePath: '/mnt/c/Software_dev_course/Javascript_project/Quantopian optimization/node_modules/puppeteer/.local-chromium/chrome-win/chrome.exe',
//         userDataDir: USER_DATA_DIR
//     });

//     const page = await browser.newPage();
//     await page.setViewport({ width: 1440, height: 900 });

//     await page.goto('https://online.citysuper.com.hk/pages/search-results?q=${searchItem.replace(/ /gi,'%20')}&p=1', { waitUntil: 'domcontentloaded' });

//     await page
//         .waitForSelector('#search_res_container > div:nth-child(1) > a > div.isp_image_div > img')
//         .then(async () => {
//             result.push(await page.evaluate(element => element.getAttribute('src'), await page.$('#search_res_container > div:nth-child(1) > a > div.isp_image_div > img')));
//             result.push(await page.evaluate(element => element.textContent, await page.$('#search_res_container > div:nth-child(1) > a > div.isp_info > span.isp_title')));
//             result.push(await page.evaluate(element => element.textContent, await page.$('#search_res_container > div:nth-child(1) > a > div.isp_info > span.isp_price.money')));
//         })

//     browser.close();
//     console.log(result);
//     return result;
// }




// For reference, drafted cheerio way to scrap (not working)

// Bypass anti scrapping from citysuper.com
// let customHeaderRequest = request.defaults({
//     headers: {
//         'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36`}
// })

// let requestBody = await customHeaderRequest.get(url, (err, res, body) => {
//     return body;
// })

// console.log(requestBody);
// let $ = cheerio.load(requestBody);

// result.push($('#search_res_container > div:nth-child(1) > a > div.isp_image_div > img').attr('src'));
// result.push($('#search_res_container > div:nth-child(1) > a > div.isp_info > span.isp_title').text());
// result.push($('#search_res_container > div:nth-child(1) > a > div.isp_info > span.isp_price.money').text());

// console.log(result);
// return result;