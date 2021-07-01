const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const mnemonicPhase = 'cupboard noodle people often parent always give snack march rotate piece cinnamon';

let provider = new HDWalletProvider({

    mnemonic: mnemonicPhase,
    providerOrUrl: 'https://rinkeby.infura.io/v3/717bf019dabe406495afdfecca0708d5'
});

const web3 = new Web3(provider);

const deploy = async () => {

    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account: ' + accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    console.log(interface);
    console.log('Contract deployed to:' + result.options.address);
};

deploy();
