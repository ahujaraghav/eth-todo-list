import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EthereumService } from './services/blockchain/ethereum';
import { getTasksAction, createTaskAction } from './store/actions/todo';

function App() {
  const [accountNumber, updateAccountNumber] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskValue, setNewTaskValue] = useState('');

  useEffect(() => {
    async function load() {
      await EthereumService.load();
      dispatch(getTasksAction());
      setIsLoading(false);
    }
    load();
  }, []);

  const tasks = useSelector((state) => state.todo.tasks);
  const dispatch = useDispatch();

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
            dispatch(createTaskAction(newTaskValue));
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
