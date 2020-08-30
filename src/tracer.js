'use strict';

const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
// I am using Jaeger as exporter
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

// This is not mandatory, by default httptrace propagation is used
// but it is not well supported by the PHP ecosystem and I have
// a PHP service to instrument. I discovered B3 is supported
// form all the languages I where intrumenting
const { B3Propagator } = require('@opentelemetry/core');

module.exports = (serviceName, jaegerHost) => {
  // A lot of those plugins are automatically loaded when you install them
  // So if you do not use express for example you do not have to enable all
  // those plugins manually. But Express is not auto enabled so I had to add them
  // all
  const provider = new NodeTracerProvider({
    plugins: {
      express: {
        enabled: true,
        path: '@opentelemetry/plugin-express',
      },
      // http: {
      //   enabled: true,
      //   path: '@opentelemetry/plugin-http',
      // },
    }
  });

  // Here is where I configured the exporter, setting the service name
  // and the jaeger host. The logger is helpful to track errors from the
  // exporter itself
  let exporter = new JaegerExporter({
    serviceName: serviceName,
    host: jaegerHost
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register({
    propagator: new B3Propagator(),
  });
  // Set the global tracer so you can retrieve it from everywhere else in the
  // app
  return opentelemetry.trace.getTracer(serviceName);
};