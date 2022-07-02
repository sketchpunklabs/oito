import path     from "path";
import fs       from "fs";

const ignorePaths = [ ".git", "node_modules", "dist", "site" ];

export default ( { command, mode } ) => {
        return {
            build: {
                emptyOutDir     : false,
                minify          : false,

                lib             : {
                    entry   : path.resolve( __dirname, "src/oito_fn.ts" ),
                    name    : "oito_fn",
                    fileName: (format) => `extra/oito_fn.${format}.js`,
                    formats : [ "es" ],
                },

                rollupOptions   : {}
            },
        };
};