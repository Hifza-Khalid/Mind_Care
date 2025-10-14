// @ts-nocheck
import { useError } from '@/hooks/useError';
import { ErrorMessage } from '@/components/ErrorMessage';

export const ExampleComponent = () => {
  const { error, showError, clearError, getErrorMessage } = useError();

  const handleApiCall = async () => {
    try {
      // Your API call here
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('API Error');
      }
      // Process response...
    } catch (err) {
      showError('network', 'fetchError', err.message);
    }
  };

  return (
    <div>
      {error.isError && (
        <ErrorMessage
          category={error.category}
          messageKey={error.messageKey}
          onRetry={handleApiCall}
          onClose={clearError}
          details={error.details}
        />
      )}
      <button onClick={handleApiCall}>Fetch Data</button>
    </div>
  );
};