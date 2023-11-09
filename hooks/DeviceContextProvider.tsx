import { createContext, useState } from 'react';
import { Helmet, Sensor } from "../classes";

const defaultContext = {
  connectedBCDevice: null,
  connectedBLEDevice: null,
  setConnectedDevices: (d1, d2) => {}
};

export const DeviceContext = createContext(defaultContext);

export const DeviceContextProvider = props => {
  const setConnectedDevices = (d1, d2) => {
    setState({ ...state, 
      connectedBLEDevice: d1 ? new Sensor(d1) : d1,
      connectedBCDevice: d2 ? new Helmet(d2) : d2
    });
  }

  const initState = {
    ... defaultContext,
    setConnectedDevices: setConnectedDevices
  };

  const [state, setState] = useState(initState);

  return (
    <DeviceContext.Provider value={state}>
      {props.children}
    </DeviceContext.Provider>
  )
};