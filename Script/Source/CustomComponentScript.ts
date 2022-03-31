namespace MadMaze {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(MadMaze);  // Register the namespace to FUDGE for serialization

  export class CustomComponentScript extends f.ComponentScript {
    public static readonly iSubclass: number = f.Component.registerSubclass(CustomComponentScript);
    private isCross: boolean;
    private verticalNeg: boolean = false;
    private verticalPos: boolean = false;
    private rndRotVel: number;
    private rndTransVel: number;
    private mySelf: f.Node;

    constructor() {
      super();

      if (f.Project.mode == f.MODE.EDITOR)
        return;

      this.mySelf = this.node;
      this.rndRotVel = this.randomRangeFromInterval(0.5, 2);
      this.rndTransVel = this.randomRangeFromInterval(0.0005, 0.001) * 0.01;

      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);

      switch (this.mySelf.name) {
        case "cross":
          this.isCross = true;
          break;
        case "vertical":
          this.isCross = false;
          break;
        default: break;
      }
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
        case f.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }
    private update = (): void => {
      if (this.isCross) {
        this.mySelf.getComponent(f.ComponentTransform).mtxLocal.rotateY(this.rndRotVel);
      } else {
        if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 1.74 && !this.verticalNeg) {
          this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translateZ(-this.rndTransVel);
          if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 1.75) {
            this.verticalNeg = true;
            this.verticalPos = false;
          }
        }
        else if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 2.8 && !this.verticalPos) {
          this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translateZ(+this.rndTransVel);
          if (this.mySelf.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 2.79) {
            this.verticalNeg = false;
            this.verticalPos = true;
          }
        }
      }
    }

    private randomRangeFromInterval(min: number, max: number) {
      return (Math.random() * (max - min + 1) + min)
    }
  }
}