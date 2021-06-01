const App = {
    load: async ()=>{
        console.log("loading accounts");
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
    },

    loadWeb3: async ()=>{
        // Modern dapp browsers, injected by Metamask.
        if(window.ethereum){
            // Web3 is JS library.
            web3 = new Web3(window.ethereum);
            App.web3Provider = web3.currentProvider;
            try {
                // Request account access if needed
                await window.ethereum.enable();

                web3.eth.sendTransaction({});
            } catch(Error){
                // User denied account access...
            }
            
        } 
        // Legacy dapp browsers...
        else if(window.web3){
            web3 = new Web3(web3.currentProvider);
            App.web3Provider = web3.currentProvider;
            web3.eth.sendTransaction({});
        } else {
            window.alert("Please connect an ethereum wallet.");
        }
    },

    loadAccount: async()=>{  
        App.account = (await web3.eth.getAccounts())[0];
        console.log(App.account);
    },

    loadContract: async()=>{
        // Load compiled JSON of the contract.
        const todoListJson = await (await fetch('todoList.json')).json();
        console.log(todoListJson);
    }
};

function load(){
    window.onload = ()=>{
        console.log("window loaded");
        App.load();
    };
};

load();

