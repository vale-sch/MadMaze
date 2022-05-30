namespace MadMaze {
    import f = FudgeCore;
    export let isCameraFly: boolean = true;
    export let cameraFlyPoints: Array<f.ComponentTransform>;
    export let flyIncrement: number = 0;

    export class CameraFollow {
        private cameraParent: f.Node;
        private cmpCamera: f.Node;
        private ballNode: f.Node;
        private delayCameraTransX: f.Control = new f.Control("delayCameraX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraTransY: f.Control = new f.Control("delayCameraY", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraTransZ: f.Control = new f.Control("delayCameraZ", 1, f.CONTROL_TYPE.PROPORTIONAL);

        private delayCameraRotX: f.Control = new f.Control("delayRotX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraRotY: f.Control = new f.Control("delayRotY", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraRotZ: f.Control = new f.Control("delayRotZ", 1, f.CONTROL_TYPE.PROPORTIONAL);
        constructor(_cmpCamera: f.Node, _cameraParent: f.Node, _ballNode: f.Node) {
            this.cameraParent = _cameraParent;
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;

            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            if (isCameraFly) {
                if (cameraFlyPoints != null)
                    if (flyIncrement == cameraFlyPoints.length) {
                        this.delayCameraTransX.setDelay(150);
                        this.delayCameraTransY.setDelay(150);
                        this.delayCameraTransZ.setDelay(150);
                        this.delayCameraRotX.setDelay(500);
                        this.delayCameraRotY.setDelay(500);
                        this.delayCameraRotZ.setDelay(500);

                        this.cmpCamera.mtxLocal.rotation = new f.Vector3(0, 0, 0);;
                        isCameraFly = false;
                        return;
                    }
                this.delayCameraTransX.setDelay(1000);
                this.delayCameraTransY.setDelay(1000);
                this.delayCameraTransZ.setDelay(1000);
                this.delayCameraRotX.setDelay(1000);
                this.delayCameraRotY.setDelay(1000);
                this.delayCameraRotZ.setDelay(1000);
                this.delayCameraTransX.setInput(cameraFlyPoints[flyIncrement].mtxLocal.translation.x);
                this.delayCameraTransY.setInput(cameraFlyPoints[flyIncrement].mtxLocal.translation.y);
                this.delayCameraTransZ.setInput(cameraFlyPoints[flyIncrement].mtxLocal.translation.z);

                this.delayCameraRotX.setInput(cameraFlyPoints[flyIncrement].mtxLocal.rotation.x);
                this.delayCameraRotY.setInput(cameraFlyPoints[flyIncrement].mtxLocal.rotation.y);
                this.delayCameraRotZ.setInput(cameraFlyPoints[flyIncrement].mtxLocal.rotation.z);
                this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.delayCameraTransY.getOutput(), this.delayCameraTransZ.getOutput());
                this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), this.delayCameraRotY.getOutput(), this.delayCameraRotZ.getOutput());;


                if (f.Vector3.DIFFERENCE(this.cameraParent.mtxLocal.translation, cameraFlyPoints[flyIncrement].mtxLocal.translation).magnitude < 2)
                    flyIncrement++;



            }
            if (!isCameraFly)
                orientations.forEach(orientation => {
                    switch (orientation.alignment) {
                        case (Alignment.NORMAL):
                            if (orientation.isActive) {
                                this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z - 5);
                                this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                                this.delayCameraRotX.setInput(50);
                                this.delayCameraRotZ.setInput(0);
                                this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);

                            }
                            break;
                        case (Alignment.LEFTSIDE):
                            if (orientation.isActive) {
                                this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x - 8);
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                                this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraTransZ.getOutput());
                                this.delayCameraRotX.setInput(90);
                                this.delayCameraRotZ.setInput(25);
                                this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());

                            }
                            break;
                        case (Alignment.RIGHTSIDE):
                            if (orientation.isActive) {
                                this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x + 8);
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                                this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 15, this.delayCameraTransZ.getOutput());
                                this.delayCameraRotX.setInput(90);
                                this.delayCameraRotZ.setInput(-25);
                                this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, this.delayCameraRotZ.getOutput());

                            }
                            break;
                        case (Alignment.SETUPREVERSED):
                            if (orientation.isActive) {
                                this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z - 10);
                                this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                                this.delayCameraRotX.setInput(65);
                                this.delayCameraRotZ.setInput(0);

                                this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);

                            }
                            break;
                        case (Alignment.SETUPNORMAL):
                            if (orientation.isActive) {
                                this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z + 10);
                                this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                                this.delayCameraRotX.setInput(115);
                                this.delayCameraRotZ.setInput(0);

                                this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);

                            }
                            break;
                        case (Alignment.OVERHEAD):
                            if (orientation.isActive) {
                                this.delayCameraTransX.setInput(this.ballNode.mtxWorld.translation.x);
                                this.delayCameraTransZ.setInput(this.ballNode.mtxWorld.translation.z);
                                this.cameraParent.mtxLocal.translation = new f.Vector3(this.delayCameraTransX.getOutput(), this.ballNode.mtxWorld.translation.y + 10, this.delayCameraTransZ.getOutput());
                                this.delayCameraRotX.setInput(90);
                                this.delayCameraRotZ.setInput(0);
                                this.cmpCamera.mtxLocal.rotation = new f.Vector3(this.delayCameraRotX.getOutput(), 0, 0);

                            }
                            break;
                        case (Alignment.OVERHEADREVERSED):
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
        }
    }
}