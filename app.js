
const express = require('express'),
    app = express(),
    logger = require('morgan'),
    _ = require('underscore'),
    path = require('path'),
    compression = require('compression'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    bundle = require('./util/bundle');

app.set('env', (process.env.ENV || 'development').toLowerCase());

const webpackAssets = app.get('env') === 'production' ? require('./webpack-assets.json') : {};
app.locals.bundle = app.get('env') === 'test' ? function() {} : bundle(webpackAssets);

// Use Pug to render templates
app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());

app.use(webpackConfig.output.publicPath, function(req, res, next) {
    res.set('Cache-Control', 'public, max-age=31556909');
    next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxage: '1y' }));

// in dev mode, bundle assets on the fly
if (app.get('env') === 'development') {
    app.use(webpackDevMiddleware(webpack(webpackConfig), {
        publicPath: webpackConfig.output.publicPath,
        serverSideRender: true // provide res.locals.webpackStats, the info about the latest rebuild
    }));

    // refresh the bundle function every request so it always knows about the latest build,
    // so we don't have to restart the server to get the latest client code changes.
    app.use(function(req, res, next) {
        // convert object of the form { chunkName: [ <chunk.js>, <chunk.css>, ... ] }
        // to { chunkName: { js: <chunk.js>, css: <chunk.css>, ... } }
        var assetMap = _.mapObject(res.locals.webpackStats.toJson().assetsByChunkName, val => {
            if (!Array.isArray(val)) {
                val = [val];
            }
            return _.chain(val)
                .map(filename => {
                    return path.join(webpackConfig.output.publicPath, filename);
                })
                .indexBy(filename => {
                    return path.extname(filename).replace('.', '');
                })
                .value();
        });
        req.app.locals.bundle = bundle(assetMap);
        next();
    });
}

app.use('/', require('./routes/index'));

// Fell through every route without rendering a response -- return custom 404
app.use(catch404);

// If in production, only return an abbreviated version of the error object.
if (app.get('env') === 'production' && !app.get('renderStackTraces')) {
    app.use(abbreviateError);
}

app.set('port', parseInt(process.env.PORT) || 8000);
const server = app.listen(app.get('port'), function() {
    console.log("Using " + app.get('env').toUpperCase() + " connection settings");
    console.log("Listening on port " + server.address().port);
});

function catch404(req, res, next) {
    const err = new Error('Not found');
    err.statusCode = 404;
    next(err);
}

function abbreviateError(err, req, res, next) {
    var abbrev = {
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors // validation errors, if any
    };
    next(abbrev);
}
