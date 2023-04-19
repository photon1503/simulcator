const inch = 2.54;

const radians_to_degrees = rad => (rad * 180.0) / Math.PI;
const degrees_to_radians = deg => deg / 180.0 * Math.PI;

screen = {
    diagonal: 32,
    ratio: "[16, 9]",
    screenRatio: [16, 9],
    bezel: 5,
    isCurved: false,
    curvatureRadius: 1800,
    screens: 1,
    angle: 60,
    distance: 65,
};

result = {
    width: 0,
    straightWidth: 0,
    height: 0,
    totalWidth: 0,
    idealTotalWidth: 0,
    straightWidth: 0,
    hFOV: 0,
    hFOVcurved: 0,
    vFOV: 0,
    optimalAngle: 0,
    idealDistance: 0
};

display = { width: 0,
    straightWidth: 0,
    height: 0,
    totalWidth: 0,
    idealTotalWidth: 0,
    straightWidth: 0,
    hFOV: 0,
    hFOVcurved: 0,
    vFOV: 0,
    optimalAngle: 0,
    idealDistance: 0 }

data = { screen, display};  //necessary to get the scope of the AlpineJS object

function calculate(data) {
    console.log(screen);

    //screen.isCurved = screen.isCurved === "true";

    ratioFactor();
    result.height =  screenHeight(screen.diagonal);
    result.width = screenWidth();
    result.straightWidth = screenStraightWidth();
    result.idealTotalWidth = TotalWidth(ScreenAngle());
    result.totalWidth = TotalWidth(degrees_to_radians(screen.angle));
    result.hFOV = hFOV();
    result.vFOV = vFOV();
    
    result.optimalAngle = ScreenAngleDeg();
    result.hFOVcurved = hFOVcurved();
    result.idealDistance = idealDistance(screen.angle);

    data.display.height = result.height.toFixed(2);
    data.display.width = result.width.toFixed(2);
    data.display.straightWidth = result.straightWidth.toFixed(2);
    data.display.idealTotalWidth = result.idealTotalWidth.toFixed(2);
    data.display.totalWidth = result.totalWidth.toFixed(2);
    data.display.hFOV = result.hFOV.toFixed(2);
    data.display.vFOV = result.vFOV.toFixed(2);
    data.display.optimalAngle = result.optimalAngle.toFixed(2);
    data.display.hFOVcurved = result.hFOVcurved.toFixed(2);
    data.display.idealDistance = result.idealDistance.toFixed(2);

}

/*
 * calculate factor from aspect ratio
 */
function ratioFactor() {
    screen.screenRatio = JSON.parse(screen.ratio);
    return screen.screenRatio[0] / screen.screenRatio[1];
}

/*
 * Calculate Screen height from diagonal in inches
 * Returns height in cm
 */
function screenHeight(diagonal) {
    height = (diagonal / Math.sqrt(ratioFactor() ** 2 + 1)) * inch;
    return height;
}

/*
 * calculate screen width based on aspect ratio and height
 */
function screenWidth() {
    return ratioFactor() * result.height;
}

/*
 * for curved monitors
 * calculate straigt width
 */
function screenStraightWidth() {
    var radius_cm = screen.curvatureRadius / 10;
    var straightWidth = 2 * radius_cm * Math.sin(result.width / (2 * radius_cm));
    return straightWidth;
}

/*
 * for triple screens
 * calculate total width of all 3 monitors
 */
function TotalWidth(angle) {
    var W = result.width * (1 + 2 * Math.cos(angle))    
    console.log("Total width ", W);
    return W;
}

/*
 * caclulate vertical Field of View
 */
function vFOV() {
    var vFOV =  2 * Math.atan((result.height / 2) / screen.distance);
    return radians_to_degrees(vFOV);
}

/*
 * calculate horizontal Field of View
 */
function hFOV() {    
    var hFOV = screen.screens *  2 * Math.atan(result.width / (2 * screen.distance))
    return radians_to_degrees(hFOV);
}

/* 
 * calculate horziontal Field of View for curved monitor
 */
function hFOVcurved() {
    var w = result.width;    
    var r = screen.curvatureRadius / 10;

    var hFOVc = screen.screens *  2 * Math.atan(Math.sin(w / (2 * r)) * r / (screen.distance - r * (1 - Math.cos(w / (2 * r)))));

    return radians_to_degrees(hFOVc);
}
/*
 * ideal screen angle at given distance
 */
function ScreenAngle() {
    var a = 2 * Math.atan(result.width / (2 * screen.distance));
    return a;
}

function ScreenAngleDeg() {
    return radians_to_degrees(ScreenAngle());
}

/* 
 * Ideal viewing distance at given angle
 * =ScreenWidth / (2 * TAN(RADIANS(Angle) / 2))
 */
function idealDistance(angle) {
    console.log("ideal distance a=", angle);
    d = result.width / (2 * Math.tan(degrees_to_radians(angle) / 2));
    console.log("ideal distance=", d);
    return d;
}