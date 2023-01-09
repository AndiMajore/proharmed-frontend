const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    configureWebpack: {
        module: {
            exprContextCritical: false
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true
                        }
                    }
                }),
            ],
            splitChunks: {
                chunks: 'all'
            }
        },
        plugins: []
    },
    pluginOptions: {
        compression: {
            gzip: {
                filename: '[file].gz[query]',
                algorithm: 'gzip',
                include: /\.(js|css|html|svg|json)(\?.*)?$/i,
                minRatio: 0.8,
            }
        }
    }
}
