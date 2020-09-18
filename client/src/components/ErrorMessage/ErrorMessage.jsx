import React, {memo} from 'react';
import classes from './errorMessage.module.css';

const ErrorMessage = memo(({error, click = null}) => {
  return (
    <div className={classes.error}>
      {error}
      {
        click && <button onClick={click} className={classes.errorCloseBtn}>
          X
        </button>
      }
    </div>
  );
});

export default ErrorMessage;
