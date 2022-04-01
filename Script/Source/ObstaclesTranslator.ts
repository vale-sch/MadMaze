namespace MadMaze {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(MadMaze);  // Register the namespace to FUDGE for serialization

  export class ObstaclesTranslator extends f.ComponentScript {
    public static readonly iSubclass: number = f.Component.registerSubclass(ObstaclesTranslator);
    private isCross: boolean;
    private verticalNeg: boolean = false;
    private verticalPos: boolean = false;
    private rndRotVel: number;
    private rndTransVel: number;


    constructor() {
      super();
      if (f.Project.mode == f.MODE.EDITOR)
        return;
      this.rndRotVel = randomRangeFromInterval(0.5, 2);
      this.rndTransVel = randomRangeFromInterval(0.0005, 0.001) * 0.01;

      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);

    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case f.EVENT.COMPONENT_ADD:
          f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
          switch (this.node.name) {
            case "cross":
              this.isCross = true;
              break;
            case "vertical":
              this.isCross = false;
              break;
            default: break;
          }
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }
    private update = (): void => {
      if (this.isCross) {
        this.node.getComponent(f.ComponentTransform).mtxLocal.rotateY(this.rndRotVel);
      } else {
        if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 1.74 && !this.verticalNeg) {
          this.node.getComponent(f.ComponentTransform).mtxLocal.translateZ(-this.rndTransVel);
          if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 1.75) {
            this.verticalNeg = true;
            this.verticalPos = false;
          }
        }
        else if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x <= 2.8 && !this.verticalPos) {
          this.node.getComponent(f.ComponentTransform).mtxLocal.translateZ(+this.rndTransVel);
          if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x >= 2.79) {
            this.verticalNeg = false;
            this.verticalPos = true;
          }
        }
      }
    }
  }

  function randomRangeFromInterval(min: number, max: number) {
    return (Math.random() * (max - min + 1) + min)
  }
}