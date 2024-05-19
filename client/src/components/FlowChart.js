import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import ColdEmailNode from './NodeTypes/ColdEmailNode';
import WaitDelayNode from './NodeTypes/WaitDelayNode';
import LeadSourceNode from './NodeTypes/LeadSourceNode';
import 'reactflow/dist/style.css';
import './FlowChart.css';

const initialNodes = [
  {
    id: '1',
    type: 'leadSourceNode',
    data: { label: 'Lead Source' },
    position: { x: 250, y: 5 },
  },
];

const nodeTypes = {
  coldEmailNode: ColdEmailNode,
  waitDelayNode: WaitDelayNode,
  leadSourceNode: LeadSourceNode,
};

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [emailStatus, setEmailStatus] = useState([]);

  const [menu, setMenu] = useState(null);
  const reactFlowWrapper = useRef(null);

  const fetchEmailStatus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/emails');
      const data = await response.json();
      setEmailStatus(data);
    } catch (error) {
      console.error('Error fetching email status:', error);
    }
  }, []);

  useEffect(() => {
    fetchEmailStatus();
    const interval = setInterval(fetchEmailStatus, 60000); // Fetch status every 60 seconds
    console.log(emailStatus);
    return () => clearInterval(interval);
  }, [fetchEmailStatus]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((rfi) => setReactFlowInstance(rfi), []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data: {
          label: `${type} node`,
          delay: type === 'waitDelayNode' ? 5 : undefined, // Default delay for demonstration
          onChange: (id, newDelay) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, delay: newDelay } } : node
              )
            );
          },
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      const rect = reactFlowWrapper.current.getBoundingClientRect();
      setMenu({
        top: event.clientY - rect.top,
        left: event.clientX - rect.left,
        nodeId: node.id,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), []);
  

  const saveFlowchart = async () => {
    if (!reactFlowInstance) return;

    try {
      setSaving(true);
      const flowchartData = reactFlowInstance.toObject();

      // Schedule emails based on the flowchart data
      for (const node of flowchartData.nodes) {
        if (node.type === 'waitDelayNode') {
          await fetch('http://localhost:5000/api/schedule', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: '20ucc125@lnmiit.ac.in',
              subject: 'Scheduled Email 2.0',
              body: 'This is a scheduled email based on the flowchart.',
              delay: node.data.delay || 0, // Default to 0 if no delay
            }),
          });
        }
      }

      alert('Flowchart saved and emails scheduled successfully!');
    } catch (error) {
      console.error('Error saving flowchart:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="dndflow">
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: 600 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
          {menu && (
            <div
              className="context-menu"
              style={{ top: menu.top, left: menu.left }}
            >
              <button onClick={() => setNodes((nds) => nds.filter((node) => node.id !== menu.nodeId))}>
                Delete Node
              </button>
            </div>
          )}
          <button onClick={saveFlowchart} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Flowchart'}
          </button>
        </div>
        <aside>
          <div className="description">You can drag these nodes to the pane on the left.</div>
          <div
            className="dndnode input"
            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'coldEmailNode')}
            draggable
          >
            Cold Email Node
          </div>
          <div
            className="dndnode"
            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'waitDelayNode')}
            draggable
          >
            Wait Delay Node
          </div>
          <div
            className="dndnode"
            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'leadSourceNode')}
            draggable
          >
            Lead Source Node
          </div>
        </aside>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;
