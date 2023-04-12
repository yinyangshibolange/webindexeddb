
const babel = require('@rollup/plugin-babel')
const  {terser} = require('rollup-plugin-terser') ;
const path = require("path")

module.exports =  {
    input: 'package/index.js',
    output: [
    //     {
    //     // dir: path.resolve(__dirname, './lib'),
    //     file: "./lib/bundle.js",
    //     // name: 'bundle' ,
    //     format: 'iife',
    //     globals: {
    //         // window: 'that'
    //     }
    // },{
    //     // dir: path.resolve(__dirname, './lib'),
    //     file: "./lib/bundle.min.js",
    //     // name: 'bundle.min' ,
    //     format: 'iife',
    //     globals: {
    //         // window: 'that'
    //     },
    //     plugins: [terser()]
    // },{
    //     // dir: path.resolve(__dirname, './lib'),
    //     file: "./lib/bundle.umd.js",
    //     name: 'IndexdbStore' ,
    //     format: 'umd',
    //     globals: {
    //         // window: 'that'
    //     },
    // },
        {
        // dir: path.resolve(__dirname, './lib'),
        file: "./lib/bundle.umd.min.js",
        name: 'IndexdbStore' ,
        format: 'umd',
        globals: {
            // window: 'that'
        },
        plugins: [terser()]
    },],
    plugins: [
        babel({ babelHelpers: 'bundled' })
    ]
}
