import getPlayerHand from './getPlayerHand';

test('pair', () => {
    expect(getPlayerHand([[3, "d"], [4, "d"], [3, "s"], [8, "h"], [10, "s"]])).toBe("Pair of 3's");
});

test('two pair', () => {
    expect(getPlayerHand([[3, "d"], [4, "d"], [3, "s"], [4, "h"], [10, "s"]])).toBe("Two pairs of 4's and 3's");
});

test('three of a kind', () => {
    expect(getPlayerHand([[3, "d"], [3, "h"], [3, "s"], [4, "h"], [10, "s"]])).toBe("Three of a kind of 3's");
});

test('straight', () => {
    expect(getPlayerHand([[3, "d"], [4, "h"], [5, "s"], [6, "h"], [7, "s"]])).toBe("Straight!");
});

test('straight', () => {
    expect(getPlayerHand([[7, "d"], [4, "h"], [5, "s"], [6, "h"], [3, "s"]])).toBe("Straight!");
});

test('straight wheel', () => {
    expect(getPlayerHand([[1, "d"], [4, "h"], [5, "s"], [2, "h"], [3, "s"]])).toBe("Straight!");
});

test('straight ace high', () => {
    expect(getPlayerHand([[1, "d"], [12, "h"], [13, "s"], [11, "h"], [10, "s"]])).toBe("Straight!");
});