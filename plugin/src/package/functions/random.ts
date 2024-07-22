export function randomVector3(minVector: Vector3, maxVector: Vector3): Vector3 {
	const x = math.random(minVector.X, maxVector.X);
	const y = math.random(minVector.Y, maxVector.Y);
	const z = math.random(minVector.Z, maxVector.Z);
	return new Vector3(x, y, z);
}
