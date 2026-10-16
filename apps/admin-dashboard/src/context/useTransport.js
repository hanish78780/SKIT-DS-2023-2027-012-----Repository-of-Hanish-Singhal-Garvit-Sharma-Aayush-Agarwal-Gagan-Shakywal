import { useContext } from 'react';
import TransportContext from './TransportContext';

export const useTransport = () => useContext(TransportContext);
