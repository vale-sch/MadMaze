

namespace MadMaze {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");
  f.Project.registerScriptNamespace(MadMaze);
  let viewport: f.Viewport;
  export let madeMazeGraph: f.Graph;
  export let rgdbdyBall: f.ComponentRigidbody;
  export let cmpCamera: f.ComponentCamera;
  export let cameraParent: f.Node;
  let startButton: HTMLElement = document.getElementById("startButton");
  if (f.Project.mode != f.MODE.EDITOR)
    window.addEventListener("load", init);


  async function init() {
    await FudgeCore.Project.loadResources("Internal.json");
    FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
    madeMazeGraph = <f.Graph>(
      f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]
    );

    FudgeCore.Debug.log("Graph:", madeMazeGraph);
    if (!madeMazeGraph) {
      alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
      return;
    }
    rgdbdyBall = madeMazeGraph.getChildrenByName("Ball")[0].getComponent(f.ComponentRigidbody);
    new LevelManager()
    LevelManager.initilizeScene();
    // setup the viewport
    cameraParent = madeMazeGraph.getChildrenByName("Camera")[0];
    cmpCamera = cameraParent.getChild(0).getComponent(f.ComponentCamera);
    let canvas = document.querySelector("canvas");
    viewport = new FudgeCore.Viewport();
    viewport.initialize("InteractiveViewport", madeMazeGraph, cmpCamera, canvas);

    let deviceManager: DeviceManager = new DeviceManager(startButton, new BallManager(rgdbdyBall));
    if (f.Project.mode != f.MODE.EDITOR)
      startButton.addEventListener("click", deviceManager.getAccelPermission);




    viewport.draw();
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();
  }

  function update(_event: Event): void {
    f.Physics.simulate();
    viewport.draw();
  }

}
