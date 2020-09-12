const { default: middleware } = require("express-opentracing")
const tracer = require('./src/tracer')
const path = require('path');

const express = require('express')
const app = express()
app.use(middleware({ tracer: tracer }))
const port = 3000

const morgan = require('morgan')
morgan.token('traceId', function (req, res) { return req.headers['uber-trace-id'].split(':')[0] })
const loggerFormat = '[:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":traceId"'
app.use(morgan(loggerFormat))

app.use('/app/dist', express.static(__dirname + '/src/public'));

app.get('/app', (req, res) => {
	res.send(`Hello World!</br>
	traceId: ${req.headers['uber-trace-id'].split(':')[0]}</br>
	Visit Jaeger at <a href="http://localhost:16686">jaeger</a>`)
})

app.get('/app/page', (req, res) => {
	res.sendFile(path.join(__dirname + '/src/dist/index.html'));
})

app.get('/app/:argv', (req, res) => {
	res.send(`req.params.argv: ${req.params.argv}</br>
	traceId: ${req.headers['uber-trace-id'].split(':')[0]}</br>
	Visit Jaeger at <a href="http://localhost:16686">jaeger</a>`)
})



app.listen(port, () => {
	console.log(`Listening at http://localhost:${port} in container.`)
	console.log(`Visit Web App at http://localhost/app`)
	console.log(`Visit Web App at http://localhost/app/any_string`)
	console.log(`Visit Jaeger at http://localhost:16686`)
	console.log(`Visit Traefik at http://localhost:8080`)
})

