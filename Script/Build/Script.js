"use strict";
var f = FudgeCore;
var MadMaze;
(function (MadMaze) {
    MadMaze.locationBooleans = new Array();
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
                            if (!childOfChildofChild.isActive) {
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
            MadMaze.locationBooleans.forEach(location => {
                switch (location.name) {
                    case ("normal"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -5, -this.beta));
                        break;
                    case ("rightSide"):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, this.gamma / 10, -this.beta));
                        }
                        break;
                    case ("leftSide"):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, -this.gamma / 10, -this.beta));
                        }
                        break;
                    case ("setUpReversed"):
                        if (location.isActive) {
                            if (event.beta > -90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -this.beta / 2, -this.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma, -this.beta / 2, -this.beta));
                        }
                        break;
                    case ("setUpNormal"):
                        if (location.isActive) {
                            if (event.beta < 90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 2, this.beta / 2, -this.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 2, this.beta / 2, -this.beta));
                        }
                        break;
                    case ("overHead"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, this.beta / 5, this.beta));
                        break;
                    case ("overHeadReversed"):
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
            MadMaze.locationBooleans.forEach(location => {
                switch (location.name) {
                    case ("normal"):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z - 5);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(50);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());
                        }
                        break;
                    case ("leftSide"):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x - 8);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotZ.setInput(25);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(90, 0, this.delayCameraRotZ.getOutput());
                        }
                        break;
                    case ("rightSide"):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x + 8);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotZ.setInput(-25);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(90, 0, this.delayCameraRotZ.getOutput());
                        }
                        break;
                    case ("setUpReversed"):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z - 10);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(65);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraTransZ.getOutput());
                        }
                        break;
                    case ("setUpNormal"):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z + 10);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(115);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraTransZ.getOutput());
                        }
                        break;
                    case ("overHead"):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());
                        }
                        break;
                    case ("overHeadReversed"):
                        if (location.isActive) {
                            this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                            this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                            this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                            this.delayCameraRotX.setInput(90);
                            this.delayCameraRotZ.setInput(0);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());
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
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "normal"));
                        break;
                    case 1:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "rightSide"));
                        break;
                    case 2:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "leftSide"));
                        break;
                    case 3:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "setUpReversed"));
                        break;
                    case 4:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "setUpNormal"));
                        break;
                    case 5:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "overHead"));
                        break;
                    case 6:
                        MadMaze.locationBooleans.push(new MadMaze.LocationBool(false, "overHeadReversed"));
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
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "normal") {
                        this.alignment.innerHTML = "Alignment: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //rightside
            if (event.gamma - this.toleranceFactor < 90 && event.gamma + this.toleranceFactor > 90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "rightSide") {
                        for (let location of MadMaze.locationBooleans) {
                            if (location.name == "leftSide" && location.isActive)
                                return;
                        }
                        this.alignment.innerHTML = "Alignment: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //leftside
            if (event.gamma - this.toleranceFactor < -90 && event.gamma + this.toleranceFactor > -90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "rightSide" && location.isActive)
                        return;
                    if (location.name == "leftSide") {
                        this.alignment.innerHTML = "Alignment: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //setUpReversed
            if (event.beta - this.toleranceFactor < -90 && event.beta + this.toleranceFactor > -90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "setUpReversed") {
                        this.alignment.innerHTML = "Alignment: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //setUpNormal
            if (event.beta - this.toleranceFactor < 90 && event.beta + this.toleranceFactor > 90) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "setUpNormal") {
                        this.alignment.innerHTML = "Alignment: " + location.name;
                        location.isActive = true;
                    }
                    else
                        location.isActive = false;
                }
            }
            //overhead
            if (event.beta - this.toleranceFactor < 180 && event.beta + this.toleranceFactor > 180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "overHead") {
                        this.alignment.innerHTML = "Alignment: " + location.name;
                        location.isActive = true;
                        //this.rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                    }
                    else
                        location.isActive = false;
                }
            }
            //overHeadReversed
            if (event.beta - this.toleranceFactor < -180 && event.beta + this.toleranceFactor > -180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.locationBooleans) {
                    if (location.name == "overHeadReversed") {
                        this.alignment.innerHTML = "Alignment: " + location.name;
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
    //@ts-ignore
    class LocationBool {
        isActive = false;
        name = "";
        constructor(_isActive, _name) {
            this.isActive = _isActive;
            this.name = _name;
        }
    }
    MadMaze.LocationBool = LocationBool;
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
        MadMaze.spawnPoint = MadMaze.madeMazeGraph.getChildrenByName("Level1")[0].getChild(0).getComponent(f.ComponentTransform).mtxLocal.translation;
        let deviceManager = new MadMaze.DeviceManager(startButton, new MadMaze.BallManager(MadMaze.rgdbdyBall));
        if (f.Project.mode != f.MODE.EDITOR)
            startButton.addEventListener("click", deviceManager.getAccelPermission);
        new MadMaze.CameraFollow(MadMaze.cmpCamera.node, MadMaze.cameraParent, MadMaze.rgdbdyBall.node);
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
        isCross;
        verticalNeg = false;
        verticalPos = false;
        rndRotVel;
        rndTransVel;
        constructor() {
            super();
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            this.rndRotVel = randomRangeFromInterval(0.5, 2);
            this.rndTransVel = randomRangeFromInterval(0.0005, 0.001) * 0.01;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
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
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        update = () => {
            if (this.isCross) {
                this.node.getComponent(f.ComponentTransform).mtxLocal.rotateY(this.rndRotVel);
            }
            else {
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
        };
    }
    MadMaze.ObstaclesTranslator = ObstaclesTranslator;
    function randomRangeFromInterval(min, max) {
        return (Math.random() * (max - min + 1) + min);
    }
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class OnCollisionStop extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(OnCollisionStop);
        hasToChangeAngle;
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
                if (this.hasToChangeAngle == "rotate") {
                    // cmpCamera.mtxPivot.rotateZ(-90);
                }
            }
        };
    }
    MadMaze.OnCollisionStop = OnCollisionStop;
})(MadMaze || (MadMaze = {}));
var MadMaze;
(function (MadMaze) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(MadMaze); // Register the namespace to FUDGE for serialization
    class OnTriggerDisable extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(OnTriggerDisable);
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
                    this.node.getComponent(f.ComponentRigidbody).addEventListener("TriggerLeftCollision" /* TRIGGER_EXIT */, this.triggerExit);
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
        triggerExit = (_event) => {
            if (_event.cmpRigidbody.node.name == "Ball") {
                this.node.getParent().getComponent(f.ComponentRigidbody).activate(true);
            }
        };
        update = () => {
        };
    }
    MadMaze.OnTriggerDisable = OnTriggerDisable;
})(MadMaze || (MadMaze = {}));
//# sourceMappingURL=Script.js.map