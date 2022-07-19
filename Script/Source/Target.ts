namespace MadMaze {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(MadMaze);  // Register the namespace to FUDGE for serialization

  export class Target extends f.ComponentScript {
    public static readonly iSubclass: number = f.Component.registerSubclass(Target);


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
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }
    private OnTriggerEnter = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.node.name == "Ball") {
        rgdbdyBall.setVelocity(f.Vector3.ZERO());
        LevelManager.level++;
        LevelManager.checkForNextLevel();
        LevelManager.loadNextLevel();
        OverlayCanvas.showDiv();
      }

    }
  }
}