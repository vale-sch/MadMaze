namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let madeMazeGraph: f.Graph;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  window.addEventListener("load", init);
  async function init() {

    // load resources referenced in the link-tag
    await FudgeCore.Project.loadResourcesFromHTML();
    FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
    // pick the graph to show
    madeMazeGraph = <f.Graph>(
      f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]
    );
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
    // hide the cursor when interacting, also suppressing right-click menu
    canvas.addEventListener("mousedown", canvas.requestPointerLock);
    canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
    // make the camera interactive (complex method in FudgeAid)
    // setup audio
    // let cmpListener = new f.ComponentAudioListener();
    // cmpCamera.node.addComponent(cmpListener);
    //FudgeCore.AudioManager.default.listenWith(cmpListener);
    // FudgeCore.AudioManager.default.listenTo(graph);
    FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);
    // draw viewport once for immediate feedback
    viewport.draw();
    canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));

  } (document.head.querySelector("meta[autoView]").getAttribute("autoView"));

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let rgdbdyBall: f.ComponentRigidbody = madeMazeGraph.getChild(0).getComponent(f.ComponentRigidbody);
    getAccel(rgdbdyBall);
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    f.Physics.simulate();  // if physics is included and used
    viewport.draw();
    //f.AudioManager.default.update();
  }
  function getAccel(rgdbdyBall: f.ComponentRigidbody) {
    let _iOSDevice: boolean = !!navigator.platform.match(/iPhone|iPod|iPad/);
    let xAccelartion: HTMLElement = document.getElementById("x");
    let yAccelartion: HTMLElement = document.getElementById("y");
    let zAccelartion: HTMLElement = document.getElementById("z");
    if (_iOSDevice)
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response == 'granted') {
          // Add a listener to get smartphone orientation 
          // in the alpha-beta-gamma axes (units in degrees)
          window.addEventListener('deviceorientation', (event) => {
            // Expose each orientation angle in a more readable way

            xAccelartion.innerHTML = "X: " + (-event.gamma).toString();
            yAccelartion.innerHTML = "Y: " + (-event.alpha).toString();
            zAccelartion.innerHTML = "Z: " + (-event.beta).toString();

            rgdbdyBall.applyForce(new f.Vector3(-event.gamma, event.alpha / 10, -event.beta));
            //let rotation_degrees: number = event.alpha;
            //let frontToBack_degrees: number = event.beta;
            //let leftToRight_degrees: number = event.gamma;
            // document.writeln(frontToBack_degrees.toString());
            // document.writeln(leftToRight_degrees.toString());
            // Update velocity according to how tilted the phone is
            // Since phones are narrower than they are long, double the increase to the x velocity



          });
        }
      });
  }
}