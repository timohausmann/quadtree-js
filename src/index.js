// UMD Exports 
// this file is the webpack entry file

import Quadtree from './Quadtree';
import Rectangle from './Rectangle';
import Circle from './Circle';
import Line from './Line';

const exports = Quadtree;
exports.Rectangle = Rectangle;
exports.Circle = Circle;
exports.Line = Line;

export default exports;