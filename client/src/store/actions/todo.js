import { EthereumService } from '../../services/blockchain/ethereum';

export function getTasksAction() {
  return async (dispatch) => {
    const tasks = await EthereumService.getTasks();
    dispatch({ type: 'GET_TASKS', payload: tasks });
  };
}

export function createTaskAction(content) {
  return async (dispatch) => {
    await EthereumService.createTask(content);
    dispatch(getTasksAction());
  };
}
