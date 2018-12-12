
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.string('recentSearch');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.dropColumn('recentSearch');})
};
