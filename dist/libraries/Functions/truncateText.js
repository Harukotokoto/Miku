"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateText = truncateText;
function truncateText(text, maxLength = 49) {
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}
