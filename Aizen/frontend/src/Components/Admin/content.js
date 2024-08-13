// src/components/Content.js
import React from 'react';

const Content = ({ children }) => {
    return (
        <main className="flex-1 p-6">
            {children}
        </main>
    );
};

export default Content;
