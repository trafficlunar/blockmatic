export function encode(number: number): Uint8Array {
	const result = [];
	while (number >= 0x80) {
		// Take 7 bits and set the MSB
		result.push((number & 0x7f) | 0x80);

		// Right shift by 7 bits (logical shift)
		number >>>= 7;
	}

	// Last byte without MSB set
	result.push(number);
	return new Uint8Array(result);
}

export function decode(buffer: Uint8Array, offset: number): { value: number; bytesRead: number } {
	let value = 0;
	let position = 0;
	let byte: number;

	do {
		if (position > 35) {
			throw new Error("VarInt is too big");
		}

		// Read the current byte
		byte = buffer[offset++];

		// Extract the lower 7 bits of the byte and shift them to the correct position
		value |= (byte & 0x7f) << (position * 7);

		// Increment the position for the next byte
		position++;
	} while ((byte & 0x80) !== 0); // Continue if the most significant bit (MSB) is set

	return { value, bytesRead: position };
}
