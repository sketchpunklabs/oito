import path                     from "path";
import { fileURLToPath }        from 'url';
import { defineConfig }         from 'vite'
import { directoryPlugin }      from 'vite-plugin-list-directory-contents';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode, ssrBuild }) => {
    switch( command ){
        case 'serve': return {
            base      : './',
            plugins   : [
                directoryPlugin( {
                    baseDir     : __dirname,
                    filterList  : [ 'node_modules', '.git', '.github', '_store', '_images', 'dist', 'src', '.*' ],
                }),
            ],
            server    : {
                host        : 'localhost',
                port        : 3022,
                open        : '/',
                strictPort  : true,
            },

            resolve:{
                alias:{ 
                    '@oito/ray': './packages/ray/src/index.ts', 
                    '@oito/oop': './packages/oop/src/index.ts'
                },
            }
        };
        
        case 'build': return{

        };
    }
});