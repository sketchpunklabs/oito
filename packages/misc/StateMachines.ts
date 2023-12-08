// #region TYPES
export interface IStateMachine<P> {
    name: string;
    onInit(obj?: P): void;
    onRelease(obj?: P): void;
    onSuspend(obj?: P): void;
    onWakeup(obj?: P): void;
  }
  

  type TAny = any;
  // #endregion
  

  export class StateMachines<T: IStateMachine<any>> {
    // #region MAIN
    list: {[key: string]: T} = {}; // Collection of registered state machines
    stack: Array<T> = []; // Stack of active state machines
    // #endregion
  
    // #region SETTERS / GETTERS
  
    // Register a state machine
    reg(...ary: Array<T>): this {
      for (const sm of ary) {
        this.list[sm.name] = sm;
      }
  
      return this;
    }
  
    // Get the top most active state machine in the stack
    getTopActive(): T {
      return this.stack[this.stack.length - 1];
    }
  
    // Check if the named state machine is currently in the stack
    isActive(name: string): boolean {
      for (const m of this.stack) {
        if (m.name === name) {
          return true;
        }
      }
  
      return false;
    }
  
    // #endregion
  
    // #region MANAGE STACK
  
    // Push a new machine to the top of the stack
    push(name: string, obj: TAny): this {
      const sm = this.list[name];
      if (sm) {
        if (this.stack.length > 1) {
          const prev = this.getTopActive();
          prev.onSuspend(obj); // Pause active machine
        }
  
        sm.onInit(obj); // Initialize new machine
        this.stack.push(sm); // New machine is now the active one
      } else {
        console.error('State machine not found: ', name);
      }
  
      return this;
    }
  
    // Remove top active machine & reactivate previous one
    pop(obj: TAny): this {
      const idx = this.stack.length - 1;
      if (idx !== 0) {
        const sm = this.stack.pop();
        sm.onRelease(obj); // End existing machine
        this.stack[idx - 1].onWakeup(obj); // Reactivate previous machine
      }
      return this;
    }
  
    // Swop top active machine with a new one
    switch(name: string, obj: TAny): this {
      const sm = this.list[name];
      if (sm) {
        const idx = this.stack.length - 1;
        this.stack[idx].onRelease(obj); // End existing machine
        sm.onInit(obj); // Start new machine
        this.stack[idx] = sm; // Make it the most active
      } else {
        console.error('State machine not found: ', name);
      }
  
      return this;
    }
  
    // Exit all machines & activate root machine
    clear(obj: TAny): this {
      if (this.stack.length > 1) {
        while (this.stack.length > 1) {
          this.stack.pop().onRelease(obj);
        }
  
        this.stack[0].onWakeup(obj);
      }
      return this;
    }
  
    // #endregion
  }
  