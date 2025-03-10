import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import MindMapNode from "./MindMapNode";
import {
  MindMapNode as MindMapNodeType,
  MindMapEdge,
  MindMapData,
} from "../types";

const nodeTypes: NodeTypes = {
  mindmap: MindMapNode,
};

// ノードの色を定義
const nodeColors = [
  "#FF6B6B", // 赤
  "#4ECDC4", // ターコイズ
  "#FFD166", // 黄色
  "#6A0572", // 紫
  "#1A535C", // 深い青緑
];

// エッジの色を定義
const edgeColors = [
  "#FF6B6B", // 赤
  "#4ECDC4", // ターコイズ
  "#FFD166", // 黄色
  "#6A0572", // 紫
  "#1A535C", // 深い青緑
];

const initialNodes: MindMapNodeType[] = [
  {
    id: "1",
    type: "mindmap",
    data: { label: "マインドマップとは？", color: "#FF8A65" },
    position: { x: 250, y: 250 },
  },
];

const MindMap = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { project } = useReactFlow();

  // ノードを選択したときの処理
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // エッジを追加する処理
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // ランダムな色を選択
      const colorIndex = Math.floor(Math.random() * edgeColors.length);
      const edgeWithColor = {
        ...params,
        data: { color: edgeColors[colorIndex] },
        style: { stroke: edgeColors[colorIndex], strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edgeWithColor, eds));
    },
    [setEdges]
  );

  // 新しいノードを追加する処理
  const addChildNode = () => {
    if (!selectedNode) return;

    const parentNode = nodes.find((n) => n.id === selectedNode.id);
    if (!parentNode) return;

    // ランダムな色を選択
    const colorIndex = Math.floor(Math.random() * nodeColors.length);
    const newNodeColor = nodeColors[colorIndex];

    // 新しいノードの位置を計算（親ノードの右側に配置）
    const newNodeId = uuidv4();
    const newNode: MindMapNodeType = {
      id: newNodeId,
      type: "mindmap",
      data: { label: "", color: newNodeColor }, // 空のラベルで作成
      position: {
        x: parentNode.position.x + 250,
        y: parentNode.position.y + (Math.random() - 0.5) * 100,
      },
    };

    // 新しいエッジを作成
    const newEdge: MindMapEdge = {
      id: uuidv4(),
      source: selectedNode.id,
      target: newNodeId,
      data: { color: edgeColors[colorIndex] },
      style: { stroke: edgeColors[colorIndex], strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  // 選択したノードを削除する処理
  const deleteSelectedNode = () => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  };

  // マインドマップのデータをエクスポートする処理
  const exportMindMap = () => {
    const data: MindMapData = { nodes, edges };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "mindmap.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // マインドマップのデータをインポートする処理
  const importMindMap = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files?.[0] as File, "UTF-8");
    fileReader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData: MindMapData = JSON.parse(content);
        setNodes(parsedData.nodes);
        setEdges(parsedData.edges);
      } catch (error) {
        console.error("Failed to parse imported file:", error);
        alert("インポートに失敗しました。ファイル形式を確認してください。");
      }
    };
  };

  return (
    <div className="mindmap-container">
      <div className="controls-panel">
        <button onClick={addChildNode} disabled={!selectedNode}>
          子ノード追加
        </button>
        <button onClick={deleteSelectedNode} disabled={!selectedNode}>
          ノード削除
        </button>
        <button onClick={exportMindMap}>エクスポート</button>
        <label className="import-button">
          インポート
          <input
            type="file"
            accept=".json"
            onChange={importMindMap}
            style={{ display: "none" }}
          />
        </label>
        <div className="help-text">
          <p>ヒント: ノードをダブルクリックして直接編集できます</p>
        </div>
      </div>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background color="transparent" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

const MindMapWithProvider = () => {
  return (
    <ReactFlowProvider>
      <MindMap />
    </ReactFlowProvider>
  );
};

export default MindMapWithProvider;
