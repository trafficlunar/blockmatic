export function encodeVarint(number: number) {
	const result = [];
	while (number >= 0x80) {
		result.push((number & 0x7f) | 0x80); // Take 7 bits and set the MSB
		number >>>= 7; // Right shift by 7 bits (logical shift)
	}
	result.push(number); // Last byte without MSB set
	return new Uint8Array(result);
}
