const app = require('express')()
const helmet = require('helmet')
const compression = require('compression')
const cds = require('@sap/cds')

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

module.exports = app