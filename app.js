const tracingName = 'express-endpoint'
const jaegerHost = process.env.JAEGER_HOST || 'jaeger'
const tracer = require('./src/tracer')(tracingName, jaegerHost)

const express = require('express')
const app = express()
const port = 3000

const morgan = require('morgan')
morgan.token('traceId', function (req, res) { return req.headers['x-b3-traceid'] })
const loggerFormat = '[:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":traceId"'
app.use(morgan(loggerFormat))

app.get('/app', (req, res) => {
	res.send('Hello World!')
})

app.get('/app/:argv', (req, res) => {
	res.send(req.params.argv)
	console.log({
		traceId: tracer.getCurrentSpan().spanContext.traceId,
		spanId: tracer.getCurrentSpan().spanContext.spanId,
		parentSpanId: tracer.getCurrentSpan().parentSpanId
	})
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port} in container.`)
	console.log(`Visit Web App at http://localhost/app`)
	console.log(`Visit Web App at http://localhost/app/any_string`)
	console.log(`Visit Jaeger at http://localhost:16686`)
	console.log(`Visit Traefik at http://localhost:8080`)
})

