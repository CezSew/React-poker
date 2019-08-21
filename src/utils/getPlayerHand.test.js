import getPlayerHand from './getPlayerHand';

test('pair', () => {
    expect(getPlayerHand([[3, "d"], [4, "d"], [3, "s"], [8, "h"], [10, "s"]])[1]).toBe("Pair of 3's");
});

test('two pair', () => {
    expect(getPlayerHand([[3, "d"], [4, "d"], [3, "s"], [4, "h"], [10, "s"]])[1]).toBe("Two pairs of 4's and 3's");
    expect(getPlayerHand([[3, "d"], [4, "d"], [3, "s"], [4, "h"], [11, "s"], [11, "h"]])[1]).toBe("Two pairs of Jacks and 4's");
});

test('three of a kind', () => {
    expect(getPlayerHand([[3, "d"], [3, "h"], [3, "s"], [4, "h"], [10, "s"]])[1]).toBe("Three of a kind of 3's");
});

test('straight', () => {
    expect(getPlayerHand([[3, "d"], [4, "h"], [5, "s"], [6, "h"], [7, "s"]])[1]).toBe("Straight!");
    expect(getPlayerHand([[7, "d"], [4, "h"], [5, "s"], [6, "h"], [3, "s"]])[1]).toBe("Straight!");
    expect(getPlayerHand([[1, "d"], [2, "h"], [5, "s"], [4, "h"], [3, "s"]])[1]).toBe("Straight!");
    expect(getPlayerHand([[1, "d"], [4, "h"], [5, "s"], [2, "h"], [3, "s"]])[1]).toBe("Straight!");
    expect(getPlayerHand([[1, "d"], [12, "h"], [13, "s"], [11, "h"], [10, "s"]])[1]).toBe("Straight!");
    expect(getPlayerHand([[1, "h"], [12, "7"], [5, "c"], [8, "h"], [6, "c"], [4, "h"]])[1]).toBe("Straight!");
});

test('full house', () => {
    expect(getPlayerHand([[3, "d"], [3, "h"], [3, "s"], [4, "h"], [4, "s"]])[1]).toBe("Full house 3's and 4's");
    expect(getPlayerHand([[13, "d"], [13, "h"], [12, "s"], [13, "h"], [12, "s"]])[1]).toBe("Full house Kings and Queens");
    expect(getPlayerHand([[13, "d"], [13, "h"], [12, "s"], [13, "s"], [12, "d"], [8, "s"], [10, "s"]])[1]).toBe("Full house Kings and Queens");
    expect(getPlayerHand([[13, "d"], [13, "h"], [14, "s"], [13, "s"], [12, "d"], [14, "s"], [11, "s"]])[1]).toBe("Full house Kings and Aces");
});

test('quads', () => {
    expect(getPlayerHand([[3, "d"], [3, "h"], [3, "s"], [3, "h"], [10, "s"]])[1]).toBe("Quad 3's");
});