namespace MadMaze {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(MadMaze);  // Register the namespace to FUDGE for serialization

  export class ObstaclesTranslator extends f.ComponentScript {
    public static readonly iSubclass: number = f.Component.registerSubclass(ObstaclesTranslator);
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

          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }
    private update = (): void => {

    }
  }
}