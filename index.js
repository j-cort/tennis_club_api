const app = require("./src/server");

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).send(message);
});

app.listen(3005, () => {
  console.log("listening on port 3005");
});
