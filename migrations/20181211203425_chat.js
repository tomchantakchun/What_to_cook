
exports.up = function(knex, Promise) {
    return knex.schema.createTable('chat',(table)=>{
        table.increments();
        table.integer("userid").references('users.id');
        table.integer("groupid").references('groups.id');
        table.string("record");
        table.timestamps(true,true);
      });
};

exports.down = function(knex, Promise) {
  return  knex.schema.dropTable('chat')
};
