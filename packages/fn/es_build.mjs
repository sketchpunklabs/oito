import esbuild      from 'esbuild';

const outFile = '../../dist/fn.js';
const config  = {
    entryPoints   : ['./src/index.ts'],
    outfile       : outFile,
    tsconfig      : './tsconfig.json',
    platform      : 'neutral',
    logLevel      : 'info',
    bundle        : false,
    minify        : false,
    sourcemap     : false,
    plugins       : [
    ]
  };

  async function build_lib(){
    await esbuild.build( config ).catch( err=>{
        console.log( err );
        process.exit( 1 );
    } );
  }
  
  build_lib();