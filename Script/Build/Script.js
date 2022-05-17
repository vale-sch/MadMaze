"use strict";
var f = FudgeCore;
var MadMaze;
(function (MadMaze) {
    MadMaze.orientations = new Array();
    MadMaze.spawnPoint = f.Vector3.ZERO();
    class BallManager {
        rgdbdyBall;
        alignment;
        constructor(_rgdBdy) {
            this.rgdbdyBall = _rgdBdy;
            //this.rgdbdyBall.mass = 5;
            this.alignment = document.getElementById("alignment");
            this.alignment.style.fontSize = "48px";
            this.alignment.style.fontWeight = "bold";
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            f.Loop.start();
        }
        update = (_event) => {
            if (this.rgdbdyBall.getPosition().y < -1) {
                this.rgdbdyBall.setPosition(MadMaze.spawnPoint);
                this.rgdbdyBall.setVelocity(f.Vector3.ZERO());
                MadMaze.madeMazeGraph.getChildren().forEach(child => {
                    child.getChildren().forEach(childOfChild => {
                        childOfChild.getChildren().forEach(childOfChildofChild => {
                            if (!childOfChildofChild.isActive && childOfChildofChild.name == "stopperMesh") {
                                childOfChildofChild.activate(true);
                                if (childOfChildofChild.getComponent(f.ComponentRigidbody))
                                    childOfChildofChild.getComponent(f.ComponentRigidbody).activate(true);
                            }
                        });
                    });
                });
            }
        };
        gamma = 0;
        beta = 0;
        speed = 0.5;
        applyForceAlongDirection = (event) => {
            this.gamma = event.gamma * this.speed;
            this.beta = event.beta * this.speed;
            MadMaze.orientations.forEach(location => {
                switch (location.alignment) {
                    case (MadMaze.Alignment.NORMAL):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -5, -this.beta));
                        break;
                    case (MadMaze.Alignment.RIGHTSIDE):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, this.gamma / 10, -this.beta));
                        }
                        break;
                    case (MadMaze.Alignment.LEFTSIDE):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, -this.gamma / 10, -this.beta));
                        }
                        break;
                    case (MadMaze.Alignment.SETUPREVERSED):
                        if (location.isActive) {
                            if (event.beta > -90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -this.beta / 2, -this.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma, -this.beta / 2, -this.beta));
                        }
                        break;
                    case (MadMaze.Alignment.SETUPNORMAL):
                        if (location.isActive) {
                            if (event.beta < 90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 2, this.beta / 2, -this.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 2, this.beta / 2, -this.beta));
                        }
                        break;
                    case (MadMaze.Alignment.OVERHEAD):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, this.beta / 5, this.beta));
                        break;
                    case (MadMaze.Alignment.OVERHEADREVERSED):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -this.beta / 5, -this.beta));
                        break;
                }
            });
        };
    }
    MadMaze.BallManager = BallManager;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    class CameraFollow {
        cameraParent;
        cmpCamera;
        ballNode;
        delayCameraTransX = new f.Control("delayCameraX", 1, 0 /* PROPORTIONAL */);
        delayCameraTransZ = new f.Control("delayCameraZ", 1, 0 /* PROPORTIONAL */);
        delayCameraRotX = new f.Control("delayRotX", 1, 0 /* PROPORTIONAL */);
        delayCameraRotZ = new f.Control("delayRotZ", 1, 0 /* PROPORTIONAL */);
        constructor(_cmpCamera, _cameraParent, _ballNode) {
            this.cameraParent = _cameraParent;
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            this.delayCameraTransX.setDelay(350);
            this.delayCameraTransZ.setDelay(350);
            this.delayCameraRotX.setDelay(500);
            this.delayCameraRotZ.setDelay(500);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            f.Loop.start();
        }
        update = (_event) => {
            MadMaze.orientations.forEach(orientation => {
                switch (orientation.alignment) {
                    case (MadMaze.Alignment.NORMAL):
                        if (orientation.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z - 5);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(50);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);
                        }
                        break;
                    case (MadMaze.Alignment.LEFTSIDE):
                        if (orientation.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x - 8);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(25);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());
                        }
                        break;
                    case (MadMaze.Alignment.RIGHTSIDE):
                        if (orientation.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x + 8);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(-25);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());
                        }
                        break;
                    case (MadMaze.Alignment.SETUPREVERSED):
                        if (orientation.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z - 10);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(65);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);
                        }
                        break;
                    case (MadMaze.Alignment.SETUPNORMAL):
                        if (orientation.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z + 10);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(115);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);
                        }
                        break;
                    case (MadMaze.Alignment.OVERHEAD):
                        if (orientation.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);
                        }
                        break;
                    case (MadMaze.Alignment.OVERHEADREVERSED):
                        if (orientation.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);
                        }
                        break;
                }
            });
        };
    }
    MadMaze.CameraFollow = CameraFollow;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class Checkpoint extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(Checkpoint);
        constructor() {
            super();
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.node.getComponent(f.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.OnTriggerEnter);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        OnTriggerEnter = (_event) => {
            if (_event.cmpRigidbody.node.name == "Ball") {
                MadMaze.spawnPoint = this.node.mtxWorld.translation;
                this.node.activate(false);
                this.node.getComponent(f.ComponentRigidbody).activate(false);
            }
        };
    }
    MadMaze.Checkpoint = Checkpoint;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    class DeviceManager {
        startButton;
        ballManager;
        toleranceFactor = 30;
        alignment;
        constructor(_startButton, _ballManager) {
            this.ballManager = _ballManager;
            this.startButton = _startButton;
            this.alignment = document.getElementById("alignment");
            this.alignment.style.fontSize = "48px";
            this.alignment.style.fontWeight = "bold";
        }
        getAccelPermission = () => {
            let device = this.getMobileOperatingSystem();
            console.log(device);
            switch (device) {
                case ("iOS"):
                    DeviceMotionEvent.requestPermission().then((response) => {
                        if (response == 'granted') {
                            console.log("Access acceleration: " + response);
                            window.addEventListener('deviceorientation', this.deviceOrientationDistributor);
                        }
                        else {
                            console.log("Access acceleration: " + response);
                        }
                    });
                    break;
                case ("Android"):
                    window.addEventListener("deviceorientation", this.deviceOrientationDistributor);
                    console.log("GRANTED");
                    break;
                case ("Windows Phone"):
                    console.log("not implemented yet");
                    break;
            }
            this.createButtons();
            this.createArray();
        };
        getMobileOperatingSystem = () => {
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
        };
        createButtons() {
            document.body.removeChild(this.startButton);
            let refreshButt = document.createElement("button");
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
        createArray() {
            for (let i = 0; i < 7; i++) {
                switch (i) {
                    case 0:
                        MadMaze.orientations.push(new MadMaze.Orientation(false, MadMaze.Alignment.NORMAL));
                        break;
                    case 1:
                        MadMaze.orientations.push(new MadMaze.Orientation(false, MadMaze.Alignment.RIGHTSIDE));
                        break;
                    case 2:
                        MadMaze.orientations.push(new MadMaze.Orientation(false, MadMaze.Alignment.LEFTSIDE));
                        break;
                    case 3:
                        MadMaze.orientations.push(new MadMaze.Orientation(false, MadMaze.Alignment.SETUPREVERSED));
                        break;
                    case 4:
                        MadMaze.orientations.push(new MadMaze.Orientation(false, MadMaze.Alignment.SETUPNORMAL));
                        break;
                    case 5:
                        MadMaze.orientations.push(new MadMaze.Orientation(false, MadMaze.Alignment.OVERHEAD));
                        break;
                    case 6:
                        MadMaze.orientations.push(new MadMaze.Orientation(false, MadMaze.Alignment.OVERHEADREVERSED));
                        break;
                }
            }
        }
        deviceOrientationDistributor = (event) => {
            this.ballManager.applyForceAlongDirection(event);
            this.checkForOrientation(event);
        };
        checkForOrientation = (event) => {
            //normal
            if (event.beta - this.toleranceFactor < 20 && event.beta + this.toleranceFactor > 20 && event.gamma - this.toleranceFactor < 20 && event.gamma + this.toleranceFactor > 20) {
                for (let orientation of MadMaze.orientations) {
                    if (orientation.alignment == MadMaze.Alignment.NORMAL) {
                        this.alignment.innerHTML = "Alignment: " + orientation.alignment;
                        orientation.isActive = true;
                    }
                    else
                        orientation.isActive = false;
                }
            }
            //rightside
            if (event.gamma - this.toleranceFactor < 90 && event.gamma + this.toleranceFactor > 90) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.RIGHTSIDE) {
                        for (let location of MadMaze.orientations) {
                            if (location.alignment == MadMaze.Alignment.LEFTSIDE && location.isActive)
                                return;
                        }
                        this.alignment.innerHTML = "Alignment: " + location.alignment;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //leftside
            if (event.gamma - this.toleranceFactor < -90 && event.gamma + this.toleranceFactor > -90) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.RIGHTSIDE && location.isActive)
                        return;
                    if (location.alignment == MadMaze.Alignment.LEFTSIDE) {
                        this.alignment.innerHTML = "Alignment: " + location.alignment;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //setUpReversed
            if (event.beta - this.toleranceFactor < -90 && event.beta + this.toleranceFactor > -90) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.SETUPREVERSED) {
                        this.alignment.innerHTML = "Alignment: " + location.alignment;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //setUpNormal
            if (event.beta - this.toleranceFactor < 90 && event.beta + this.toleranceFactor > 90) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.SETUPNORMAL) {
                        this.alignment.innerHTML = "Alignment: " + location.alignment;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //overhead
            if (event.beta - this.toleranceFactor < 180 && event.beta + this.toleranceFactor > 180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.OVERHEAD) {
                        this.alignment.innerHTML = "Alignment: " + location.alignment;
                        location.isActive = true;
                        //this.rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                    }
                    else
                        location.isActive = false;
                }
            }
            //overHeadReversed
            if (event.beta - this.toleranceFactor < -180 && event.beta + this.toleranceFactor > -180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.OVERHEADREVERSED) {
                        this.alignment.innerHTML = "Alignment: " + location.alignment;
                        location.isActive = true;
                        // this.rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                    }
                    else
                        location.isActive = false;
                }
            }
        };
    }
    MadMaze.DeviceManager = DeviceManager;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    let LevelGraph;
    (function (LevelGraph) {
        LevelGraph["LEVEL1"] = "Level1";
        LevelGraph["LEVEL2"] = "Level2";
        LevelGraph["LEVEL3"] = "Level3";
    })(LevelGraph = MadMaze.LevelGraph || (MadMaze.LevelGraph = {}));
    class LevelManager {
        static level = 0;
        static levelGraph;
        constructor(_level, _levelGraph) {
            LevelManager.level = _level;
            LevelManager.levelGraph = _levelGraph;
        }
    }
    MadMaze.LevelManager = LevelManager;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    f.Project.registerScriptNamespace(MadMaze);
    let viewport;
    let startButton = document.getElementById("accelButton");
    if (f.Project.mode != f.MODE.EDITOR)
        window.addEventListener("load", init);
    async function init() {
        await FudgeCore.Project.loadResources("Internal.json");
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        MadMaze.madeMazeGraph = (f.Project.resources["Graph|2022-03-16T16:05:06.910Z|36331"]);
        FudgeCore.Debug.log("Graph:", MadMaze.madeMazeGraph);
        if (!MadMaze.madeMazeGraph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        MadMaze.cameraParent = MadMaze.madeMazeGraph.getChildrenByName("Camera")[0];
        MadMaze.cmpCamera = MadMaze.cameraParent.getChild(0).getComponent(f.ComponentCamera);
        let canvas = document.querySelector("canvas");
        viewport = new FudgeCore.Viewport();
        viewport.initialize("InteractiveViewport", MadMaze.madeMazeGraph, MadMaze.cmpCamera, canvas);
        MadMaze.rgdbdyBall = MadMaze.madeMazeGraph.getChildrenByName("Ball")[0].getComponent(f.ComponentRigidbody);
        let deviceManager = new MadMaze.DeviceManager(startButton, new MadMaze.BallManager(MadMaze.rgdbdyBall));
        if (f.Project.mode != f.MODE.EDITOR)
            startButton.addEventListener("click", deviceManager.getAccelPermission);
        new MadMaze.CameraFollow(MadMaze.cmpCamera.node, MadMaze.cameraParent, MadMaze.rgdbdyBall.node);
        new MadMaze.LevelManager(1, MadMaze.LevelGraph.LEVEL1);
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start();
    }
    function update(_event) {
        f.Physics.simulate();
        viewport.draw();
    }
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class ObstaclesTranslator extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(ObstaclesTranslator);
        constructor() {
            super();
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        update = () => {
        };
    }
    MadMaze.ObstaclesTranslator = ObstaclesTranslator;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class OnTriggerStop extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(OnTriggerStop);
        constructor() {
            super();
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.node.getComponent(f.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.OnTriggerEnter);
                    this.node.getComponent(f.ComponentRigidbody).addEventListener("TriggerLeftCollision" /* TRIGGER_EXIT */, this.OnTriggerExit);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        OnTriggerEnter = (_event) => {
            if (_event.cmpRigidbody.node.name == "Ball") {
                MadMaze.rgdbdyBall.setVelocity(f.Vector3.ZERO());
            }
        };
        OnTriggerExit = (_event) => {
            if (_event.cmpRigidbody.node.name == "Ball") {
                MadMaze.rgdbdyBall.setVelocity(f.Vector3.ZERO());
                this.node.activate(false);
                this.node.getComponent(f.ComponentRigidbody).activate(false);
            }
        };
    }
    MadMaze.OnTriggerStop = OnTriggerStop;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    //@ts-ignore
    let Alignment;
    (function (Alignment) {
        Alignment["NORMAL"] = "NORMAL";
        Alignment["RIGHTSIDE"] = "RIGHTSIDE";
        Alignment["LEFTSIDE"] = "LEFTSIDE";
        Alignment["SETUPREVERSED"] = "SETUPREVERSED";
        Alignment["SETUPNORMAL"] = "SETUPNORMAL";
        Alignment["OVERHEAD"] = "OVERHEAD";
        Alignment["OVERHEADREVERSED"] = "OVERHEADREVERSED";
    })(Alignment = MadMaze.Alignment || (MadMaze.Alignment = {}));
    class Orientation {
        isActive = false;
        alignment;
        constructor(_isActive, _alignment) {
            this.isActive = _isActive;
            this.alignment = _alignment;
        }
    }
    MadMaze.Orientation = Orientation;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class Target extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(Target);
        constructor() {
            super();
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    this.node.getComponent(f.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.triggerEnter);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        triggerEnter = (_event) => {
            if (_event.cmpRigidbody.node.name == "Ball") {
                this.node.getParent().getComponent(f.ComponentRigidbody).activate(false);
            }
        };
        update = () => {
        };
    }
    MadMaze.Target = Target;
})(MadMaze || (MadMaze = {}));
//# sourceMappingURL=Script.js.map