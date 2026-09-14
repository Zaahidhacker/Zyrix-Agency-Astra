import { Shape, Path, ExtrudeGeometry } from "three";
export function frameGeometry(detail: number) {
  const outer = 1.65,
    inner = 1.25;
  const s = new Shape();
  s.moveTo(-outer, -outer);
  s.lineTo(outer, -outer);
  s.lineTo(outer, outer);
  s.lineTo(-outer, outer);
  s.closePath();
  const hole = new Path();
  hole.moveTo(-inner, -inner);
  hole.lineTo(-inner, inner);
  hole.lineTo(inner, inner);
  hole.lineTo(inner, -inner);
  hole.closePath();
  s.holes.push(hole);
  const geometry = new ExtrudeGeometry(s, {
    depth: 0.11,
    bevelEnabled: true,
    bevelSegments: detail,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.045,
    curveSegments: detail,
  });
  geometry.center();
  return geometry;
}
