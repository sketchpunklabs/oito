import path     from "path";
import fs       from "fs";

const ignorePaths = [ ".git", "node_modules", "dist", "site" ];

export default ( { command, mode } ) => {
        return {
            build: {
                emptyOutDir     : false,
                minify          : false,

                lib             : {
                    entry   : path.resolve( __dirname, "src/oito_maths.ts" ),
                    name    : "oito_maths",
                    fileName: (format) => `extra/oito_maths.${format}.js`,
                    formats : [ "es" ],
                },

                rollupOptions   : {}
            },
        };
};