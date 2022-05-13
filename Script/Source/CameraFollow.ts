namespace MadMaze {
    import f = FudgeCore;
    export class CameraFollow {
        private cameraParent: f.Node;
        private cmpCamera: f.Node;
        private ballNode: f.Node;
        private delayCameraTransX: f.Control = new f.Control("delayCameraX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraTransZ: f.Control = new f.Control("delayCameraZ", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraRotX: f.Control = new f.Control("delayRotX", 1, f.CONTROL_TYPE.PROPORTIONAL);
        private delayCameraRotZ: f.Control = new f.Control("delayRotZ", 1, f.CONTROL_TYPE.PROPORTIONAL);
        constructor(_cmpCamera: f.Node, _cameraParent: f.Node, _ballNode: f.Node) {
            this.cameraParent = _cameraParent;
            this.cmpCamera = _cmpCamera;
            this.ballNode = _ballNode;
            this.delayCameraTransX.setDelay(350);
            this.delayCameraTransZ.setDelay(350);
            this.delayCameraRotX.setDelay(500);
            this.delayCameraRotZ.setDelay(500);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            locationBooleans.forEach(location => {
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
        }
    }
}