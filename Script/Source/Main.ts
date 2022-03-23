namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let madeMazeGraph: f.Graph;
  let rgdbdyBall: f.ComponentRigidbody;
  let cmpCamera: f.ComponentCamera;
  let accelButt: HTMLElement = document.getElementById("accelButton");
  let cmpTrigger: f.ComponentRigidbody;
  accelButt.addEventListener("click", getAccelPermission);
  document.getElementById("accelButton").addEventListener("click", init);

  async function init() {
    document.addEventListener("interactiveViewportStarted", <EventListener>start);

    await FudgeCore.Project.loadResourcesFromHTML();
    FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
    madeMazeGraph = <f.Graph>(
      f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]
    );
    cmpTrigger = madeMazeGraph.getChild(madeMazeGraph.nChildren - 1).getChild(0).getComponent(f.ComponentRigidbody);
    cmpTrigger.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, hndTrigger);

    rgdbdyBall = madeMazeGraph.getChild(0).getComponent(f.ComponentRigidbody);
    FudgeCore.Debug.log("Graph:", madeMazeGraph);
    if (!madeMazeGraph) {
      alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
      return;
    }
    // setup the viewport
    cmpCamera = new FudgeCore.ComponentCamera();
    cmpCamera.mtxPivot.translateY(18.5);
    cmpCamera.mtxPivot.rotateX(90);
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
  function getAccelPermission() {
    accelButt.style.visibility = 'hidden';
    let divPanel: HTMLElement = document.getElementById("controlPanel");
    let upSideDownBut: HTMLElement = document.createElement("button");
    upSideDownBut.style.width = "200px";
    upSideDownBut.style.height = "50px";
    upSideDownBut.innerText = "UPSIDE DOWN";
    let refreshButt: HTMLElement = document.createElement("button");
    refreshButt.style.width = "200px";
    refreshButt.style.height = "50px";
    refreshButt.innerText = "REFRESH GAME";
    divPanel.appendChild(upSideDownBut);
    divPanel.appendChild(refreshButt);

    upSideDownBut.addEventListener("click", changeUpSideDown);
    refreshButt.addEventListener("click", (event) => {
      console.log(event);
      window.location.reload();
    });
    let _iOSDevice: boolean = !!navigator.platform.match(/iPhone|iPod|iPad/);
    if (_iOSDevice)
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response == 'granted') {
          console.log("Access acceleration: " + response);
          window.addEventListener('deviceorientation', deviceMotion)
        } else {
          console.log("Access acceleration: " + response);
        }
      });

  }



  function deviceMotion(_event: DeviceOrientationEvent): void {
    let xAccelartion: HTMLElement = document.getElementById("x");
    let yAccelartion: HTMLElement = document.getElementById("y");
    let zAccelartion: HTMLElement = document.getElementById("z");
    let cameraRot: HTMLElement = document.getElementById("camera");
    let oldYAcceleration: number = 0;

    xAccelartion.innerHTML = "X: " + (_event.gamma).toString();
    yAccelartion.innerHTML = "Y: " + (_event.alpha).toString();
    zAccelartion.innerHTML = "Z: " + (_event.beta).toString();
    cameraRot.innerHTML = "camera_rot: " + (cmpCamera.mtxPivot.rotation).toString();
    if (!upSideDownBool) {
      rgdbdyBall.applyForce(new f.Vector3(-_event.gamma, 0, -_event.beta));
      oldYAcceleration = _event.alpha;
      if (cmpCamera.mtxPivot.rotation.z > -.5 && _event.gamma < 0)
        cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
      if (cmpCamera.mtxPivot.rotation.z < .5 && _event.gamma > 0)
        cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
      if (cmpCamera.mtxPivot.rotation.x > 89.5 && _event.beta > 0)
        cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
      if (cmpCamera.mtxPivot.rotation.x < 90.5 && _event.beta < 0)
        cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
    }
    if (upSideDownBool)
      if (Math.abs(_event.alpha - oldYAcceleration) > 20)
        rgdbdyBall.applyForce(new f.Vector3(0, _event.alpha, 0));
  }

  function changeUpSideDown() {
    if (!upSideDownBool)
      upSideDownBool = true;
    else
      upSideDownBool = false;
  }
  function hndTrigger(_event: f.EventPhysics): void {
    if (_event.cmpRigidbody.node.name == "Ball") {
      document.write("YOU HAVE WONE THE GAME");

    }
  }

}