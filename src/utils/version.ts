// For Minecraft versions
// 12110 = 1.21.10
// 12109 = 1.21.9

export function versionToNumber(version: string): number {
	const [major, minor = 0, patch = 0] = version.split(".").map(Number);
	return major * 10000 + minor * 100 + patch;
}

export function numberToVersion(version: number): string {
	const major = Math.floor(version / 10000);
	const minor = Math.floor((version % 10000) / 100);
	const patch = version % 100;

	if (patch === 0) return `${major}.${minor}`;
	return `${major}.${minor}.${patch}`;
}
