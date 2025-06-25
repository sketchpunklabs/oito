import path     from 'path';
import fs       from 'fs';
import cleanup  from 'rollup-plugin-cleanup';

const ignorePaths = [ ".git", "node_modules", "dist", "site" ];

export default ( { command, mode } ) => {
        return {
            build: {
                emptyOutDir     : false,
                minify          : false,
                target          : 'esnext',

                lib             : {
                    entry   : path.resolve( __dirname, 'src/index.ts' ),
                    name    : 'oop',
                    fileName: (format) => 'curves.js',
                    formats : [ 'es' ],
                },

                rollupOptions   : {
                    output:{
                        dir     : '../../dist',
                        compact : true,
                    },
                    external: [ './oop.js', './core.js' ],
                    makeAbsoluteExternalsRelative: false,
                    plugins: [
                        cleanup( { comments: 'none', extensions:[ 'js', 'ts' ] } ),
                        replace( { values:{ '@oito/oop':'./oop.js', '@oito/core':'./core.js' }, delimiters: ['',''], preventAssignment:true  }  ),
                    ]
                }
            },
        };
};