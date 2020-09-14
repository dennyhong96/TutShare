import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers";

const middlewares = [reduxThunk];

export default process.env.NODE_ENV === "production"
  ? createStore(rootReducer, applyMiddleware(...middlewares))
  : process.env.NODE_ENV === "development" &&
    // User devtools in development
    createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(...middlewares))
    );
