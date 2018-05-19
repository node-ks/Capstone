exports.up = function (knex) {
    return knex.schema
    .alterTable('SPONSOR_DOCS',function(t){
      t.foreign('SpnId').references('SPONSOR.SpnId')  
    })
}

exports.down = function(knex) {
    return
    knex.schema
    .alterTable('SPONSOR_DOCS', function (t) {
        t.dropForeign('SpnId')
      })
    }
// table.dropForeign(columns, [foreignKeyName])
