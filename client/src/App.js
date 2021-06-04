import { useEffect, useState } from 'react';
import { EthereumService } from './services/blockchain/ethereum';

function App() {
  const [accountNumber, updateAccountNumber] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskValue, setNewTaskValue] = useState('');
  const [tasks, setTasks] = useState([]);

  async function getTasks() {
    const tasks = await EthereumService.getTasks();
    setTasks(tasks);
  }

  useEffect(() => {
    async function load() {
      await EthereumService.load();
      await getTasks();
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="App">
      {isLoading && <h6>Loading...</h6>}
      {accountNumber && <h6>{accountNumber}</h6>}
      {tasks && tasks.map((task) => <div>{task.content}</div>)}
      {isLoading ? (
        <></>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await EthereumService.createTask(newTaskValue);
            getTasks();
            setNewTaskValue('');
          }}
        >
          <input
            value={newTaskValue}
            onChange={(e) => setNewTaskValue(e.target.value)}
          />
        </form>
      )}
    </div>
  );
}

export default App;
