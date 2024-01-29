// Based on "Bradley, J. V. Complete counterbalancing of immediate sequential effects in a Latin square design. J. Amer. Statist. Ass.,.1958, 53, 525-528. "
// Extended from https://damienmasson.com/tools/latin_square/

export const balancedLatinSquare = (array: string[], participantId: number): string[] => {
	let result: string[] = [];
	for (var i = 0, j = 0, h = 0; i < array.length; ++i) {
		var val = 0;
		if (i < 2 || i % 2 != 0) {
			val = j++;
		} else {
			val = array.length - h - 1;
			++h;
		}

		var idx = (val + participantId) % array.length;
		result.push(array[idx]);
	}

	if (array.length % 2 != 0 && participantId % 2 != 0) {
		result = result.reverse();
	}
	return result;
};
