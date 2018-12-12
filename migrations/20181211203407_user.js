
exports.up = function(knex, Promise) {
    return knex.schema.createTable('groupsusers',(table)=>{
        table.increments();
        table.integer("userid").references('users.id');
        table.integer("groupid").references('groups.id')
        table.timestamps(true,true);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('groupsusers')
};
