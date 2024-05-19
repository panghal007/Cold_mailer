import React from 'react';
import { Handle } from 'reactflow';

const WaitDelayNode = ({ data , id}) => {
  
    const handleDelayChange = (event) => {
      const delay = event.target.value;
      if (data.onChange) {
        data.onChange(id, delay);
      }
    };
  return (
    <div className="node" style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
      <div>
        <label>Delay (minutes):</label>
        <input type="number" value={data.delay} onChange={handleDelayChange} />
      </div>
      
      <Handle type="target" position="top" style={{ background: '#555' }} />
    </div>
  );
};

export default WaitDelayNode;


// import React from 'react';
// import { Handle } from 'reactflow';

// const WaitDelayNode = ({ data, updateNode }) => {
//   const handleInputChange = (e) => {
//     const { value } = e.target;
//     updateNode({
//       ...data,
//       delay: parseInt(value, 10), // Convert value to integer
//     });
//   };

//   return (
//     <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
//       <strong>{data.label}</strong>
//       <br />
//       <label htmlFor="delay">Delay (minutes):</label>
//       <input
//         type="number"
//         id="delay"
//         name="delay"
//         value={data.delay || ''}
//         onChange={handleInputChange}
//       />
//       <Handle type="target" position="top" style={{ background: '#555' }} />

//       <Handle type="source" position="bottom" style={{ background: '#555' }} />
//     </div>
//   );
// };

// export default WaitDelayNode;
