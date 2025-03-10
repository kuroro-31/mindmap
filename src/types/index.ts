import { NodeProps, EdgeProps } from 'reactflow';

export interface MindMapNodeData {
  label: string;
  color?: string;
}

export interface MindMapEdgeData {
  color?: string;
}

export interface MindMapNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: MindMapNodeData;
  style?: React.CSSProperties;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: MindMapEdgeData;
  style?: React.CSSProperties;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
} 