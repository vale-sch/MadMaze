declare namespace MadMaze {
}
declare namespace MadMaze {
    import f = FudgeCore;
    class ObstaclesTranslator extends f.ComponentScript {
        private isCross;
        private verticalNeg;
        private verticalPos;
        private rndRotVel;
        private rndTransVel;
        private mySelf;
        constructor(_mySelf: f.Node);
        hndEvent: (_event: Event) => void;
        private update;
    }
}
