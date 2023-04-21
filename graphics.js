var width = window.innerWidth / 3;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: "canvas",
  width: width,
  height: height,
});

var layer = new Konva.Layer();

stage.add(layer);
var center = stage.width() / 2;

/*
var head = new Konva.Circle({
  x: center,
  y: 100,
  radius: 5,
  fill: "red",
});
layer.add(head);

var monitorMiddle = new Konva.Rect({
  x: center,
  y: 1,
  width: 10,
  height: 5,
  fill: "green",
  stroke: "black",
  strokeWidth: 4,
});
layer.add(monitorMiddle);

*/

var frontView = new Konva.Rect({
    x: 0,
    y: 0,
    width: 30,
    height: 15,
    stroke: "black",
    strokeWidth: 1,
});
layer.add(frontView);

function updateGraphics() {
  /*
  monitorMiddle.setWidth(result.width);
  head.setX(monitorMiddle.x() + monitorMiddle.width() / 2);
  head.setY( screen.distance); 
  */

  frontView.setWidth(result.width);
  frontView.setHeight(result.height);
  frontView.setStrokeWidth(screen.bezel/10);
  layer.draw();
}
