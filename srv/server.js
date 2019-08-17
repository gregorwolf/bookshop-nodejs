const app = require('./app')
const cds = require('@sap/cds')

cds.connect()

const port = process.env.PORT || 4004
app.listen(port, function () {
  console.log('listening on port ' + port)
});
