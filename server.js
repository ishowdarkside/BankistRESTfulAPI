const app = require("./App");
const mongoose = require("mongoose");
const DB = process.env.DB_LINK.replace("<PASSWORD>", process.env.DB_PASSWORD);
const PORT = process.env.PORT;

mongoose
  .connect(DB)
  .then(() => console.log("Successfully connected to database!"))
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
