import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import todoListJson from "../../contracts/TodoList.json";

const EthereumService = {
    contracts: {},
    load: async ()=>{
        console.log("loading accounts");
        await EthereumService.loadWeb3();
        await EthereumService.loadAccount();
        await EthereumService.loadContract();
    },
  
    loadWeb3: async ()=>{
        // Modern dapp browsers, injected by Metamask.
        if(window.ethereum){
            // Web3 is JS library.
            window.web3 = new Web3(window.ethereum);
            EthereumService.web3Provider = window.web3.currentProvider;
            try {
                // Request account access if needed
                await window.ethereum.enable();
  
                window.web3.eth.sendTransaction({});
            } catch(Error){
                // User denied account access...
            }
            
        } 
        // Legacy dapp browsers...
        else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider);
            EthereumService.web3Provider = window.web3.currentProvider;
            window.web3.eth.sendTransaction({});
        } else {
            window.alert("Please connect an ethereum wallet.");
        }
    },
  
    loadAccount: async()=>{  
        EthereumService.account = (await window.web3.eth.getAccounts())[0];
    },
  
    loadContract: async()=>{
        //   Load compiled JSON of the contract.
        // const todoListJson = await (await fetch('../../contracts/todoList.json')).json();
        const todoListContract = TruffleContract(todoListJson);
        todoListContract.setProvider(EthereumService.web3Provider);
        const todoList = await todoListContract.deployed();
        EthereumService.contracts.todoList = todoList;
    },
    getTasks: async()=>{
        const todoList = EthereumService.contracts.todoList;
        const taskCount = await todoList.taskCount();
        const tasks = [];

        for(let i = 1; i <= taskCount; i++){
            const task  = await todoList.tasks(i);
            tasks.push(task);
        }
        return tasks;
    },
  
    createTask: async(content)=>{
        console.log("creating");
        const todoList = EthereumService.contracts.todoList;
        const response = await todoList.createTask(content, {"from": EthereumService.account});
        const taskCount =  await EthereumService.contracts.todoList.taskCount();
        const task = await EthereumService.contracts.todoList.tasks(taskCount);
    },
  
    completeTask: async(id)=>{
        const todoList = EthereumService.contracts.todoList;
        const response = await todoList.completeTask(id, {"from": EthereumService.account});
        const task = await EthereumService.contracts.todoList.tasks(id);
    },
  
    uncompleteTask: async(id)=>{
        const todoList = EthereumService.contracts.todoList;
        const response = await todoList.uncompleteTask(id, {"from": EthereumService.account});
        const task = await EthereumService.contracts.todoList.tasks(id);
    },
    
  };

  export {EthereumService};