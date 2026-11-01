import { useEffect, useState } from "react";

import { Splitter, StructTable, StructTree } from "~/features/struct/index";
import type { StructNode, StructRecord } from "~/features/struct/api";
import { fetchStructRecords, fetchStructTree } from "~/features/struct/api";

import styles from "./Struct.module.css";

export default function Struct() {
  const [nodes, setNodes] = useState<StructNode[]>([]);
  const [selected, setSelected] = useState<StructNode | null>(null);
  const [records, setRecords] = useState<StructRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStructTree().then((tree) => {
      if (cancelled) {
        return;
      }
      setNodes(tree);
      const first = tree[0];
      if (first) {
        setSelected(first);
        setLoading(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) {
      return;
    }
    let cancelled = false;
    fetchStructRecords(selected.id).then((rows) => {
      if (cancelled) {
        return;
      }
      setRecords(rows);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const handleSelect = (node: StructNode) => {
    setSelected(node);
    setRecords([]);
    setLoading(true);
  };

  return (
    <div className={styles["struct"]}>
      <Splitter
        left={<StructTree nodes={nodes} selectedId={selected?.id ?? null} onSelect={handleSelect} />}
        right={<StructTable title={selected?.name} rows={records} loading={loading} />}
      />
    </div>
  );
}
