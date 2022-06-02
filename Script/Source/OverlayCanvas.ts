namespace MadMaze {

    export class OverlayCanvas {
        public static overlayDiv: HTMLElement = document.getElementById("overlayDiv");
        public static continueButton: HTMLElement = document.getElementById("game");
        public static showTrackButton: HTMLElement = document.getElementById("cameraFly");
        public static isInOverlayMode: boolean = false;
        public static initializeButtons(): void {
            this.showTrackButton.addEventListener("click", this.showTrack);
            this.continueButton.addEventListener("click", this.continueGame);
        }

        public static showDiv(): void {
            this.overlayDiv.hidden = false;
            this.isInOverlayMode = true;
        }
        private static hideDiv(): void {
            this.overlayDiv.hidden = true;
            this.isInOverlayMode = false;
        }
        public static showTrack = (): void => {
            isCameraFly = true;
            flyIncrement = 0;
            this.hideDiv();

        }
        public static continueGame = (): void => {
            this.hideDiv();
        }
    }
}