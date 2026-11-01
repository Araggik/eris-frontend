import type { StructRecord, StructStatus } from "./api";

import styles from "./StructTable.module.css";

interface StructTableProps {
  title?: string;
  rows: StructRecord[];
  loading: boolean;
}

const STATUS_LABELS: Record<StructStatus, string> = {
  active: "Активен",
  draft: "Черновик",
  archived: "В архиве",
};

export function StructTable({ title, rows, loading }: StructTableProps) {
  return (
    <div className={styles["table"]}>
      <h2 className={styles["table__title"]}>{title ?? "Элементы структуры"}</h2>
      <table className={styles["table__grid"]}>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Тип</th>
            <th>Статус</th>
            <th className={styles["table__num"]}>Значение</th>
            <th>Обновлено</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className={styles["table__state"]}>
                Загрузка…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles["table__state"]}>
                Выберите узел в дереве слева
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.type}</td>
                <td>
                  <span className={`${styles["chip"]} ${styles[`chip--${row.status}`]}`}>
                    {STATUS_LABELS[row.status]}
                  </span>
                </td>
                <td className={styles["table__num"]}>{row.value.toFixed(1)}</td>
                <td>{row.updatedAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
