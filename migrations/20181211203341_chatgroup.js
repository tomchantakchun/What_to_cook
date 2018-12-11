
exports.up = function(knex, Promise) {
    return knex.schema.createTable('groups',(table)=>{
        table.increments();
        table.string("groups");
        table.timestamps(true,true);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('groups')
};
