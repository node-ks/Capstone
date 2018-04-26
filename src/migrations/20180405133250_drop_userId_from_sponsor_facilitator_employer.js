exports.up = function(knex) {
    return knex.schema
    .table('SPONSOR', function(t) {
        t.dropColumn('UserId');
      })
    .table('EMPLOYER', function(t){
        t.dropColumn('UserId');
      })
    .table('FACILITATOR', function(t){
        t.dropColumn('UserId');
      })    
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('SPONSOR', function(t) {
        t.string('UserId').nullable();
     })
     .alterTable('EMPLOYER', function(t) {
        t.string('UserId').nullable();
     })
     .alterTable('FACILITATOR', function(t) {
        t.string('UserId').nullable();
     }) 
};