

namespace MadMaze {

  class LocationBool {

    public isActive: boolean = false;
    public name: string = "";
    constructor(_isActive: boolean, _name: string) {
      this.isActive = _isActive;
      this.name = _name;
    }
  }


  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");
  f.Project.registerScriptNamespace(MadMaze);
  let viewport: f.Viewport;
  let madeMazeGraph: f.Graph;
  let rgdbdyBall: f.ComponentRigidbody;
  let cmpCamera: f.ComponentCamera;

  let startButton: HTMLElement = document.getElementById("accelButton");
  if (f.Project.mode != f.MODE.EDITOR) {
    startButton.addEventListener("click", getAccelPermission);
    startButton.addEventListener("click", init);
  }

  async function init() {
    await FudgeCore.Project.loadResources("Internal.json");
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
    cmpCamera = new FudgeCore.ComponentCamera();
    cmpCamera.mtxPivot.translateY(35);
    cmpCamera.mtxPivot.rotateX(90);
    let canvas = document.querySelector("canvas");
    viewport = new FudgeCore.Viewport();
    viewport.initialize("InteractiveViewport", madeMazeGraph, cmpCamera, canvas);
    //let ballManager: BallManager = new BallManager(rgdbdyBall);
    //ballManager.getAccelPermission();
    viewport.draw();
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

  let locationBooleans: LocationBool[] = new Array<LocationBool>();
  function getAccelPermission() {
    let device: string = getMobileOperatingSystem();
    console.log(device);
    switch (device) {
      case ("iOS"):
        (DeviceMotionEvent as any).requestPermission().then((response: string) => {
          if (response == 'granted') {
            console.log("Access acceleration: " + response);
            window.addEventListener('deviceorientation', deviceOrientation);
          } else {
            console.log("Access acceleration: " + response);
          }
        });
        break;
      case ("Android"):
        window.addEventListener("deviceorientation", deviceOrientation);
        break;
      case ("Windows Phone"):
        console.log("not implemented yet");
        break;
    }
    createButtons();
    createArray();
  }


  function createButtons(): void {
    document.body.removeChild(startButton);
    let refreshButt: HTMLElement = document.createElement("button");
    refreshButt.style.width = "100px";
    refreshButt.style.height = "75px";
    refreshButt.innerText = "REFRESH";
    refreshButt.style.fontSize = "15px";
    refreshButt.style.fontWeight = "bold";
    refreshButt.style.position = "absolute";
    refreshButt.style.top = "0%";
    refreshButt.style.right = "0%";
    document.body.appendChild(refreshButt);

    refreshButt.addEventListener("pointerdown", (event) => {
      console.log(event);
      window.location.reload();
    });

  }

  function createArray(): void {
    for (let i = 0; i < 7; i++) {
      switch (i) {
        case 0:
          locationBooleans.push(new LocationBool(false, "normal"));
          break;
        case 1: locationBooleans.push(new LocationBool(false, "rightSide"));
          break;
        case 2: locationBooleans.push(new LocationBool(false, "leftSide"));
          break;
        case 3: locationBooleans.push(new LocationBool(false, "setUpReversed"));
          break;
        case 4: locationBooleans.push(new LocationBool(false, "setUpNormal"));
          break;
        case 5: locationBooleans.push(new LocationBool(false, "overHead"));
          break;
        case 6: locationBooleans.push(new LocationBool(false, "overHeadReversed"));
          break;
      }
    }
  }

  let toleranceFactor: number = 25;


  let cameraRot: HTMLElement = document.getElementById("camera");
  let yAccelartion: HTMLElement = document.getElementById("BETTA");
  let zAccelartion: HTMLElement = document.getElementById("GAMMA");



  function deviceOrientation(event: DeviceOrientationEvent): void {
    applyForeAlongDirection(event);

    /* let cameraRot: HTMLElement = document.getElementById("camera");
    cameraRot.innerHTML = "camera_rot: " + (cmpCamera.mtxPivot.rotation).toString();
    //Camera Movements
    if (cmpCamera.mtxPivot.rotation.z > -0.667 && _event.gamma < 0)
      cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
    if (cmpCamera.mtxPivot.rotation.z < 0.667 && _event.gamma > 0)
      cmpCamera.mtxPivot.rotateY(_event.gamma / 250);
    if (cmpCamera.mtxPivot.rotation.x > 89.336 && _event.beta > 0)
      cmpCamera.mtxPivot.rotateX(-_event.beta / 250);
    if (cmpCamera.mtxPivot.rotation.x < 90.667 && _event.beta < 0)
      cmpCamera.mtxPivot.rotateX(-_event.beta / 250);*/
    checkForOrientation(event);
  }

  function applyForeAlongDirection(event: DeviceOrientationEvent): void {

    yAccelartion.innerHTML = "BETTA: " + event.beta.toString();
    zAccelartion.innerHTML = "GAMMA: " + event.gamma.toString();

    locationBooleans.forEach(location => {
      switch (location.name) {
        case ("normal"):
          if (location.isActive)
            rgdbdyBall.applyForce(new f.Vector3(-event.gamma, -5, -event.beta));
          break;

        case ("rightSide"):
          if (location.isActive) {
            if (Math.abs(event.beta) > 100) {
              cameraRot.innerHTML = "GIMBELLOCK RIGHT";
              rgdbdyBall.applyForce(new f.Vector3(event.gamma / 4, 750 / Math.abs(event.gamma), -event.beta / 15));
              return;
            }
            rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 4, event.gamma / 10, -event.beta));
          }
          break;

        case ("leftSide"):
          if (location.isActive) {
            if (Math.abs(event.beta) > 100) {
              cameraRot.innerHTML = "GIMBELLOCK LEFT";
              rgdbdyBall.applyForce(new f.Vector3(event.gamma / 4, 750 / Math.abs(event.gamma), -event.beta / 15));
              return;
            }
            rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 4, -event.gamma / 10, -event.beta));
          }
          break;

        case ("setUpReversed"):
          if (location.isActive) {
            if (event.beta > -90)
              rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 2, -event.beta / 8, -event.beta));
            else
              rgdbdyBall.applyForce(new f.Vector3(event.gamma / 2, -event.beta / 8, -event.beta));
          }
          break;

        case ("setUpNormal"):
          if (location.isActive) {
            if (event.beta < 90)
              rgdbdyBall.applyForce(new f.Vector3(-event.gamma / 2, event.beta / 8, -event.beta));
            else
              rgdbdyBall.applyForce(new f.Vector3(event.gamma / 2, event.beta / 8, -event.beta));
          }
          break;

        case ("overHead"):
          if (location.isActive)
            rgdbdyBall.applyForce(new f.Vector3(-event.gamma, event.beta / 5, event.beta));
          break;

        case ("overHeadReversed"):
          if (location.isActive)
            rgdbdyBall.applyForce(new f.Vector3(-event.gamma, -event.beta / 5, -event.beta));
          break;

      }
    });
  }

  function checkForOrientation(event: DeviceOrientationEvent): void {
    //normal
    if (event.beta - toleranceFactor < 20 && event.beta + toleranceFactor > 20 && event.gamma - toleranceFactor < 20 && event.gamma + toleranceFactor > 20) {
      for (let location of locationBooleans) {
        if (location.name == "normal") {
          cameraRot.innerHTML = "Handy: " + location.name;
          location.isActive = true;
        }
        else
          location.isActive = false;
      }
    }

    //rightside
    if (event.gamma - toleranceFactor < 90 && event.gamma + toleranceFactor > 90) {
      for (let location of locationBooleans) {
        if (location.name == "rightSide") {
          for (let location of locationBooleans) {
            if (location.name == "leftSide" && location.isActive)
              return;
          }
          cameraRot.innerHTML = "Handy: " + location.name;
          location.isActive = true;
        }
        else
          location.isActive = false;
      }
    }

    //leftside
    if (event.gamma - toleranceFactor < -90 && event.gamma + toleranceFactor > -90) {
      for (let location of locationBooleans) {
        if (location.name == "rightSide" && location.isActive) return;
        if (location.name == "leftSide") {
          cameraRot.innerHTML = "Handy: " + location.name;
          location.isActive = true;
        }
        else
          location.isActive = false;
      }
    }

    //setUpReversed
    if (event.beta - toleranceFactor < -90 && event.beta + toleranceFactor > -90) {
      for (let location of locationBooleans) {
        if (location.name == "setUpReversed") {
          cameraRot.innerHTML = "Handy: " + location.name;
          location.isActive = true;
        }
        else
          location.isActive = false;
      }
    }

    //setUpNormal
    if (event.beta - toleranceFactor < 90 && event.beta + toleranceFactor > 90) {
      for (let location of locationBooleans) {
        if (location.name == "setUpNormal") {
          cameraRot.innerHTML = "Handy: " + location.name;
          location.isActive = true;
        }
        else
          location.isActive = false;
      }
    }

    //overhead
    if (event.beta - toleranceFactor < 180 && event.beta + toleranceFactor > 180 && event.gamma - toleranceFactor < 0 && event.gamma + toleranceFactor > 0) {
      for (let location of locationBooleans) {
        if (location.name == "overHead") {
          cameraRot.innerHTML = "Handy: " + location.name;
          location.isActive = true;
          rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
        }
        else
          location.isActive = false;
      }
    }

    //overHeadReversed
    if (event.beta - toleranceFactor < -180 && event.beta + toleranceFactor > -180 && event.gamma - toleranceFactor < 0 && event.gamma + toleranceFactor > 0) {
      for (let location of locationBooleans) {
        if (location.name == "overHeadReversed") {
          cameraRot.innerHTML = "Handy: " + location.name;
          location.isActive = true;
          rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
        }
        else
          location.isActive = false;
      }
    }
  }
}
