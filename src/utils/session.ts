// Generate and manage session IDs
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('vertex_session_id');
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('vertex_session_id', sessionId);
  }
  
  return sessionId;
};

export const resetSessionId = (): void => {
  localStorage.removeItem('vertex_session_id');
};