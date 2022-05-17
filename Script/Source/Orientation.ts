namespace MadMaze {
    //@ts-ignore
    export enum Alignment {
        NORMAL = "NORMAL",
        RIGHTSIDE = "RIGHTSIDE",
        LEFTSIDE = "LEFTSIDE",
        SETUPREVERSED = "SETUPREVERSED",
        SETUPNORMAL = "SETUPNORMAL",
        OVERHEAD = "OVERHEAD",
        OVERHEADREVERSED = "OVERHEADREVERSED",
    }
    export class Orientation {

        public isActive: boolean = false;
        public alignment: Alignment;
        constructor(_isActive: boolean, _alignment: Alignment) {
            this.isActive = _isActive;
            this.alignment = _alignment;
        }
    }
}