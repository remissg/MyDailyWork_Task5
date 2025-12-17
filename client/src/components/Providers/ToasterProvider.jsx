import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                style: {
                    background: '#334155',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '14px',
                },
                success: {
                    iconTheme: {
                        primary: '#10b981',
                        secondary: 'white',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
};

export default ToasterProvider;
