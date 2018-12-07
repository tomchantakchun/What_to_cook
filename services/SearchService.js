class SearchService {
    constructor(knex) {
        this.knex = knex;
    }

    async search(keyword) {
        return await this.knex('delishRecipe').select('label','image','cookingTime').whereRaw(`LOWER(label) LIKE LOWER('%${keyword}%')`)
    }

    async searchDetail(keyword) {
        return await this.knex('delishRecipe').select('*').where('label', keyword)
    }
}

module.exports = SearchService;