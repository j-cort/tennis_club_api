const app = require('./src/server')
const playerRoutes = require('./src/router/players')
const matchRoutes = require('./src/router/matches')

app.use(playerRoutes)
app.use(matchRoutes)

app.listen(3005, () => {
  console.log("listening on port 3005");
});
