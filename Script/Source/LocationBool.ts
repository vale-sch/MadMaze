namespace MadMaze {
    //@ts-ignore
    export class LocationBool {

        public isActive: boolean = false;
        public name: string = "";
        constructor(_isActive: boolean, _name: string) {
            this.isActive = _isActive;
            this.name = _name;
        }
    }
}