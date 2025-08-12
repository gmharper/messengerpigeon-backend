const db = require("./db/connection");

// const a = db.query('SELECT * FROM topics').then((result) => {
//     return result.rows
// })
// .then((result) => {
//     (console.log(result))
// })

const votes = db.query(
    "SELECT * FROM articles ORDER BY cardinality(voted_by) DESC"
)
.then((result) => {
    console.log(result.rows)
    return result.rows
})

console.log(votes)