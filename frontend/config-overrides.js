module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.glsl/,
        type: 'asset/source',
    });
    return config;
}