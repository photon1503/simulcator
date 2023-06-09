const inch = 2.54;

const radians_to_degrees = (rad) => (rad * 180.0) / Math.PI;
const degrees_to_radians = (deg) => (deg / 180.0) * Math.PI;

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

document.addEventListener('alpine:init', function () {
  Alpine.data('data', function () {
    return {
      input: {
        diagonal: 32,
        ratio: "[16, 9]",
        screenRatio: [16, 9],
        bezel: 9,
        isCurved: false,
        curvatureRadius: 1800,
        screens: 1,
        angle: 56,
        distance: 67,
      },
      display: {
        height: 0,
        width: 0,
        widthInclBezels: 0,
        straightWidth: 0,
        totalWidth: 0,
        hFOV: 0,
        vFOV: 0,
        optimalAngle: 0,
        hFOVcurved: 0,
        idealDistance: 0,
        depth: 0,
      },
      calculate() {
        this.input.screenRatio = JSON.parse(this.input.ratio);
        result.ratioFactor = ratioFactor(
          this.input.screenRatio[0],
          this.input.screenRatio[1]
        );
        result.height = screenHeight(this.input.diagonal, result.ratioFactor);
        result.width = screenWidth(result.height, result.ratioFactor);
        result.widthInclBezels = result.width + 2 * (this.input.bezel / 10);
        result.straightWidth = screenStraightWidth(
          this.input.curvatureRadius / 10,
          result.width,
          this.input.bezel / 10
        );
        result.totalWidth = TotalWidth(
          degrees_to_radians(this.input.angle),
          result.width
        );
        result.vFOV = vFOV(result.height, this.input.distance);
        result.hFOV = hFOV(this.input.screens, result.widthInclBezels, this.input.distance);
        result.depth = totalDepth(result.widthInclBezels, this.input.angle);
        result.optimalAngle = radians_to_degrees(
          ScreenAngle(result.widthInclBezels, this.input.distance)
        );
        result.hFOVcurved = hFOVcurved(
          this.input.screens,
          result.widthInclBezels,
          this.input.curvatureRadius / 10,
          this.input.distance
        );
        result.idealDistance = idealDistance(this.input.angle);

        // assing result to display
        for (element in result) {
          this.display[element] = result[element].toFixed(2);
        }

      }
    };
  });
});


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
function hFOVcurved(screens, width, radius, distance) {
  var hFOVc =
    screens *
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
