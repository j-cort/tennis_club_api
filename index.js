const AppError = require("./src/errorHandling/AppError");
const app = require("./src/server");

// app.all('*', (req, res, next) => {
//   next(new AppError('Page Not Found!', 404))
// })

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  console.log(message)
  res.status(status).json(message);
});

app.listen(3005, () => {
  console.log("listening on port 3005");
});
