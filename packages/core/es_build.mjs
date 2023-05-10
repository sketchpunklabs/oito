import esbuild      from 'esbuild';
// import textReplace  from 'esbuild-plugin-text-replace'

const outFile = '../../dist/core.js';

const config = {
    entryPoints   : ['./src/index.ts'],
    outfile       : outFile,
    tsconfig      : './tsconfig.json',
    // platform      : 'neutral',
    format        : 'esm',
    target        : 'esnext',
    logLevel      : 'info',
    bundle        : true,
    minify        : false,
    sourcemap     : false,
  };

  async function build_lib(){
    await esbuild.build( config ).catch( err=>{
        console.log( err );
        process.exit( 1 );
    } );

    // await esbuild.build({
    //     entryPoints     : [outFile],
    //     outfile         : outFile,
    //     allowOverwrite  : true,
    //     plugins: [ 
    //         textReplace( { pattern : [ ['@oito/fn','./fn.js'] ] } )
    //     ],
    // }).catch( err=>{
    //     console.log( err );
    //     process.exit( 1 );
    // } );
  }
  
  build_lib();