
namespace MadMaze {
    export class DeviceManager {

        private startButton: HTMLElement;
        private ballManager: BallManager;
        private toleranceFactor: number = 30;

        public alignment: HTMLElement;

        constructor(_startButton: HTMLElement, _ballManager: BallManager) {
            this.ballManager = _ballManager;
            this.startButton = _startButton;
            this.alignment = document.getElementById("alignment");
            this.alignment.style.fontSize = "48px";
            this.alignment.style.fontWeight = "bold";
        }

        public getAccelPermission = (): void => {
            let device: string = this.getMobileOperatingSystem();
            console.log(device);
            switch (device) {
                case ("iOS"):
                    (DeviceMotionEvent as any).requestPermission().then((response: string) => {
                        if (response == 'granted') {
                            console.log("Access acceleration: " + response);
                            window.addEventListener('deviceorientation', this.deviceOrientationDistributor);
                        } else {
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
        }

        public getMobileOperatingSystem = (): string => {
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

        public createButtons(): void {
            document.body.removeChild(this.startButton);
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


        public createArray(): void {
            for (let i = 0; i < 7; i++) {
                switch (i) {
                    case 0:
                        locationBooleans.push(new LocationBool(false, "normal"));
                        break;
                    case 1:
                        locationBooleans.push(new LocationBool(false, "rightSide"));
                        break;
                    case 2:
                        locationBooleans.push(new LocationBool(false, "leftSide"));
                        break;
                    case 3:
                        locationBooleans.push(new LocationBool(false, "setUpReversed"));
                        break;
                    case 4:
                        locationBooleans.push(new LocationBool(false, "setUpNormal"));
                        break;
                    case 5:
                        locationBooleans.push(new LocationBool(false, "overHead"));
                        break;
                    case 6:
                        locationBooleans.push(new LocationBool(false, "overHeadReversed"));
                        break;
                }
            }
        }




        public deviceOrientationDistributor = (event: DeviceOrientationEvent): void => {
            this.ballManager.applyForceAlongDirection(event);
            this.checkForOrientation(event);
        }

        public checkForOrientation = (event: DeviceOrientationEvent): void => {
            //normal
            if (event.beta - this.toleranceFactor < 20 && event.beta + this.toleranceFactor > 20 && event.gamma - this.toleranceFactor < 20 && event.gamma + this.toleranceFactor > 20) {
                for (let location of locationBooleans) {
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
                for (let location of locationBooleans) {
                    if (location.name == "rightSide") {
                        for (let location of locationBooleans) {
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
                for (let location of locationBooleans) {
                    if (location.name == "rightSide" && location.isActive) return;
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
                for (let location of locationBooleans) {
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
                for (let location of locationBooleans) {
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
                for (let location of locationBooleans) {
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
                for (let location of locationBooleans) {
                    if (location.name == "overHeadReversed") {
                        this.alignment.innerHTML = "Alignment: " + location.name;
                        location.isActive = true;
                        // this.rgdbdyBall.setVelocity(new f.Vector3(0, 0, 0));
                    }
                    else
                        location.isActive = false;
                }
            }
        }
    }
}
