const db = require("./db/connection");

const a = db.query('SELECT * FROM topics').then((result) => {
    return result.rows
})
.then((result) => {
    (console.log(result))
})

console.log(a)