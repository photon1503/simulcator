const inch = 2.54;

const radians_to_degrees = (rad) => (rad * 180.0) / Math.PI;
const degrees_to_radians = (deg) => (deg / 180.0) * Math.PI;

screen = {
  diagonal: 32,
  ratio: "[16, 9]",
  screenRatio: [16, 9],
  bezel: 9,
  isCurved: false,
  curvatureRadius: 1800,
  screens: 1,
  angle: 56,
  distance: 68,
};

result = {
  ratioFactor: 0,
  width: 0,
  widthInclBezels: 0,
  straightWidth: 0,
  height: 0,
  totalWidth: 0,
  straightWidth: 0,
  hFOV: 0,
  hFOVcurved: 0,
  vFOV: 0,
  optimalAngle: 0,
  idealDistance: 0,
  depth: 0,
};

display = {
  width: 0,
  straightWidth: 0,
  widthInclBezels: 0,
  height: 0,
  totalWidth: 0,
  straightWidth: 0,
  hFOV: 0,
  hFOVcurved: 0,
  vFOV: 0,
  optimalAngle: 0,
  idealDistance: 0,
  depth: 0,
};

data = { screen, display }; //necessary to get the scope of the AlpineJS object

function calculate(data) {
  console.log(screen);

  screen.screenRatio = JSON.parse(screen.ratio);
  result.ratioFactor = ratioFactor(
    screen.screenRatio[0],
    screen.screenRatio[1]
  );
  result.height = screenHeight(screen.diagonal, result.ratioFactor);
  result.width = screenWidth(result.height, result.ratioFactor);
  result.widthInclBezels = result.width + 2 * (screen.bezel / 10);
  result.straightWidth = screenStraightWidth(
    screen.curvatureRadius / 10,
    result.width,
    screen.bezel / 10
  );
  result.totalWidth = TotalWidth(
    degrees_to_radians(screen.angle),
    result.width
  );
  result.vFOV = vFOV(result.height, screen.distance);
  result.hFOV = hFOV(screen.screens, result.widthInclBezels, screen.distance);
  result.depth = totalDepth(result.widthInclBezels, screen.angle);
  result.optimalAngle = radians_to_degrees(
    ScreenAngle(result.widthInclBezels, screen.distance)
  );
  result.hFOVcurved = hFOVcurved(
    result.widthInclBezels,
    screen.curvatureRadius / 10,
    screen.distance
  );
  result.idealDistance = idealDistance(screen.angle);

  data.display.height = result.height.toFixed(2);
  data.display.width = result.width.toFixed(2);
  data.display.widthInclBezels = result.widthInclBezels.toFixed(2);
  data.display.straightWidth = result.straightWidth.toFixed(2);
  data.display.totalWidth = result.totalWidth.toFixed(2);
  data.display.hFOV = result.hFOV.toFixed(2);
  data.display.vFOV = result.vFOV.toFixed(2);
  data.display.optimalAngle = result.optimalAngle.toFixed(2);
  data.display.hFOVcurved = result.hFOVcurved.toFixed(2);
  data.display.idealDistance = result.idealDistance.toFixed(2);
  data.display.depth = result.depth.toFixed(2);
}

/*
 * calculate factor from aspect ratio
 */
function ratioFactor(ratioWidth, ratioHeight) {
  return ratioWidth / ratioHeight;
}

/*
 * Calculate Screen height from diagonal in inches
 */
function screenHeight(diagonal, ratioFactor) {
  return (diagonal / Math.sqrt(ratioFactor ** 2 + 1)) * inch;
}

/*
 * calculate screen width based on aspect ratio and height
 */
function screenWidth(height, ratioFactor) {
  return ratioFactor * height;
}

/*
 * for curved monitors
 * calculate straigt width
 */
function screenStraightWidth(radius, width, bezel) {
  return (straightWidth =
    2 * radius * Math.sin(width / (2 * radius)) + 2 * bezel);
}

/*
 * for triple screens
 * calculate total width of all 3 monitors
 */
function TotalWidth(angle, width) {
  return width * (1 + 2 * Math.cos(angle));
}

/*
 * caclulate vertical Field of View
 */
function vFOV(height, distance) {
  var vFOV = 2 * Math.atan(height / 2 / distance);
  return radians_to_degrees(vFOV);
}

/*
 * calculate horizontal Field of View
 */
function hFOV(screens, width, distance) {
  var hFOV = screens * 2 * Math.atan(width / (2 * distance));
  return radians_to_degrees(hFOV);
}

function totalDepth(width, angle) {
  return width * Math.sin(degrees_to_radians(angle));
}

/*
 * calculate horziontal Field of View for curved monitor
 */
function hFOVcurved(width, radius, distance) {
  var hFOVc =
    screen.screens *
    2 *
    Math.atan(
      (Math.sin(width / (2 * radius)) * radius) /
        (distance - radius * (1 - Math.cos(width / (2 * radius))))
    );

  return radians_to_degrees(hFOVc);
}

/*
 * ideal screen angle at given distance
 */
function ScreenAngle(width, distance) {
  return 2 * Math.atan(width / (2 * distance));
}

/*
 * Ideal viewing distance at given angle
 */
function idealDistance(angle) {
  return result.width / (2 * Math.tan(degrees_to_radians(angle) / 2));
}
