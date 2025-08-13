import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CodeEditor(){
  const [code, setCode] = useState(`# Paste or write code here.\nprint('Hello from AI Code Review')`);
  const [output, setOutput] = useState(null);

  async function analyze(){
    setOutput('Analyzing...');
    try{
      const res = await axios.post(`${API}/review/analyze`, { code, language: 'python' });
      setOutput(res.data);
    }catch(err){
      setOutput({ error: err.message || String(err) });
    }
  }

  return (
    <div className="editor-wrap">
      <div className="panel">
        <Editor height="60vh" defaultLanguage="python" value={code} onChange={v=>setCode(v)} theme="vs-dark" />
        <div style={{marginTop:8, display:'flex', gap:8}}>
          <button className="primary" onClick={analyze}>Analyze</button>
        </div>
      </div>
      <div className="panel" style={{maxWidth:420}}>
        <h3>Results</h3>
        {output ? <pre className="output">{typeof output === 'string' ? output : JSON.stringify(output, null, 2)}</pre> : <p style={{color:'var(--muted)'}}>No results yet.</p>}
      </div>
    </div>
  );
}
