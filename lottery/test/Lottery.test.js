const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {

    it('Deploys the Lottery contarct', () => {

        assert.ok(lottery.options.address);
    });

    it('Enters the Lottery', async () => {

        await lottery.methods.enterLottery().send({

            from: accounts[0],
            value: web3.utils.toWei('0.03', 'ether')
        });

        await lottery.methods.enterLottery().send({

            from: accounts[1],
            value: web3.utils.toWei('0.03', 'ether')
        });

        await lottery.methods.enterLottery().send({

            from: accounts[2],
            value: web3.utils.toWei('0.03', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({

            from: accounts[0]
        });

        assert.strictEqual(accounts[0], accounts[0]);
        assert.strictEqual(accounts[1], accounts[1]);
        assert.strictEqual(accounts[2], accounts[2]);
        assert.strictEqual(3, players.length);
    });

    it('Requires a min. no. of ether to enter the lottery', async () => {

        try {
            await lottery.methods.enterLottery().send({

                from: accounts[0],
                value: 10

            });
            assert(false);

        } catch (error) {

            assert(error);
        }

    });

    it('Picks a winner: Only Manager', async () => {
        try {
            await lottery.methods.pickWinner().send({

                from: accounts[1]
            });
            assert(false);
        }
        catch (error) {

            assert(error);
        }
    });

    it('Sends ETH to the winner and resets the Lottery', async () => {

        await lottery.methods.enterLottery().send({

            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({

            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });

    it('Checks if the lottery is reset', async () => {

        await lottery.methods.enterLottery().send({

            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({

            from: accounts[0]
        });

        const players = await lottery.methods.getPlayers().call({

            from: accounts[0]
        });

        assert.strictEqual(0, players.length);
    });

    it('Checks if the lottery balance is 0', async () => {

        await lottery.methods.enterLottery().send({

            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        await lottery.methods.pickWinner().send({

            from: accounts[0]
        });

        const lotteryBalance = await web3.eth.getBalance(lottery.options.address);
        assert.strictEqual('0', lotteryBalance);
        
    });
});
