import React from 'react';
import { createRoot } from 'react-dom/client';
import WordPressPosts from '../components/WordPressPosts';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('wordpress-posts');
  if (container) {
    const root = createRoot(container);
    root.render(<WordPressPosts />);
  }
}); 