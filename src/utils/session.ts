// Generate and manage session IDs
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('vertex_session_id');
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('vertex_session_id', sessionId);
  }
  
  return sessionId;
};

export const resetSessionId = (): void => {
  sessionStorage.removeItem('vertex_session_id');
};