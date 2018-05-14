exports.up = function(knex) {
    return knex.schema
    .table('STUDENT', function(t) {
        t.dropForeign('SchoolId');
        t.dropForeign('SponsorId');
        t.dropForeign('JobId');
      });
};

exports.down = function(knex) {
    return knex.schema
    .table('STUDENT', function(t) {
        t.foreign('SchoolId').references('SCHOOL.SchId')
        t.foreign('SponsorId').references('SPONSOR.SpnId')
        t.foreign('JobId').references('JOB.JobId')
      });
};
