import React from 'react';
import { useMockApi } from '@/providers/mock-api-provider';

/**
 * Component that displays an indicator when the application is using mock APIs
 * This is useful for development and demo purposes
 */
export const MockApiIndicator: React.FC = () => {
  const { useMockApi: isMockApiEnabled, toggleMockApi } = useMockApi();

  if (!isMockApiEnabled) return null;

  return (
    <div
      className="fixed bottom-2 right-2 z-50 bg-yellow-500 text-black text-xs font-bold py-1 px-2 rounded-lg shadow-md cursor-pointer flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
      onClick={toggleMockApi}
      title="Click to toggle between mock and real API"
    >
      <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
      DEMO MODE: Using Mock Data
    </div>
  );
};

export default MockApiIndicator; 