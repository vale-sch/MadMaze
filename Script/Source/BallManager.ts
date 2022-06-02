import f = FudgeCore;
namespace MadMaze {


    export let orientations: Orientation[] = new Array<Orientation>();
    export let spawnPoint: f.Vector3 = null;
    export let lowestBorder: number = 0;
    export class BallManager {

        private rgdbdyBall: f.ComponentRigidbody;

        constructor(_rgdBdy: f.ComponentRigidbody) {
            this.rgdbdyBall = _rgdBdy;
            //this.rgdbdyBall.mass = 5;

            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            if (OverlayCanvas.isInOverlayMode) {
                rgdbdyBall.setVelocity(f.Vector3.ZERO());
                rgdbdyBall.setRotation(f.Vector3.ZERO());
            }

            if (this.rgdbdyBall.getPosition().y < lowestBorder) {
                madeMazeGraph.getChildren().forEach(child => {
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
                rgdbdyBall.setVelocity(f.Vector3.ZERO());
                if (spawnPoint != null)
                    rgdbdyBall.setPosition(spawnPoint);
                else
                    rgdbdyBall.setPosition(startPoint);
                OverlayCanvas.showDiv();
            }
        }




        private gamma: number = 0;
        private beta: number = 0;
        private speed: number = 0.5;
        public applyForceAlongDirection = (event: DeviceOrientationEvent): void => {
            this.gamma = event.gamma * this.speed;
            this.beta = event.beta * this.speed;
            if (!OverlayCanvas.isInOverlayMode)
                if (!isCameraFly)
                    orientations.forEach(location => {
                        switch (location.alignment) {
                            case (Alignment.NORMAL):
                                if (location.isActive)
                                    this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -5, -this.beta));
                                break;

                            case (Alignment.RIGHTSIDE):
                                if (location.isActive) {
                                    if (Math.abs(event.beta) > 100) {
                                        this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                        return;
                                    }
                                    this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, this.gamma / 10, -this.beta));
                                }
                                break;

                            case (Alignment.LEFTSIDE):
                                if (location.isActive) {
                                    if (Math.abs(event.beta) > 100) {
                                        this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                        return;
                                    }
                                    this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, -this.gamma / 10, -this.beta));
                                }
                                break;

                            case (Alignment.SETUPREVERSED):
                                if (location.isActive) {
                                    if (event.beta > -90)
                                        this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 2, -this.beta / 2, -this.beta));
                                    else
                                        this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 2, -this.beta / 2, -this.beta));
                                }
                                break;

                            case (Alignment.SETUPNORMAL):
                                if (location.isActive) {
                                    if (event.beta < 90)
                                        this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 2, this.beta / 2, -this.beta));
                                    else
                                        this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 2, this.beta / 2, -this.beta));
                                }
                                break;

                            case (Alignment.OVERHEAD):
                                if (location.isActive) {
                                    let zFactor: number = 0;
                                    if (Math.abs(this.beta) > 80)
                                        zFactor = 6;
                                    else
                                        zFactor = -6;
                                    this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, this.beta / 5, zFactor));
                                }

                                break;

                            case (Alignment.OVERHEADREVERSED):
                                if (location.isActive) {
                                    let zFactor: number = 0;
                                    if (Math.abs(this.beta) > 80)
                                        zFactor = 6;
                                    else
                                        zFactor = -6;
                                    this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -this.beta / 5, zFactor));
                                }

                                break;

                        }
                    });
        }
    }
}
