"use strict";
var f = FudgeCore;
var MadMaze;
(function (MadMaze) {
    MadMaze.orientations = new Array();
    MadMaze.spawnPoint = null;
    MadMaze.lowestBorder = 0;
    class BallManager {
        rgdbdyBall;
        constructor(_rgdBdy) {
            this.rgdbdyBall = _rgdBdy;
            //this.rgdbdyBall.mass = 5;
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            f.Loop.start();
        }
        update = (_event) => {
            if (MadMaze.OverlayCanvas.isInOverlayMode) {
                MadMaze.rgdbdyBall.setVelocity(f.Vector3.ZERO());
                MadMaze.rgdbdyBall.setRotation(f.Vector3.ZERO());
            }
            if (this.rgdbdyBall.getPosition().y < MadMaze.lowestBorder) {
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
                MadMaze.rgdbdyBall.setVelocity(f.Vector3.ZERO());
                if (MadMaze.spawnPoint != null)
                    MadMaze.rgdbdyBall.setPosition(MadMaze.spawnPoint);
                else
                    MadMaze.rgdbdyBall.setPosition(MadMaze.startPoint);
                MadMaze.OverlayCanvas.showDiv();
            }
        };
        gamma = 0;
        beta = 0;
        speed = 0.5;
        applyForceAlongDirection = (event) => {
            this.gamma = event.gamma * this.speed;
            this.beta = event.beta * this.speed;
            if (!MadMaze.OverlayCanvas.isInOverlayMode)
                if (!MadMaze.isCameraFly)
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
                                        this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 2, -this.beta / 2, -this.beta));
                                    else
                                        this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 2, -this.beta / 2, -this.beta));
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
                                if (location.isActive) {
                                    let zFactor = 0;
                                    if (Math.abs(this.beta) > 80)
                                        zFactor = 6;
                                    else
                                        zFactor = -6;
                                    this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, this.beta / 5, zFactor));
                                }
                                break;
                            case (MadMaze.Alignment.OVERHEADREVERSED):
                                if (location.isActive) {
                                    let zFactor = 0;
                                    if (Math.abs(this.beta) > 80)
                                        zFactor = 6;
                                    else
                                        zFactor = -6;
                                    this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -this.beta / 5, zFactor));
                                }
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
    MadMaze.isCameraFly = false;
    MadMaze.flyIncrement = 0;
    class CameraFollow {
        cameraParent;
        cmpCamera;
        ballNode;
        delayCameraTransX = new f.Control("delayCameraX", 1, 0 /* PROPORTIONAL */);
        delayCameraTransY = new f.Control("delayCameraY", 1, 0 /* PROPORTIONAL */);
        delayCameraTransZ = new f.Control("delayCameraZ", 1, 0 /* PROPORTIONAL */);
        delayCameraRotX = new f.Control("delayRotX", 1, 0 /* PROPORTIONAL */);
        delayCameraRotY = new f.Control("delayRotY", 1, 0 /* PROPORTIONAL */);
        delayCameraRotZ = new f.Control("delayRotZ", 1, 0 /* PROPORTIONAL */);
        hasCheckedSpawnPoint = false;
        constructor(_cmpCamera, _cameraParent, _ballNode) {
            this.cameraParent = _cameraParent;
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            f.Loop.start();
        }
        update = (_event) => {
            if (!MadMaze.OverlayCanvas.isInOverlayMode)
                if (MadMaze.isCameraFly) {
                    if (MadMaze.cameraFlyPoints != null) {
                        if (MadMaze.flyIncrement == MadMaze.cameraFlyPoints.length) {
                            this.delayCameraTransX.setDelay(150);
                            this.delayCameraTransY.setDelay(150);
                            this.delayCameraTransZ.setDelay(150);
                            this.delayCameraRotX.setDelay(500);
                            this.delayCameraRotY.setDelay(500);
                            this.delayCameraRotZ.setDelay(500);
                            this.cmpCamera.mtxLocal.rotation = new f.Vector3(0, 0, 0);
                            ;
                            MadMaze.isCameraFly = false;
                            this.hasCheckedSpawnPoint = false;
                            return;
                        }
                        if (MadMaze.spawnPoint != null && !this.hasCheckedSpawnPoint) {
                            let nearestLocation = 0;
                            for (let i = 1; i < MadMaze.cameraFlyPoints.length - 1; i++) {
                                let actualLocation = f.Vector3.DIFFERENCE(MadMaze.cameraFlyPoints[i].mtxLocal.translation, MadMaze.spawnPoint).magnitude;
                                if (nearestLocation == 0 || nearestLocation > actualLocation) {
                                    nearestLocation = actualLocation;
                                    MadMaze.flyIncrement = i;
                                }
                            }
                            this.hasCheckedSpawnPoint = true;
                        }
                        this.delayCameraTransX.setDelay(500);
                        this.delayCameraTransY.setDelay(500);
                        this.delayCameraTransZ.setDelay(500);
                        this.delayCameraRotX.setDelay(600);
                        this.delayCameraRotY.setDelay(600);
                        this.delayCameraRotZ.setDelay(600);
                        this.delayCameraTransX.setInput(MadMaze.cameraFlyPoints[MadMaze.flyIncrement].mtxLocal.translation.x);
                        this.delayCameraTransY.setInput(MadMaze.cameraFlyPoints[MadMaze.flyIncrement].mtxLocal.translation.y);
                        this.delayCameraTransZ.setInput(MadMaze.cameraFlyPoints[MadMaze.flyIncrement].mtxLocal.translation.z);
                        this.delayCameraRotX.setInput(MadMaze.cameraFlyPoints[MadMaze.flyIncrement].mtxLocal.rotation.x);
                        this.delayCameraRotY.setInput(MadMaze.cameraFlyPoints[MadMaze.flyIncrement].mtxLocal.rotation.y);
                        this.delayCameraRotZ.setInput(MadMaze.cameraFlyPoints[MadMaze.flyIncrement].mtxLocal.rotation.z);
                        this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.delayCameraTransY.getOutput(), this.delayCameraTransZ.getOutput());
                        this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), this.delayCameraRotY.getOutput(), this.delayCameraRotZ.getOutput());
                        ;
                        if (f.Vector3.DIFFERENCE(this.cameraParent.mtxLocal.translation, MadMaze.cameraFlyPoints[MadMaze.flyIncrement].mtxLocal.translation).magnitude < 2)
                            MadMaze.flyIncrement++;
                    }
                    else
                        MadMaze.isCameraFly = false;
                }
            if (!MadMaze.isCameraFly)
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
        hasActivated = false;
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
            if (_event.cmpRigidbody.node.name == "Ball" && !this.hasActivated) {
                MadMaze.spawnPoint = this.node.mtxWorld.translation;
                this.node.getParent().removeChild(this.node);
                this.hasActivated = true;
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
        toleranceFactor = 20;
        constructor(_startButton, _ballManager) {
            this.ballManager = _ballManager;
            this.startButton = _startButton;
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
            new MadMaze.CameraFollow(MadMaze.cmpCamera.node, MadMaze.cameraParent, MadMaze.rgdbdyBall.node);
            MadMaze.OverlayCanvas.initializeButtons();
            MadMaze.OverlayCanvas.showDiv();
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
            // refreshButt.hidden = true;
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
            if (!MadMaze.isCameraFly)
                this.checkForOrientation(event);
        };
        checkForOrientation = (event) => {
            //normal
            if (event.beta - this.toleranceFactor < 15 && event.beta + this.toleranceFactor > 15 && event.gamma - this.toleranceFactor < 15 && event.gamma + this.toleranceFactor > 15) {
                for (let orientation of MadMaze.orientations) {
                    if (orientation.alignment == MadMaze.Alignment.NORMAL)
                        orientation.isActive = true;
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
                    if (location.alignment == MadMaze.Alignment.LEFTSIDE)
                        location.isActive = true;
                    else
                        location.isActive = false;
                }
            }
            //setUpReversed
            if (event.beta - this.toleranceFactor < -90 && event.beta + this.toleranceFactor > -90) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.SETUPREVERSED)
                        location.isActive = true;
                    else
                        location.isActive = false;
                }
            }
            //setUpNormal
            if (event.beta - this.toleranceFactor < 90 && event.beta + this.toleranceFactor > 90) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.SETUPNORMAL)
                        location.isActive = true;
                    else
                        location.isActive = false;
                }
            }
            //overhead
            if (event.beta - this.toleranceFactor < 180 && event.beta + this.toleranceFactor > 180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.OVERHEAD)
                        location.isActive = true;
                    else
                        location.isActive = false;
                }
            }
            //overHeadReversed
            if (event.beta - this.toleranceFactor < -180 && event.beta + this.toleranceFactor > -180 && event.gamma - this.toleranceFactor < 0 && event.gamma + this.toleranceFactor > 0) {
                for (let location of MadMaze.orientations) {
                    if (location.alignment == MadMaze.Alignment.OVERHEADREVERSED)
                        location.isActive = true;
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
    var f = FudgeCore;
    let Levels;
    (function (Levels) {
        Levels["LEVEL1"] = "Graph|2022-05-17T15:48:20.157Z|38212";
        Levels["LEVEL2"] = "Graph|2022-05-17T15:48:08.487Z|74649";
        Levels["LEVEL3"] = "Graph|2022-05-17T15:39:18.443Z|44479";
        Levels["LEVEL4"] = "Graph|2022-05-31T15:35:07.044Z|09570";
        Levels["LEVEL5"] = "Graph|2022-05-31T15:46:28.921Z|74068";
    })(Levels = MadMaze.Levels || (MadMaze.Levels = {}));
    class LevelManager {
        static level = 1;
        static nextLevelGraph = Levels.LEVEL1;
        static previousGraph;
        static levelOverview;
        constructor() {
            LevelManager.levelOverview = document.getElementById("level");
            LevelManager.levelOverview.style.fontSize = "70px";
            LevelManager.levelOverview.style.fontWeight = "bold";
            LevelManager.levelOverview.style.textAlign = "center";
            LevelManager.levelOverview.style.color = "green";
        }
        static loadNextLevel() {
            MadMaze.spawnPoint = null;
            this.previousGraph.getChildren().forEach(child => {
                if (child.getComponent(f.ComponentRigidbody))
                    child.removeComponent(child.getComponent(f.ComponentRigidbody));
                child.getChildren().forEach(childOfChild => {
                    if (childOfChild.getComponent(f.ComponentRigidbody))
                        childOfChild.removeComponent(childOfChild.getComponent(f.ComponentRigidbody));
                    childOfChild.getChildren().forEach(childOfChildofChild => {
                        if (childOfChildofChild.getComponent(f.ComponentRigidbody))
                            childOfChildofChild.removeComponent(childOfChildofChild.getComponent(f.ComponentRigidbody));
                    });
                });
            });
            MadMaze.madeMazeGraph.removeChild(this.previousGraph);
            let levelToLoad = f.Project.resources[this.nextLevelGraph];
            MadMaze.rgdbdyBall.setVelocity(f.Vector3.ZERO());
            MadMaze.startPoint = levelToLoad.getChildrenByName("startPoint")[0].getComponent(f.ComponentTransform).mtxLocal.translation;
            MadMaze.rgdbdyBall.setPosition(MadMaze.startPoint);
            MadMaze.cameraFlyPoints = new Array(levelToLoad.getChildrenByName("cameraFlyPoints")[0].nChildren - 1);
            let increment = 0;
            levelToLoad.getChildrenByName("cameraFlyPoints")[0].getChildren().forEach(flyPoint => {
                MadMaze.cameraFlyPoints[increment] = flyPoint.getComponent(f.ComponentTransform);
                increment++;
            });
            MadMaze.madeMazeGraph.appendChild(levelToLoad);
            this.previousGraph = levelToLoad;
            this.levelOverview.innerHTML = "Level: " + this.level;
        }
        static initilizeScene() {
            let scene = f.Project.resources[this.nextLevelGraph];
            MadMaze.madeMazeGraph.appendChild(scene);
            this.previousGraph = scene;
            this.levelOverview.innerHTML = "Level: " + this.level;
            MadMaze.startPoint = scene.getChildrenByName("startPoint")[0].getComponent(f.ComponentTransform).mtxLocal.translation;
            MadMaze.rgdbdyBall.setPosition(MadMaze.startPoint);
            MadMaze.cameraFlyPoints = new Array(this.previousGraph.getChildrenByName("cameraFlyPoints")[0].nChildren - 1);
            let increment = 0;
            this.previousGraph.getChildrenByName("cameraFlyPoints")[0].getChildren().forEach(flyPoint => {
                MadMaze.cameraFlyPoints[increment] = flyPoint.getComponent(f.ComponentTransform);
                increment++;
            });
            MadMaze.lowestBorder = -55;
        }
        static checkForNextLevel() {
            switch (LevelManager.level) {
                case (1):
                    MadMaze.lowestBorder = -55;
                    this.nextLevelGraph = Levels.LEVEL1;
                    break;
                case (2):
                    MadMaze.lowestBorder = -8;
                    this.nextLevelGraph = Levels.LEVEL2;
                    break;
                case (3):
                    MadMaze.lowestBorder = -1;
                    this.nextLevelGraph = Levels.LEVEL3;
                    break;
                case (4):
                    MadMaze.lowestBorder = -20;
                    this.nextLevelGraph = Levels.LEVEL4;
                    break;
                case (5):
                    MadMaze.lowestBorder = -18;
                    this.nextLevelGraph = Levels.LEVEL5;
                    break;
            }
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
    let startButton = document.getElementById("startButton");
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
        MadMaze.rgdbdyBall = MadMaze.madeMazeGraph.getChildrenByName("Ball")[0].getComponent(f.ComponentRigidbody);
        new MadMaze.LevelManager();
        MadMaze.LevelManager.initilizeScene();
        // setup the viewport
        MadMaze.cameraParent = MadMaze.madeMazeGraph.getChildrenByName("Camera")[0];
        MadMaze.cmpCamera = MadMaze.cameraParent.getChild(0).getComponent(f.ComponentCamera);
        let canvas = document.querySelector("canvas");
        viewport = new FudgeCore.Viewport();
        viewport.initialize("InteractiveViewport", MadMaze.madeMazeGraph, MadMaze.cmpCamera, canvas);
        let deviceManager = new MadMaze.DeviceManager(startButton, new MadMaze.BallManager(MadMaze.rgdbdyBall));
        if (f.Project.mode != f.MODE.EDITOR)
            startButton.addEventListener("click", deviceManager.getAccelPermission);
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
    class OnTriggerOpen extends f.ComponentScript {
        static iSubclass = f.Component.registerSubclass(OnTriggerOpen);
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
                this.node.getParent().getComponent(f.ComponentRigidbody).activate(false);
            }
        };
        OnTriggerExit = (_event) => {
            if (_event.cmpRigidbody.node.name == "Ball") {
                this.node.getParent().getComponent(f.ComponentRigidbody).activate(true);
            }
        };
    }
    MadMaze.OnTriggerOpen = OnTriggerOpen;
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
    class OverlayCanvas {
        static overlayDiv = document.getElementById("overlayDiv");
        static continueButton = document.getElementById("game");
        static showTrackButton = document.getElementById("cameraFly");
        static isInOverlayMode = false;
        static initializeButtons() {
            this.showTrackButton.addEventListener("click", this.showTrack);
            this.continueButton.addEventListener("click", this.continueGame);
        }
        static showDiv() {
            this.overlayDiv.hidden = false;
            this.isInOverlayMode = true;
        }
        static hideDiv() {
            this.overlayDiv.hidden = true;
            this.isInOverlayMode = false;
        }
        static showTrack = () => {
            MadMaze.isCameraFly = true;
            MadMaze.flyIncrement = 0;
            this.hideDiv();
        };
        static continueGame = () => {
            this.hideDiv();
        };
    }
    MadMaze.OverlayCanvas = OverlayCanvas;
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
                MadMaze.rgdbdyBall.setVelocity(f.Vector3.ZERO());
                MadMaze.LevelManager.level++;
                MadMaze.LevelManager.checkForNextLevel();
                MadMaze.LevelManager.loadNextLevel();
                MadMaze.OverlayCanvas.showDiv();
            }
        };
    }
    MadMaze.Target = Target;
})(MadMaze || (MadMaze = {}));
//# sourceMappingURL=Script.js.map