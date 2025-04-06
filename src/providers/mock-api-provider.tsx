import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setupMockInterceptors } from '../services/mockApiService';

// Create a context to manage the mock API state
interface MockApiContextType {
  useMockApi: boolean;
  toggleMockApi: () => void;
}

const MockApiContext = createContext<MockApiContextType | undefined>(undefined);

// Custom hook to access the mock API context
export const useMockApi = () => {
  const context = useContext(MockApiContext);
  
  if (context === undefined) {
    throw new Error('useMockApi must be used within a MockApiProvider');
  }
  
  return context;
};

// Provider component
interface MockApiProviderProps {
  children: ReactNode;
  initialValue?: boolean;
}

/**
 * Provider component that wraps the application to provide mock API functionality
 * This allows for testing and demonstration without a backend
 */
const MockApiProvider: React.FC<MockApiProviderProps> = ({ 
  children, 
  initialValue = true 
}) => {
  const [useMockApi, setUseMockApi] = useState<boolean>(() => {
    // Initialize from localStorage if available, otherwise use initialValue prop
    const storedValue = localStorage.getItem('use_mock_api');
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    return initialValue;
  });
  
  // Setup interceptors on component mount
  useEffect(() => {
    // Set up the mock API interceptors when the component mounts
    const cleanupInterceptors = setupMockInterceptors();
    
    // Clean up the interceptors when the component unmounts
    return () => {
      cleanupInterceptors();
    };
  }, []);
  
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

  return (
    <MockApiContext.Provider value={{ useMockApi, toggleMockApi }}>
      {children}
    </MockApiContext.Provider>
  );
};

export default MockApiProvider; 