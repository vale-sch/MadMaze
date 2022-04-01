namespace MadMaze {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");
  f.Project.registerScriptNamespace(MadMaze);
  let viewport: f.Viewport;
  let madeMazeGraph: f.Graph;
  let rgdbdyBall: f.ComponentRigidbody;
  let cmpCamera: f.ComponentCamera;

  let winTrigger: f.ComponentRigidbody;
  let accelButt: HTMLElement = document.getElementById("accelButton");
  if (f.Project.mode != f.MODE.EDITOR) {

    accelButt.addEventListener("click", getAccelPermission);
    accelButt.addEventListener("click", init);
  }





  async function init() {
    await FudgeCore.Project.loadResources("Internal.json");
    FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
    madeMazeGraph = <f.Graph>(
      f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]
    );

    winTrigger = madeMazeGraph.getChild(madeMazeGraph.nChildren - 1).getChild(0).getComponent(f.ComponentRigidbody);
    winTrigger.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerWin);

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
    viewport = new FudgeCore.Viewport();
    viewport.initialize("InteractiveViewport", madeMazeGraph, cmpCamera, canvas);

    viewport.draw();

    let crosses: f.Node[] = madeMazeGraph.getChild(2).getChild(1).getChildren();
    crosses.forEach(cross => {
      cross.addComponent(new ObstaclesTranslator());

    });
    let verticals: f.Node[] = madeMazeGraph.getChild(2).getChild(2).getChildren();
    verticals.forEach(vertical => {
      vertical.addComponent(new ObstaclesTranslator());

    });
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();
  }








  function update(_event: Event): void {
    f.Physics.simulate();
    viewport.draw();
  }




  function getMobileOperatingSystem(): string {
    var userAgent = navigator.userAgent || navigator.vendor;
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
      return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    }
    return "unknown";
  }



  let upSideDownBool: boolean = false;
  function getAccelPermission() {

    let device: string = getMobileOperatingSystem();
    console.log(device);
    switch (device) {
      case ("iOS"):
        (DeviceMotionEvent as any).requestPermission().then((response: string) => {
          if (response == 'granted') {
            console.log("Access acceleration: " + response);
            window.addEventListener('deviceorientation', deviceMotion, true);
          } else {
            console.log("Access acceleration: " + response);
          }
        });
        break;
      case ("Android"):
        window.addEventListener("deviceorientation", deviceMotion, true);

        break;
      case ("Windows Phone"):
        console.log("not implemented yet");
        break;
    }
    createButtons();
  }



  let upSideDownButBool: boolean;
  function createButtons(): void {
    document.body.removeChild(accelButt);
    let divPanel: HTMLElement = document.getElementById("controlPanel");

    let upSideDownBut: HTMLElement = document.createElement("button");
    upSideDownBut.style.width = "400px";
    upSideDownBut.style.height = "100px";
    upSideDownBut.innerText = "UPSIDE DOWN";
    upSideDownBut.style.fontSize = "40px";
    upSideDownBut.style.fontWeight = "bold";
    upSideDownBut.style.backgroundColor = 'salmon';
    upSideDownBut.style.color = 'white';
    let refreshButt: HTMLElement = document.createElement("button");
    refreshButt.style.width = "100px";
    refreshButt.style.height = "75px";
    refreshButt.innerText = "REFRESH";
    refreshButt.style.fontSize = "15px";
    refreshButt.style.fontWeight = "bold";
    refreshButt.style.position = "absolute";
    refreshButt.style.top = "0%";
    refreshButt.style.right = "0%";
    divPanel.appendChild(upSideDownBut);
    document.body.appendChild(refreshButt);


    upSideDownBut.addEventListener("pointerdown", changeUpSideDown);
    upSideDownBut.addEventListener('click', function onClick() {
      if (!upSideDownButBool) {
        upSideDownBut.style.backgroundColor = 'green';
        upSideDownBut.style.color = 'white';
        upSideDownButBool = true;
      } else {
        upSideDownBut.style.backgroundColor = 'salmon';
        upSideDownBut.style.color = 'white';
        upSideDownButBool = false;
      }

    });

    refreshButt.addEventListener("pointerdown", (event) => {
      console.log(event);
      window.location.reload();
    });
  }



  let oldYAcceleration: number = 0;
  function deviceMotion(_event: DeviceOrientationEvent): void {

    //Debug Elements
    /*let xAccelartion: HTMLElement = document.getElementById("x");
    let yAccelartion: HTMLElement = document.getElementById("y");
    let zAccelartion: HTMLElement = document.getElementById("z");
    let cameraRot: HTMLElement = document.getElementById("camera");
    xAccelartion.innerHTML = "X: " + (_event.gamma).toString();
    yAccelartion.innerHTML = "Y: " + (_event.alpha).toString();
    zAccelartion.innerHTML = "Z: " + (_event.beta).toString();
    cameraRot.innerHTML = "camera_rot: " + (cmpCamera.mtxPivot.rotation).toString();*/

    if (cmpCamera.mtxPivot.rotation.z > -0.667 && _event.gamma < 0)
      cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
    if (cmpCamera.mtxPivot.rotation.z < 0.667 && _event.gamma > 0)
      cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
    if (cmpCamera.mtxPivot.rotation.x > 89.336 && _event.beta > 0)
      cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
    if (cmpCamera.mtxPivot.rotation.x < 90.667 && _event.beta < 0)
      cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
    if (!upSideDownBool) {
      rgdbdyBall.applyForce(new f.Vector3(-_event.gamma, 0, -_event.beta));
      oldYAcceleration = _event.beta;

    }
    if (upSideDownBool)
      if (Math.abs(_event.beta - oldYAcceleration) > 10)
        rgdbdyBall.applyForce(new f.Vector3(0, _event.beta, 0));
      else
        rgdbdyBall.applyForce(new f.Vector3(0, -50, 0));

  }


  function changeUpSideDown() {
    if (!upSideDownBool)
      upSideDownBool = true;
    else
      upSideDownBool = false;
  }


  function hndTriggerWin(_event: f.EventPhysics): void {
    if (_event.cmpRigidbody.node.name == "Ball") {
      alert("You have won the game!");
    }
  }
}