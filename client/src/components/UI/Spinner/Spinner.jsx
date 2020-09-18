import React, {memo} from 'react';

import './Spinner.css';
import Backdrop from "../Backdrop/Backdrop";

const Spinner = memo((props) => {
  return (
    <>
      <Backdrop show={props.show}/>
      <div className="loader">Loading...</div>
    </>
  );
});

export default Spinner;
