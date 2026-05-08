import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';

const CallContext = createContext();

const initialState = {
  currentCall: null,
  agentStatus: 'offline',
  lead: null,
  script: '',
  queueStats: { waiting: 0, agentsOnline: 0 },
  transcript: []
};

function callReducer(state, action) {
  switch (action.type) {
    case 'CALL_STARTED':
      return { ...state, currentCall: action.payload, agentStatus: 'on-call' };
    case 'CALL_ENDED':
      return { ...state, currentCall: null, agentStatus: 'wrap-up', transcript: [] };
    case 'SET_LEAD':
      return { ...state, lead: action.payload };
    case 'SET_SCRIPT':
      return { ...state, script: action.payload };
    case 'SET_STATUS':
      return { ...state, agentStatus: action.payload };
    case 'SET_QUEUE_STATS':
      return { ...state, queueStats: action.payload };
    case 'ADD_TRANSCRIPT':
      return { ...state, transcript: [...state.transcript, action.payload] };
    case 'RESET':
      return { ...state, agentStatus: 'available', transcript: [] };
    default:
      return state;
  }
}

export function CallProvider({ children, agentId }) {
  const [state, dispatch] = useReducer(callReducer, initialState);

  useEffect(() => {
    if (!agentId) return;
    const socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3001', {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      socket.emit('agent:join', agentId);
    });

    socket.on('call:started', (call) => {
      dispatch({ type: 'CALL_STARTED', payload: call });
    });

    socket.on('call:ended', (call) => {
      dispatch({ type: 'CALL_ENDED', payload: call });
    });

    socket.on('queue:update', (stats) => {
      dispatch({ type: 'SET_QUEUE_STATS', payload: stats });
    });

    socket.on('vicidial:update', ({ lead }) => {
      dispatch({ type: 'SET_LEAD', payload: lead });
    });

    return () => socket.disconnect();
  }, [agentId]);

  return (
    <CallContext.Provider value={{ state, dispatch }}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  return useContext(CallContext);
}