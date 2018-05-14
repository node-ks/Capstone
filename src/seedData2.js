/** USE IN A SEPARATE FILE */
const jobStore = require('./jobs/stores')

/** CREATE JOBS */
jobStore.createJob({
    EmpId: 8,
    JobTitle:'Cook',
    JobDescr:'Prepare food for guests',
    Location:'Boston',
}).then(()=>{})
jobStore.createJob({
    EmpId: 7,
    JobTitle:'Painter',
    JobDescr:'Paint indoors and outdoors',
    Location:'Salem',
}).then(()=>{})
jobStore.createJob({
    EmpId: 6,
    JobTitle:'Lifeguard',
    JobDescr:'Supervise pool area',
    Location:'Danvers',
}).then(()=>{})
jobStore.createJob({
    EmpId: 10,
    JobTitle:'Cashier',
    JobDescr:'Provide a speedy checkout and help patrons',
    Location:'Beverly',
}).then(()=>{})
jobStore.createJob({
    EmpId: 9,
    JobTitle:'Technician',
    JobDescr:'Diagnose and repair attractions',
    Location:'Cambridge',
}).then(()=>{})
