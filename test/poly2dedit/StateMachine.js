export default class StateMachine{
    // #region MAIN
    list = {}; // Collection of registered state machines
    stack = []; // Stack of active state machines
  
    dispose(){
      for (const sm of Object.values(this.list)) {
        sm.dispose();
      }
    }
    // #endregion
  
    // #region SETTERS / GETTERS
  
    // Register a state machine
    reg(...ary){
      for (const sm of ary) {
        this.list[sm.name] = sm;
      }
  
      return this;
    }
  
    // Get the top most active state machine in the stack
    getCurrent(){
      return this.stack[this.stack.length - 1];
    }
  
    // Get the name of the most active state machine in the stack
    getCurrentName(){
      const sm = this.stack[this.stack.length - 1];
      return sm ? sm.name : '';
    }
  
    // Check if the named state machine is currently in the stack
    isActive(name){
      for (const m of this.stack) {
        if (m.name === name) {
          return true;
        }
      }
  
      return false;
    }
  
    get stackSize() {
      return this.stack.length;
    }
  
    getMachine(name) {
      const sm = this.list[name];
      return sm ? sm : null;
    }
  
    // #endregion
  
    // #region MANAGE STACK

    clearPush( name, obj ){
      this.clear( obj, true );
      this.push( name );
    }
  
    // Push a new machine to the top of the stack
    push(name, obj){
      const sm = this.list[name];
      if (sm) {
        if (!sm.validateStartup(obj)) {
          console.log(`Machine failed startup validation: ${sm.name}`);
          return this;
        }
  
        if (this.stack.length > 0) {
          const prev = this.getCurrent();
          prev.onSuspend(obj); // Pause active machine
        }
  
        sm.onInit(obj); // Initialize new machine
        this.stack.push(sm); // New machine is now the active one
      } else {
        console.log(`State machine not found: ${name}`);
      }
  
      return this;
    }
  
    // Remove top active machine & reactivate previous one
    pop(obj){
      const idx = this.stack.length - 1;
      if (idx !== 0) {
        const sm = this.stack.pop();
        sm.onRelease(obj); // End existing machine
        this.stack[idx - 1].onWakeup(obj); // Reactivate previous machine
      }
      return this;
    }
  
    // Swop top active machine with a new one
    switch(name, obj){
      const sm = this.list[name];
      if (sm) {
        if (!sm.validateStartup(obj)) {
            console.log(`Machine failed startup validation: ${sm.name}`);
          return this;
        }
  
        const idx = this.stack.length - 1;
        this.stack[idx].onRelease(obj); // End existing machine
        sm.onInit(obj); // Start new machine
        this.stack[idx] = sm; // Make it the most active
      } else {
        console.log(`State machine not found: ${name}`);
      }
  
      return this;
    }
  
    // Exit all machines & activate root machine
    clear(obj, keepRoot = true) {
      const iMax = keepRoot ? 1 : 0;
  
      if (this.stack.length > iMax) {
        while (this.stack.length > iMax) {
          this.stack.pop().onRelease(obj);
        }
  
        if (keepRoot && this.stack.length === 1) {
          this.stack[0].onWakeup(obj);
        }
      }
      return this;
    }
  
    // Clears stack without waking up root machine
    pushStart(name, obj) {
      // Clear stack leaving root alone
      while (this.stack.length > 1) {
        this.stack.pop().onRelease(obj);
      }
  
      // Start new machine
      this.push(name, obj);
      return this;
    }
    // #endregion
  }
  