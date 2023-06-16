"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4050;
app.get('/', (req, res) => {
    res.send('Hello, this is Express + TypeScript');
});
app.get('/Hello', (req, res) => {
    res.send('Hello World !');
});
app.listen(port, () => {
    var _a, _b;
    // only log this information in development.
    if (((_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) !== "production") {
        console.log(((_b = process.env) === null || _b === void 0 ? void 0 : _b.NODE_ENV) || 'Not in PRODUCTION');
        console.log(`[Server]: I am running at https://localhost:${port}`);
    }
});
//# sourceMappingURL=server.js.map