// #region TYPES
// interface IInputOp {
//   onPointerDown(x: number, y: number, e: PointerEvent, obj: TAny): boolean;
//   onPointerMove(x: number, y: number, e: PointerEvent, obj: TAny): void;
//   onPointerUp(e: PointerEvent, obj: TAny): void;
//   // onPointerCancel(e: PointerEvent, obj: TAny): void;
//   // onContextMenu(e: MouseEvent, obj: TAny): boolean;
//   onDblClick(e: MouseEvent, obj: TAny): boolean;
// }

// type IOperationMachine = IStateMachine<TAny> & IInputOp;
// #endregion

export default class BaseOp{
    // #region MAIN
    name   = 'baseOp';
    editor = null;
    constructor( editor ){ this.editor = editor; }
    // #endregion

    // #region STATE MACHINE INTERFACE
    onInit(_obj){}
    onRelease(_obj){}
    onSuspend(_obj){}
    onWakeup(_obj){}
    validateStartup(_obj){ return true; }
    dispose(){}
    // #endregion

    // #region INPUT INTERFACE
    onPointerDown( _x, _y, _e, _obj ){ return true; }
    onPointerMove( _x, _y, _e, _obj ){}
    onPointerUp( _e, _obj ){}
    onPointerCancel( _e, _obj ){}
    onDblClick( _e, _obj ){ return false; }
    // #endregion
}
