// Plugin that updates the status of the transactions with only a click :3

// This is the fuction that updates the transactions
function updateTxStatus(){
df.contractsAPI.contractCaller.queue.invocationIntervalMs=100; 
}

// This is the function that shows the transactions in the console
function unconfirmed(){
console.log('Moves : ' , df.getUnconfirmedMoves().length)
console.log('Upgrades : ' , df.getUnconfirmedUpgrades().length)
console.log('Wormhole : ' , df.getUnconfirmedWormholeActivations().length) 
}

// showTransactions is the text inside the plugin
let showTransactions = document.createElement('div');

// This is a function that updates the text of showTransactions to the current unconfirmed transactions
function updateTx(){
showTransactions.innerText = 'Moves :  ' + df.getUnconfirmedMoves().length + '\nUpgrades :  ' +     df.getUnconfirmedUpgrades().length + '\nWormhole :  ' + df.getUnconfirmedWormholeActivations().length;
}

// And this is the design of the plugin from the user perspective
class Plugin {

    constructor() { }

    async render(div) {
        // This button update the status of the transactions
        const updateTxStatusButton = document.createElement('button');
        updateTxStatusButton.innerText = 'Update';
        updateTxStatusButton.addEventListener('click', () => {
            updateTxStatus();
        });
        // This button refresh the unconfirmed transactions
        const unconfirmedButton = document.createElement('button');
        unconfirmedButton.innerText = 'Transaction';
        unconfirmedButton.addEventListener('click', () => {
            unconfirmed();
            updateTx();
        });
        
        div.appendChild(updateTxStatusButton);
        div.appendChild(unconfirmedButton);
        div.appendChild(showTransactions);
    }

    destroy() { }
}

export default Plugin;
