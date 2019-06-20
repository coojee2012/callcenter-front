import { message } from 'antd';
import { createLogger } from 'redux-logger';

const logger = createLogger({
  level: { prevState: 'log', action: 'log', nextState: 'log', error: 'log' },
  collapsed: true,
  diff: true,
  predicate: (getState, action) => {
    return !action.type.includes('@@');
  },
});

export function config() {
  if (process.env.NODE_ENV !== 'development') {
    return {};
  }
  return {
    onError(err) {
      err.preventDefault();
      message.error(err.message);
    },
    onAction: [logger],
  };
}
