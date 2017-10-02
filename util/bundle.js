const path = require('path');

/*
 @param {Object} assetMap - an object mapping chunk names to their outputted files (i.e. those
     with hashes).  This is expected to be of the form outputted by assets-webpack-plugin (which
     writes its output to webpack-assets.json - see that file for an example).
*/
module.exports = function bundle(assetMap) {
    return function(asset) {
        let ext = path.extname(asset) || '.js';
        asset = asset.replace(ext, '');
        ext = ext.replace('.', '');
        if (!assetMap[asset]) {
            throw new Error('no such bundle "' + asset + '" in webpack config');
        }
        return assetMap[asset][ext];
    };
}
