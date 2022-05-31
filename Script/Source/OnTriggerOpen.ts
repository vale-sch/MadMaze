namespace MadMaze {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(MadMaze);  // Register the namespace to FUDGE for serialization

  export class OnTriggerOpen extends f.ComponentScript {
    public static readonly iSubclass: number = f.Component.registerSubclass(OnTriggerOpen);

    constructor() {
      super();
      if (f.Project.mode == f.MODE.EDITOR)
        return;
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case f.EVENT.COMPONENT_ADD:
          this.node.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.OnTriggerEnter);
          this.node.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.TRIGGER_EXIT, this.OnTriggerExit);
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }
    private OnTriggerEnter = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.node.name == "Ball") {
        this.node.getParent().getComponent(f.ComponentRigidbody).activate(false);
      }

    }
    private OnTriggerExit = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.node.name == "Ball") {
        this.node.getParent().getComponent(f.ComponentRigidbody).activate(true);

      }

    }
  }
}