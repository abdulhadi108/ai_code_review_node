import React from 'react';
import CodeEditor from './components/CodeEditor';

export default function App(){
  return (
    <div className="app">
      <header>
        <h1>AI-Assisted Code Review</h1>
      </header>
      <main>
        <CodeEditor />
      </main>
    </div>
  );
}
