import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define context types
interface MockApiContextType {
  useMockApi: boolean;
  toggleMockApi: () => void;
}

// Create context with default values
const MockApiContext = createContext<MockApiContextType>({
  useMockApi: true,
  toggleMockApi: () => {}
});

// Hook to use the mock API context
export const useMockApi = () => useContext(MockApiContext);

interface MockApiProviderProps {
  children: ReactNode;
  initialValue?: boolean;
}

/**
 * Provider component that wraps the application to provide mock API functionality
 * This allows for testing and demonstration without a backend
 */
export const MockApiProvider: React.FC<MockApiProviderProps> = ({
  children,
  initialValue = true
}) => {
  // Initialize from localStorage if available, otherwise use initialValue prop
  const [useMockApi, setUseMockApi] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('use_mock_api');
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    return initialValue;
  });

  // Toggle between mock and real API
  const toggleMockApi = () => {
    setUseMockApi(prev => !prev);
  };

  // Persist to localStorage when changed
  useEffect(() => {
    localStorage.setItem('use_mock_api', useMockApi.toString());
    
    // Show console message about API mode
    if (useMockApi) {
      console.info('%c[MOCK API MODE ENABLED]', 'background: #ffa500; color: #000; padding: 2px 5px; border-radius: 3px;', 'Using simulated API responses for development');
    } else {
      console.info('%c[REAL API MODE ENABLED]', 'background: #4caf50; color: #fff; padding: 2px 5px; border-radius: 3px;', 'Using real API endpoints');
    }
  }, [useMockApi]);

  // Context value
  const value = {
    useMockApi,
    toggleMockApi
  };

  return (
    <MockApiContext.Provider value={value}>
      {children}
    </MockApiContext.Provider>
  );
};

export default MockApiProvider; 