const app         = require('express')()
const passport    = require('passport');
const helmet      = require('helmet')
const compression = require('compression')
const cds         = require('@sap/cds')
const xsenv       = require('@sap/xsenv')
const JWTStrategy = require('@sap/xssec').JWTStrategy

app.use(helmet())
app.use(compression({ threshold: '512b' }))

app.loaded = []

app.loaded.push(
  cds
    .serve('AdminService')
    .from('gen/csn.json')
    .in(app)
    .at('admin/')
    .catch(console.error)
)

app.loaded.push(
  cds
    .serve('CatalogService')
    .from('gen/csn.json')
    .in(app)
    .at('catalog/')
    .catch(console.error)
)

// Test Endpoint for authentication
const services = xsenv.getServices({ uaa:'bookshop-nodejs-uaa' })

passport.use(new JWTStrategy(services.uaa))

app.use(passport.initialize())
app.use(passport.authenticate('JWT', { session: false }))

app.get('auth/', function (req, res, next) {
  res.send('Application user: ' + req.user.id)
});

module.exports = app