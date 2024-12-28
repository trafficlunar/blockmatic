export function versionToNumber(version: string) {
	const parts = version.split(".").map(Number);
	return parts[0] * 1000 + (parts[1] || 0) * 10 + (parts[2] || 0);
}

export function numberToVersion(version: number) {
	const major = Math.floor(version / 1000);
	const minor = version % 1000; // Remainder becomes the minor and patch version

	// If minor is a multiple of 10, it's just minor with no patch
	if (minor % 10 === 0) {
		return `${major}.${Math.floor(minor / 10)}`;
	}

	// Otherwise, split into minor and patch
	const patch = minor % 10;
	return `${major}.${Math.floor(minor / 10)}.${patch}`;
}
