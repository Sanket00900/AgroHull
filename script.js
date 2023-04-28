const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// *Empty array to hold the points
const points = [];

function addPoint(event) {
  event.preventDefault(); //! Prevent the form from submitting

  //TODO :  Get the x and y coordinates from the form input fields
  const x = parseInt(document.getElementById("x-coord").value);
  const y = parseInt(document.getElementById("y-coord").value);

  points.push({ x: x, y: y });

  //! Clear the form input fields
  document.getElementById("x-coord").value = "";
  document.getElementById("y-coord").value = "";

  drawPoints();
}

//* Function to draw the points on the canvas
function drawPoints() {
  //! Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //TODO :  Draw each point as a circle on the canvas

  for (let i = 0; i < points.length; i++) {
    context.beginPath();
    context.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fill();
  }
}

function comparePoints(a, b) {
  if (a.x < b.x) {
    return -1;
  } else if (a.x > b.x) {
    return 1;
  } else if (a.y < b.y) {
    return -1;
  } else if (a.y > b.y) {
    return 1;
  } else {
    return 0;
  }
}

function isLeft(p0, p1, p2) {
  return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
}

function isLeftTurn(p1, p2, p3) {
  return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y) >= 0;
}

function getAngle(p1, p2) {
  let deltaX = p2.x - p1.x;
  let deltaY = p2.y - p1.y;
  let angle = Math.atan2(deltaY, deltaX);
  return angle;
}

function getDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

//* Function to compute and draw the convex hull on the canvas
function computeConvexHull() {
  if (points.length < 3) {
    return;
  }

  let hull = [];

  //! Find the point with the smallest y-coordinate (and the one with the smallest x-coordinate if there are ties)
  let minYPoint = points[0];
  for (let i = 1; i < points.length; i++) {
    let p = points[i];
    if (p.y < minYPoint.y || (p.y === minYPoint.y && p.x < minYPoint.x)) {
      minYPoint = p;
    }
  }

  //* Sort the points by their angle with the minYPoint
  let sortedPoints = points.slice();
  sortedPoints.sort(function (a, b) {
    let angleA = getAngle(minYPoint, a);
    let angleB = getAngle(minYPoint, b);
    if (angleA < angleB) {
      return -1;
    } else if (angleA > angleB) {
      return 1;
    } else {
      //TODO : If two points have the same angle with the minYPoint, put the one that's closer first
      return getDistance(minYPoint, a) - getDistance(minYPoint, b);
    }
  });

  hull.push(sortedPoints[0]);
  hull.push(sortedPoints[1]);

  //! Add the rest of the points to the hull
  for (let i = 2; i < sortedPoints.length; i++) {
    let p = sortedPoints[i];

    while (
      hull.length >= 2 &&
      !isLeftTurn(hull[hull.length - 2], hull[hull.length - 1], p)
    ) {
      hull.pop();
    }

    hull.push(p);
  }

  //TODO :  Draw the convex hull
  context.fillStyle = "rgba(255, 0, 0, 0.7)";
  context.beginPath();
  context.moveTo(hull[0].x, hull[0].y);
  for (let i = 1; i < hull.length; i++) {
    context.lineTo(hull[i].x, hull[i].y);
  }
  context.closePath();
  context.strokeStyle = "#000000";
  context.stroke();
  context.fill();
}

//* Event listener to the "Add Point" button
const addPointButton = document.getElementById("add-point");
addPointButton.addEventListener("click", addPoint);

//* Event listener to the "Compute Convex Hull" button
const computeConvexHullButton = document.getElementById("compute-convex-hull");
computeConvexHullButton.addEventListener("click", computeConvexHull);
