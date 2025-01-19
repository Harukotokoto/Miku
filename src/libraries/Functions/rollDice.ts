export function rollDice(x: number, y: number) {
    const results = [];
    for (let i = 0; i < x; i++) {
        results.push(Math.floor(Math.random() * y) + 1);
    }
    return results;
}
