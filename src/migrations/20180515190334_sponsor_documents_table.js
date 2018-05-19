exports.up = function (knex) {
    return knex.schema
    .createTable('SPONSOR_DOCS', function(t) {
      t.increments('DocId')
      t.string('DocTitle')
      t.string('DocDescr')
      t.integer('SpnId')
    })
}

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('SPONSOR_DOCS')
      }
// table.dropForeign(columns, [foreignKeyName])
