import { memo, FC, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { MindMapNodeData } from "../types";

interface MindMapNodeProps extends NodeProps {
  data: MindMapNodeData;
}

const MindMapNode: FC<MindMapNodeProps> = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const nodeStyle = {
    padding: "10px 20px",
    borderRadius: "30px",
    background: data.color || "#ffffff",
    border: selected ? "2px solid #1a192b" : "1px solid #ddd",
    minWidth: "100px",
    textAlign: "center" as const,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  // ノードをダブルクリックしたときに編集モードに切り替える
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // 編集完了時の処理
  const handleInputBlur = () => {
    setIsEditing(false);
    // 空でない場合のみラベルを更新
    if (labelText.trim()) {
      data.label = labelText;
    } else {
      setLabelText(data.label);
    }
  };

  // Enterキーを押したときに編集を完了する
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  // 編集モードになったらinputにフォーカスする
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <div style={nodeStyle} onDoubleClick={handleDoubleClick}>
      <Handle type="target" position={Position.Left} />
      {isEditing ? (
        <input
          ref={inputRef}
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          style={{
            background: "transparent",
            border: "none",
            textAlign: "center",
            width: "100%",
            outline: "none",
            fontSize: "14px",
          }}
        />
      ) : (
        <div>{data.label}</div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(MindMapNode);
