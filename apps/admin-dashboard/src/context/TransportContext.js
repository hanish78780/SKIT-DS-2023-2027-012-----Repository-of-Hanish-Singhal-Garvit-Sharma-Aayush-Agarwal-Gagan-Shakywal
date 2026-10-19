import { createContext, useContext } from 'react';

const TransportContext = createContext();

export const useTransport = () => useContext(TransportContext);
export default TransportContext;
