import { createContext, useState } from 'react';

const defaultContext = {
  connectedBleDevice: null,
  setConnectedBleDevice: (device) => {}
};

export const DeviceContext = createContext(defaultContext);

export const DeviceContextProvider = props => {
  const setConnectedBleDevice = (device) => {
    setState({ ...state, connectedBleDevice: device });
  };
  const initState = {
    ... defaultContext,
    setConnectedBleDevice: setConnectedBleDevice
  };
  const [state, setState] = useState(initState);

  return (
    <DeviceContext.Provider value={state}>
      {props.children}
    </DeviceContext.Provider>
  )
};