// Plugin that updates the status of the transactions with only a click :3

// This is the fuction that updates the transactions
function updateTxStatus(){
df.contractsAPI.contractCaller.queue.invocationIntervalMs=100; 
}

// And this is the design of the plugin from the user perspective
class Plugin {

    constructor() { }

    async render(div) {
        div.style.width = '90px';
        div.style.height = '90px';
        const myButton = document.createElement('button');
        myButton.innerText = 'Update';
        myButton.addEventListener('click', () => {
            updateTxStatus();
        });
        div.appendChild(myButton);
    }
    
    destroy() { }
}

export default Plugin;
