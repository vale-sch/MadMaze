namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let madeMazeGraph: f.Graph;
  let rgdbdyBall: f.ComponentRigidbody;

  let accelButt: HTMLElement = document.getElementById("accelButton");
  accelButt.addEventListener("click", getAccel);
  document.getElementById("accelButton").addEventListener("click", init);

  async function init() {
    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    await FudgeCore.Project.loadResourcesFromHTML();
    FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
    madeMazeGraph = <f.Graph>(
      f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]
    );
    rgdbdyBall = madeMazeGraph.getChild(0).getComponent(f.ComponentRigidbody);
    FudgeCore.Debug.log("Graph:", madeMazeGraph);
    if (!madeMazeGraph) {
      alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
      return;
    }
    // setup the viewport
    let cmpCamera = new FudgeCore.ComponentCamera();
    cmpCamera.mtxPivot.translateY(80);
    cmpCamera.mtxPivot.translateX(5);
    cmpCamera.mtxPivot.rotateX(90);
    cmpCamera.mtxPivot.rotateZ(90);
    let canvas = document.querySelector("canvas");
    let viewport = new FudgeCore.Viewport();
    viewport.initialize("InteractiveViewport", madeMazeGraph, cmpCamera, canvas);
    FudgeCore.Debug.log("Viewport:", viewport);
    canvas.addEventListener("mousedown", canvas.requestPointerLock);
    canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
    FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);
    viewport.draw();
    canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));

  } (document.head.querySelector("meta[autoView]").getAttribute("autoView"));

  function start(_event: CustomEvent): void {
    viewport = _event.detail;



    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();
  }
  function update(_event: Event): void {
    f.Physics.simulate();
    viewport.draw();

  }
  let upSideDownBool: boolean = false;
  function getAccel() {
    accelButt.style.visibility = 'hidden';
    let divPanel: HTMLElement = document.getElementById("controlPanel");
    let upSideDownBut: HTMLElement = document.createElement("button");
    upSideDownBut.style.width = "200px";
    upSideDownBut.style.height = "50px";
    divPanel.appendChild(upSideDownBut);
    upSideDownBut.innerText = "UPSIDE DOWN";
    upSideDownBut.addEventListener("click", changeUpSideDown);

    let _iOSDevice: boolean = !!navigator.platform.match(/iPhone|iPod|iPad/);
    let xAccelartion: HTMLElement = document.getElementById("x");
    let yAccelartion: HTMLElement = document.getElementById("y");
    let zAccelartion: HTMLElement = document.getElementById("z");
    let oldYAcceleration: number = 0;
    if (_iOSDevice)
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response == 'granted') {
          console.log("Access acceleration: " + response);
          window.addEventListener('deviceorientation', (event) => {
            xAccelartion.innerHTML = "X: " + (event.gamma).toString();
            yAccelartion.innerHTML = "Y: " + (event.alpha).toString();
            zAccelartion.innerHTML = "Z: " + (event.beta).toString();
            if (!upSideDownBool) {
              rgdbdyBall.applyForce(new f.Vector3(-event.gamma, 0, -event.beta));
              oldYAcceleration = event.alpha;

            }
            if (upSideDownBool)
              if (Math.abs(event.alpha - oldYAcceleration) > 20)
                rgdbdyBall.applyForce(new f.Vector3(0, event.alpha, 0));
          });
        } else {
          console.log("Access acceleration: " + response);
        }
      });

  }
  function changeUpSideDown() {
    if (!upSideDownBool)
      upSideDownBool = true;
    else
      upSideDownBool = false;
  }

}