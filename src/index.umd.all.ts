import { Quadtree } from './Quadtree';
import { Rectangle } from './Rectangle';
import { Circle } from './Circle';
import { Line } from './Line';

//This file exports all classes and utility functions
//UMD/browser: export everything under a 'Quadtree' namespace
//@see https://github.com/rollup/rollup/issues/1044#issuecomment-253214545
export default Object.assign(Quadtree, {
    Rectangle,
    Circle,
    Line,
});