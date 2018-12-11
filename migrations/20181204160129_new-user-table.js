exports.up = function(knex,Promise){
    return knex.schema.createTable('users',(table)=>{
      table.increments();
      table.string("userName");
      table.string("displayName");
      table.string("password");
      table.string("email");
      table.string("loginMethod");
      table.string("SocialLoginID");
      table.string("profilePic")
      table.timestamps(true,true);
    });
  }
  
  exports.down = function(knex,Promise){
    return knex.schema.dropTable('users');
  }