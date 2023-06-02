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
                    name    : "oop",
                    fileName: (format) => 'oop.js',
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