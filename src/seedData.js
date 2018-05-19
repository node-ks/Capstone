/** Script to populate database with sample values for all tables */
const userStore = require('./users/stores')
const studentStore = require('./students/stores')
const sponsorStore = require('./sponsors/stores')
const employerStore = require('./employers/stores')
const facilitatorStore = require('./facilitators/stores')
const schoolStore = require('./schools/stores')
//const jobStore = require('./jobs/stores')

/** CREATE USERS */
userStore.createUser({
    username: 'Karan',
    password: '123',
    Email: 'k@k.com',
    RoleRequested: '0'
}).then(()=>{})

userStore.createUser({
    username: 'Dean',
    password: '123',
    Email: 'k@k.com',
    RoleRequested: '0'
}).then(()=>{})

userStore.createUser({
    username: 'Wei',
    password: '123',
    Email: 'k@k.com',
    RoleRequested: '0'
}).then(()=>{})

userStore.createUser({
    username: 'Bo',
    password: '123',
    Email: 'k@k.com',
    RoleRequested: '0'
}).then(()=>{})

userStore.createUser({
    username: 'Joe',
    password: '123',
    Email: 'k@k.com',
    RoleRequested: '0'
}).then(()=>{})

userStore.createUser({
    username: 'Pablo',
    password: '123',
    Email: 'k@k.com',
    RoleRequested: '0'
}).then(()=>{})

userStore.createUser({
    username: 'Mario',
    password: '123',
    Email: 'k@k.com',
    RoleRequested: '0'
}).then(()=>{})


/** CREATE STUDENTS */
studentStore.createStudent({
    Fname: 'Karan',
    Mname: '',
    Lname: 'S',
    Gender: 'Male',
    StudAddress: '123 India Street, Salem, MA, USA',
    Dob: '1995-04-27',
    Phone: '7817817811',
    Email: 'K@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Dean',
    Mname: 'A',
    Lname: 'B',
    Gender: 'Male',
    StudAddress: '123 Jamaica Street, Salem, MA, USA',
    Dob: '1985-01-01',
    Phone: '7817817811',
    Email: 'D@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Wei',
    Mname: '',
    Lname: 'Y',
    Gender: 'Male',
    StudAddress: '123 China Street, Salem, MA, USA',
    Dob: '2001-01-01',
    Phone: '7817817811',
    Email: 'W@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Ariel',
    Mname: 'A',
    Lname: 'T',
    Gender: 'Male',
    StudAddress: '123 Dominicano Street, Salem, MA, USA',
    Dob: '2001-01-01',
    Phone: '7817817811',
    Email: 'A@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Ariel',
    Mname: 'A',
    Lname: 'T',
    Gender: 'Male',
    StudAddress: '123 Dominicano Street, Salem, MA, USA',
    Dob: '2001-01-01',
    Phone: '7817817811',
    Email: 'A@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Pablo',
    Mname: 'Robert Glasper',
    Lname: 'V-O',
    Gender: 'Male',
    StudAddress: '123 Dominicano Street, Salem, MA, USA',
    Dob: '2001-01-01',
    Phone: '7817817811',
    Email: 'P@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Mario',
    Mname: 'Luigi',
    Lname: 'M',
    Gender: 'Male',
    StudAddress: '123 Greece Street, Salem, MA, USA',
    Dob: '2001-01-01',
    Phone: '7817817811',
    Email: 'M@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Vinny',
    Mname: 'J',
    Lname: 'B',
    Gender: 'Male',
    StudAddress: '123 Italy Street, Salem, MA, USA',
    Dob: '2001-01-01',
    Phone: '7817817811',
    Email: 'V@salemstate.edu'
}).then(()=>{})
studentStore.createStudent({
    Fname: 'Colby',
    Mname: 'J',
    Lname: 'Shelby',
    Gender: 'Male',
    StudAddress: '123 England Street, Salem, MA, USA',
    Dob: '2001-01-01',
    Phone: '7817817811',
    Email: 'C@salemstate.edu'
}).then(()=>{})


/** CREATE SPONSORS */
sponsorStore.createSponsor({
    SpnName: 'Lionel Richie',
    SpnAddress: '123 Hello Lane, Salem, MA, USA',
    Phone: '7817817811',
    Email: 'Lionel@salemstate.edu'
}).then(()=>{})
sponsorStore.createSponsor({
    SpnName: 'Miles Davis',
    SpnAddress: '123 Stella Lane, Salem, MA, USA',
    Phone: '7817817811',
    Email: 'Milesl@salemstate.edu'
}).then(()=>{})
sponsorStore.createSponsor({
    SpnName: 'Freddy Mercury',
    SpnAddress: '123 Barcelona Lane, Salem, MA, USA',
    Phone: '7817817811',
    Email: 'Freddy@salemstate.edu'
}).then(()=>{})
sponsorStore.createSponsor({
    SpnName: 'Marcus Miller',
    SpnAddress: '123 Detroit Lane, Salem, MA, USA',
    Phone: '7817817811',
    Email: 'Marcusl@salemstate.edu'
}).then(()=>{})
sponsorStore.createSponsor({
    SpnName: 'Bill Evans',
    SpnAddress: '123 Danny Lane, Salem, MA, USA',
    Phone: '7817817811',
    Email: 'Bill@salemstate.edu'
}).then(()=>{})


/** CREATE EMPLOYERS */
employerStore.createEmployer({
    EmpName: 'Disney Parks',
    EmpAddress: '123 Mickey Way, Orlando, FL, USA',
    Phone: '7817817811',
    Email: 'Mouse@salemstate.edu',
    Rep: 'Walter Disney'
}).then(()=>{})
employerStore.createEmployer({
    EmpName: 'Universal Studios',
    EmpAddress: '123 Jurassic Way, Orlando, FL, USA',
    Phone: '7817817811',
    Email: 'Pterodactyl@salemstate.edu',
    Rep: 'Jeff Goldblum'
}).then(()=>{})
employerStore.createEmployer({
    EmpName: 'AMC',
    EmpAddress: '123 Movie Way, Orlando, FL, USA',
    Phone: '7817817811',
    Email: 'Theater@salemstate.edu',
    Rep: 'Michael Bay'
}).then(()=>{})
employerStore.createEmployer({
    EmpName: 'KFC',
    EmpAddress: '11 Spice Herb Way, Louisville, KY, USA',
    Phone: '7817817811',
    Email: 'Colonel@salemstate.edu',
    Rep: 'Harland Sanders'
}).then(()=>{})
employerStore.createEmployer({
    EmpName: 'Rent A Drone',
    EmpAddress: '123 Hover Way, Kitty Hawk, North Carolina, USA',
    Phone: '7817817811',
    Email: 'Wright@salemstate.edu',
    Rep: 'Orville Wilbur'
}).then(()=>{})


/** CREATE FACILITATORS */
facilitatorStore.createFacilitator({
    Fname: 'Bo',
    Mname: 'Jin',
    Lname: 'Hatfield',
    Email: 'Bo@salemstate.edu',
    Phone: '7817817811'
}).then(()=>{})
facilitatorStore.createFacilitator({
    Fname: 'Joe',
    Mname: 'Java',
    Lname: 'Kasprzyk',
    Email: 'Joe@salemstate.edu',
    Phone: '7817817811'
}).then(()=>{})
facilitatorStore.createFacilitator({
    Fname: 'Beifang',
    Mname: 'Discrete',
    Lname: 'Yi',
    Email: 'Beifang@salemstate.edu',
    Phone: '7817817811'
}).then(()=>{})


/** CREATE SCHOOLS */
schoolStore.createSchool({
    SchName:'Salem State University',
    SchAddress:'352 Lafayette Street, Salem, MA, USA',
    Phone:'978542600',
    Email:'admissions@salemstate.edu',
    Rep:'John Keenan'
}).then(()=>{})
schoolStore.createSchool({
    SchName:'North Shore Community College',
    SchAddress:'123 Lynn Way, Lynn, MA, USA',
    Phone:'7817817811',
    Email:'admissions@northshore.edu',
    Rep:'James Madison'
}).then(()=>{})
schoolStore.createSchool({
    SchName:'Endicott College',
    SchAddress:'123 Gull Lane, Beverly, MA, USA',
    Phone:'9789789788',
    Email:'admissions@endicott.edu',
    Rep:'Andrew Jackson'
}).then(()=>{})
schoolStore.createSchool({
    SchName:'UMass Lowell',
    SchAddress:'123 River Hawk Road, Lowell, MA, USA',
    Phone:'7817817811',
    Email:'admissions@umass.edu',
    Rep:'Grover Cleveland'
}).then(()=>{})
schoolStore.createSchool({
    SchName:'Bentley University',
    SchAddress:'123 Falcon Road, Waltham, MA, USA',
    Phone:'7817817811',
    Email:'admissions@bentley.edu',
    Rep:'Woodrow Wilson'
}).then(()=>{})


/** USE IN A SEPARATE FILE 
/** CREATE JOBS 
jobStore.createJob({
    JobTitle:'Cook',
    JobDescr:'Prepare food for guests',
    Location:'Boston',
}).then(()=>{})
jobStore.createJob({
    JobTitle:'Painter',
    JobDescr:'Paint indoors and outdoors',
    Location:'Salem',
}).then(()=>{})
jobStore.createJob({
    JobTitle:'Lifeguard',
    JobDescr:'Supervise pool area',
    Location:'Danvers',
}).then(()=>{})
jobStore.createJob({
    JobTitle:'Cashier',
    JobDescr:'Provide a speedy checkout and help patrons',
    Location:'Beverly',
}).then(()=>{})
jobStore.createJob({
    JobTitle:'Technician',
    JobDescr:'Diagnose and repair attractions',
    Location:'Cambridge',
}).then(()=>{})
*/