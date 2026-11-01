import { useState } from "react";

import type { StructNode } from "./api";

import styles from "./StructTree.module.css";

interface StructTreeProps {
  nodes: StructNode[];
  selectedId: string | null;
  onSelect: (node: StructNode) => void;
}

export function StructTree({ nodes, selectedId, onSelect }: StructTreeProps) {
  return (
    <ul className={styles["tree"]}>
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </ul>
  );
}

interface TreeItemProps {
  node: StructNode;
  selectedId: string | null;
  onSelect: (node: StructNode) => void;
}

function TreeItem({ node, selectedId, onSelect }: TreeItemProps) {
  const [expanded, setExpanded] = useState(true);
  const children = node.children ?? [];

  const rowClass =
    selectedId === node.id
      ? `${styles["tree__row"]} ${styles["tree__row--selected"]}`
      : styles["tree__row"];

  return (
    <li>
      <div className={rowClass}>
        <button
          type="button"
          className={styles["tree__toggle"]}
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? "Свернуть" : "Развернуть"}
          aria-expanded={children.length > 0 ? expanded : undefined}
          disabled={children.length === 0}
        >
          <span className="material-symbols-outlined">
            {children.length > 0 ? (expanded ? "expand_more" : "chevron_right") : "remove"}
          </span>
        </button>
        <button type="button" className={styles["tree__label"]} onClick={() => onSelect(node)}>
          <span className="material-symbols-outlined">
            {children.length > 0 ? "folder" : "article"}
          </span>
          <span className={styles["tree__name"]}>{node.name}</span>
        </button>
      </div>
      {children.length > 0 && expanded && (
        <ul className={styles["tree__children"]}>
          {children.map((child) => (
            <TreeItem key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
}
