"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBar = createBar;
const Emoji_1 = require("../../Enums/Emoji");
const { Middle_0, Left_0, Right_0, Middle_1, Left_1, Right_1 } = Emoji_1.Emoji;
function createBar(currentValue, maxValue) {
    const barLength = 14;
    const unitValue = maxValue / barLength;
    const filledSections = Math.floor(currentValue / unitValue);
    const emptySections = Math.max(barLength - filledSections, 0);
    const leftMarker = currentValue >= unitValue ? Left_1 : Left_0;
    const middleMarker = Middle_1;
    const rightMarker = filledSections === barLength ? Right_1 : Right_0;
    return `${leftMarker}${middleMarker.repeat(filledSections)}${Middle_0.repeat(emptySections)}${rightMarker}`;
}
