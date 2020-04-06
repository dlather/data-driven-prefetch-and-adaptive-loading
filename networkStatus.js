let unsupported;
export default function useNetworkStatus(initialEffectiveConnectionType){
  if(initialEffectiveConnectionType === undefined){
    throw("Initial Effective connetion required")
  }
  if (typeof navigator !== 'undefined' && 'connection' in navigator && 'effectiveType' in navigator.connection) {
    unsupported = false;
  } else {
    unsupported = true;
  }
  const initialNetworkStatus = {
    unsupported,
    effectiveConnectionType: unsupported
      ? initialEffectiveConnectionType
      : navigator.connection.effectiveType
  };
  return initialNetworkStatus
}