import React, {memo} from 'react';

import './Backdrop.css';

const Backdrop = memo((props) => (
  props.show ? <div onClick={props.onClick} className="Backdrop"/> : null
));

export default Backdrop;
