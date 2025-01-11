"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomEquation = generateRandomEquation;
function generateRandomEquation() {
    const operators1 = ['+', '-'];
    const operators2 = ['*', '/'];
    // 1から10までのランダムな整数を生成
    const randomInt = () => Math.floor(Math.random() * 10) + 1;
    // ランダムな演算子を選択
    const randomOperator1 = operators1[Math.floor(Math.random() * operators1.length)];
    const randomOperator2 = operators2[Math.floor(Math.random() * operators2.length)];
    // 値を生成
    const y = randomInt();
    const z = randomInt();
    const a = randomInt();
    // 問題と答えを計算
    let question;
    let answer;
    if (randomOperator2 === '/' && a !== 0) {
        const adjustedZ = z * a; // 整数結果のためにzを調整
        question = `x = ${y} ${randomOperator1} ${adjustedZ} ${randomOperator2} ${a}`;
        answer =
            randomOperator1 === '+' ? y + adjustedZ / a : y - adjustedZ / a;
    }
    else {
        question = `x = ${y} ${randomOperator1} ${z} ${randomOperator2} ${a}`;
        answer =
            randomOperator1 === '+'
                ? y + (randomOperator2 === '*' ? z * a : z / a)
                : y - (randomOperator2 === '*' ? z * a : z / a);
    }
    return { question, answer };
}
