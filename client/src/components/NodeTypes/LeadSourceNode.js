import React from 'react';
import { Handle } from 'reactflow';

const LeadSourceNode = ({ data }) => {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <strong>{data.label}</strong>
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
};

export default LeadSourceNode;
