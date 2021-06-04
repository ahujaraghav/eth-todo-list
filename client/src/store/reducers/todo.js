export function todoReducer(state = { tasks: [] }, action) {
  switch (action.type) {
    case 'GET_TASKS':
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
}
