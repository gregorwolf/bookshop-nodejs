// load modules
const express = require('express')
const helmet = require('helmet')
// const compression = require("compression")
const cds = require('@sap/cds')
const proxy = require('@sap/cds-odata-v2-adapter-proxy')

// For authentication test
const passport = require('passport')
const xsenv = require('@sap/xsenv')
xsenv.loadEnv();
const JWTStrategy = require('@sap/xssec').JWTStrategy
const services = xsenv.getServices({ xsuaa: { tags: 'xsuaa' }})
passport.use(new JWTStrategy(services.xsuaa))

// config
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 4004

;(async () => {
  // create new app
  const app = express()
  app.use(helmet())
  // app.use(compression())
  // Authentication using JWT
  await app.use(passport.initialize())
  await app.use(
    passport.authenticate('JWT', { session: false })
  )

  await app.get('/api/userInfo', function (req, res) {
    res.send(JSON.stringify(req.user))
  })
  // serve odata v4
  await cds.connect('db') // ensure database is connected!

  await cds
    .serve('gen/csn.json')
    .in(app);

  // serve odata v2
  process.env.XS_APP_LOG_LEVEL = 'error'; // suppress debug logs
  app.use(
    proxy({
      // app
      path: 'v2',
      model: 'gen/csn.json',
      // target
      port: port
    })
  )
  // start server
  const server = app.listen(port, host, () => {
    console.info(`app is listing at ${port}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  })
  server.on('error', error => console.error(error.stack))
})()
