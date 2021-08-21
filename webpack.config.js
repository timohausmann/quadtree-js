module.exports = (env, argv) => { 

    const devMode = argv.mode !== 'production';

    return {
        entry: "./src/index.ts",
        output: {
            filename: "quadtree.min.js",
            library: {
                name: 'Quadtree',
                type: 'umd',
            },
            globalObject: 'this',
        },
        devtool: devMode ? 'inline-source-map' : false,
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
                { test: /\.tsx?$/, loader: "ts-loader" },
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                { test: /\.js$/, loader: "source-map-loader" },
            ],
        },
    }
};