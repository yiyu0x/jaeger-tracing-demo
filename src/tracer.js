var initTracer = require('jaeger-client').initTracer;

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
  serviceName: 'my-awesome-service',
  reporter: {
    agentHost: 'jaeger'
  },
};
var options = {
  tags: {
    'foo': 'bar',
  },
  // metrics: metrics,
  // logger: logger,
};
var tracer = initTracer(config, options);
module.exports = tracer