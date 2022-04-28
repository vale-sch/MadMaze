namespace MadMaze {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(MadMaze);  // Register the namespace to FUDGE for serialization

  export class OnCollisionAlpha extends f.ComponentScript {
    public static readonly iSubclass: number = f.Component.registerSubclass(OnCollisionAlpha);



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
          f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
          this.node.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.collisionEnter);
          this.node.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_EXIT, this.collisionExit);
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }
    private collisionEnter = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.node.name == "Ball") {
        this.node.getChildren().forEach(node => {
          node.getComponent(f.ComponentMaterial).clrPrimary.a = 1;
        });
        this.node.getComponent(f.ComponentMaterial).clrPrimary.a = 1;
      }

    }
    private collisionExit = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.node.name == "Ball") {
        this.node.getChildren().forEach(node => {
          node.getComponent(f.ComponentMaterial).clrPrimary.a = 0.1;
        });
        this.node.getComponent(f.ComponentMaterial).clrPrimary.a = 0.1;
      }

    }
    private update = (): void => {

    }
  }
}