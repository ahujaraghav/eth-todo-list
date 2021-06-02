const App = {
    contracts: {},
    load: async ()=>{
        console.log("loading accounts");
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
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
    },

    loadContract: async()=>{
        // Load compiled JSON of the contract.
        const todoListJson = await (await fetch('todoList.json')).json();
        const todoListContract = TruffleContract(todoListJson);
        todoListContract.setProvider(App.web3Provider);
        const todoList = await todoListContract.deployed();
        App.contracts.todoList = todoList;
    },

    render: async()=>{
        document.getElementById("account").textContent = App.account;
    
        const todoList = App.contracts.todoList;
        const taskCount = await todoList.taskCount();
 
        while(list.firstChild){
            list.removeChild(list.firstChild);
        }

        for(let i = 1; i <= taskCount; i++){
            const task  = await todoList.tasks(i);
            addTaskToList(task);
        }
    },

    createTask: async(content)=>{
        console.log(App.contracts.todoList);
        const todoList = App.contracts.todoList;
        const response = await todoList.createTask(content, {"from": App.account});
        const taskCount =  await App.contracts.todoList.taskCount();
        const task = await App.contracts.todoList.tasks(taskCount);
        addTaskToList(task);
    },

    completeTask: async(id)=>{
        const todoList = App.contracts.todoList;
        const response = await todoList.completeTask(id, {"from": App.account});
        const task = await App.contracts.todoList.tasks(id);
        addTaskToList(task);
    },

    uncompleteTask: async(id)=>{
        const todoList = App.contracts.todoList;
        const response = await todoList.uncompleteTask(id, {"from": App.account});
        const task = await App.contracts.todoList.tasks(id);
        addTaskToList(task);
    },
    
};


function addTaskToList(task){
    const list = document.getElementById("list");
    const checkbox = document.createElement("input");
    const listItem = document.createElement("li");
    const div = document.createElement("div");
    
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = task.completed;
    
    checkbox.onclick = (event)=>{
        checkbox.checked=!checkbox.checked;
        if(task.completed){
            App.uncompleteTask(task.id);
        } else {
            App.completeTask(task.id);
        }
    };

    div.setAttribute("style", "display: flex");
    div.setAttribute("id", task.id);
    
    listItem.textContent = task.content;
    div.appendChild(checkbox);
    div.appendChild(listItem);

    const oldNode = document.getElementById(task.id);
    if(oldNode){
        list.replaceChild(div,oldNode);
    }else {
        list.appendChild(div);
    }

    
}


function load(){
    window.onload = ()=>{
        console.log("window loaded");
        App.load();
        const addForm =  document.getElementById("add_form");
        addForm.onsubmit = (event)=>{
            event.preventDefault();
            const addInput =  document.getElementById("add_input");
            const value = addInput.value;
            if(!value){
                return;
            }
            console.log(value);
            App.createTask(value);
            addInput.value = "";
        }
    };
};

load();

