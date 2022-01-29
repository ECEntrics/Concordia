import React from 'react';

const targetBlank = () => ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);

export default targetBlank;
