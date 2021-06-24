const path = require('path');
const fs = require('fs');
const solc = require('solc');

const messagePath = path.resolve(__dirname, 'contracts', 'message.sol');
const source = fs.readFileSync(messagePath, 'utf-8');

module.exports = solc.compile(source, 1).contracts[':Inbox'];
