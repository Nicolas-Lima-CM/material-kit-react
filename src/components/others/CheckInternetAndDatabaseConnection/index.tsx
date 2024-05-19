import React, { useEffect, useState } from 'react';
import { createApiUrl } from '../../../services/apiUrl';
import { toast } from 'react-toastify';

function CheckInternetAndDatabaseConnection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Check connection for the first time
    handleOnlineStatusChange();

    // Override the global fetch to handle offline situations
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const isDatabaseConnected = await checkDatabaseConnection();

      if (!isDatabaseConnected) {
        // Cancel the fetch operation when the database is offline
        toast.error('Sem conexão com o banco de dados!');
        console.error('Sem conexão com o banco de dados!');
        return Promise.reject(new Error('No database connection'));
      }

      if (!isOnline) {
        // Cancel the fetch operation when offline
        toast.error('Sem conexão com a Internet!');
        console.error('Sem conexão com a Internet!');
        return Promise.reject(new Error('No internet connection'));
      }
      return originalFetch(...args);
    };

    // Cleanup when dismounting the component
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      // Restore the original fetch method
      window.fetch = originalFetch;
    };
  }, [isOnline]);

  // Function to check if the database is connected
  const checkDatabaseConnection = async () => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = createApiUrl('checkDatabaseConnection.php');

      xhr.open('GET', url, true);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.connection);
        } else {
          reject(false);
        }
      };
      xhr.onerror = function () {
        toast.error('Sem conexão com o banco de dados!');
        console.error('Sem conexão com o banco de dados!');
        reject(false);
      };
      xhr.send();
    });
  };

  if (!isOnline) {
    return (
      <>
        <div id="alert-placeholder-no-internet">
          <div className="alert alert-danger mb-0">
            <strong>Sem conexão com a Internet!</strong>
          </div>
        </div>
      </>
    );
  }
}

export default CheckInternetAndDatabaseConnection;
