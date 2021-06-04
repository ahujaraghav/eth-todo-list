import { applyMiddleware, compose, createStore } from 'redux';
import { rootReducer } from './reducers/root';
import thunk from 'redux-thunk';

export function configureStore() {
  const middleware = applyMiddleware(thunk);
  const store = createStore(rootReducer, middleware);

  return store;
}
