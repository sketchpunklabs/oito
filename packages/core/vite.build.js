import path     from "path";
import fs       from "fs";

const ignorePaths = [ ".git", "node_modules", "dist", "site" ];

export default ( { command, mode } ) => {
        return {

            build: {
                emptyOutDir     : false,
                minify          : false,
                target          : "esnext",

                lib             : {
                    entry   : path.resolve( __dirname, "src/index.ts" ),
                    name    : "core",
                    fileName: (format) => 'core.js',
                    formats : [ "es" ],
                },

                rollupOptions   : {
                    output:{
                        dir     : 'build',
                    }
                }
            },
        };
};