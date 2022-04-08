import mock from './scripts/mock.js';
import hierarchy from './scripts/hierarchy/index.js';
import Tree from './scripts/tree.js';

const boxWidth = 25;
const root = hierarchy(mock);
const treeLayout = new Tree;
const treeGenerated = treeLayout(root);

const rotateX = -0.33 * Zdog.TAU;
const rotateY = -0.5 * Zdog.TAU
const rotateZ = 0.4 * Zdog.TAU;

Zfont.init(Zdog);

let myFont = new Zdog.Font({
  src: 'assets/Roboto-Medium.ttf'
});

const illo = new Zdog.Illustration({
  // set canvas with selector
  element: '.zdog-canvas',
  translate: {x: -400, y: -300 },
  rotate: { x: rotateX, y: rotateY, z: rotateZ },
});

function LowPixel({ x, y }) {
  return new Zdog.Box({
    addTo: illo,
    translate: { x, y },
    stroke: false,
    color: '#607d8b',
    frontFace: '#a7c0cc',
    leftFace: '#607680',
    width: boxWidth / 2,
    height: boxWidth / 2,
    depth: boxWidth / 2,
  });
}

function HighPixel({ x, y }) {
  return new Zdog.Box({
    addTo: illo,
    translate: { x, y },
    stroke: false,
    color: '#fea016',
    frontFace: '#f2aa40',
    leftFace: '#ff9800',
    width: boxWidth / 1.5,
    height: boxWidth / 1.5,
    depth: boxWidth / 1.5,
  });
}

function CriticalPixel({ x, y }) {
  return new Zdog.Box({
    addTo: illo,
    translate: { x, y },
    stroke: false,
    color: '#f44336',
    frontFace: '#f05449',
    leftFace: '#f22a1b',
    width: boxWidth,
    height: boxWidth,
    depth: boxWidth,
  });
}

function link(pixel, parentPixel, color = '#000') {
  new Zdog.Shape({
    addTo: pixel,
    path: [ 
      {x: 0, y: -boxWidth * 1.5},
      pixel.translate.copy().subtract({ x: 0, y: parentPixel.translate.y }).multiply({ x: 0, y: -0.7 }),
      pixel.translate.copy().subtract({ x: parentPixel.translate.x, y: parentPixel.translate.y }).multiply({ x: -1, y: -0.7 }),
      pixel.translate.copy().subtract({ x: parentPixel.translate.x, y: parentPixel.translate.y }).multiply({ x: -1, y: -0.9 }),
    ],
    stroke: 1,
    closed: false,
    color,
  });
};

function text(pixel, name) {
  new Zdog.Text({
    addTo: pixel,
    font: myFont,
    value: name,
    textAlign: 'center',
    textBaseline: 'middle',
    stroke: 0,
    fill: '#555',
    fontSize: boxWidth / 2.5,
    translate: { z: boxWidth / 2, x: boxWidth * 1.5, y: -boxWidth * 1.3 },
    rotate: { x: Zdog.TAU * -0.2, y: Zdog.TAU * 0.1, z: Zdog.TAU * 1.03 },
  });
};


function readTree(tree, ancestor = null, parentPixel) {
  const x = tree.x * boxWidth * 30;
  const y = tree.y * boxWidth * 30;

  const pixel = pixelMap(tree.data.severity, { x, y });
  text(pixel, tree.data.name);

  if (ancestor !== null) {
    link(pixel, parentPixel, colorMap(tree.data.severity));
  }

  tree.children?.forEach(subtree => {
    readTree(subtree, tree, pixel);
  });
};

readTree(treeGenerated, null);

// update & render
illo.updateRenderGraph();

function colorMap(severity) {
  if (severity === 'low') {
    return '#607d8b';
  } else if (severity === 'high') {
    return '#ff9800';
  } else if (severity === 'critical') {
    return '#f44336';
  }

  return '#000';
}

function pixelMap(severity, xY) {
  if (severity === 'low') {
    return LowPixel(xY);
  } else if (severity === 'high') {
    return HighPixel(xY);
  } else if (severity === 'critical') {
    return CriticalPixel(xY);
  }

  return LowPixel(xY);
}