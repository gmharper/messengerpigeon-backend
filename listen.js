const app = require("./app/api.js");
const { PORT = 5432 } = process.env;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
