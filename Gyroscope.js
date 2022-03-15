


let sensor = new Gyroscope();
sensor.start();


let x = document.getElementById("x");
let y = document.getElementById("y");
let z = document.getElementById("z");
x.innerText = "Angular velocity around the X-axis "
sensor.onreading = () => {

    /* x.innerHTML = "Angular velocity around the X-axis " + sensor.x;
     y.innerHTML = "Angular velocity around the Y-axis " + sensor.y;
     z.innerHTML = "Angular velocity around the Z-axis " + sensor.z;*/
};

