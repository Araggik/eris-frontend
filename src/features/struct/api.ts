export interface StructNode {
  id: string;
  name: string;
  children?: StructNode[];
}

export type StructStatus = "active" | "draft" | "archived";

export interface StructRecord {
  id: string;
  name: string;
  type: string;
  status: StructStatus;
  value: number;
  updatedAt: string;
}

const NETWORK_DELAY_MS = 350;

const structTree: StructNode[] = [
  {
    id: "production",
    name: "Производство",
    children: [
      {
        id: "assembly-shop",
        name: "Цех сборки",
        children: [
          { id: "assembly-line-1", name: "Линия 1" },
          { id: "assembly-line-2", name: "Линия 2" },
        ],
      },
      {
        id: "paint-shop",
        name: "Цех покраски",
        children: [{ id: "paint-line-1", name: "Линия 1" }],
      },
    ],
  },
  {
    id: "warehouse",
    name: "Склад",
    children: [
      { id: "warehouse-inbound", name: "Зона приёмки" },
      { id: "warehouse-outbound", name: "Зона отгрузки" },
    ],
  },
  { id: "office", name: "Офис" },
];

const RECORD_TYPES = [
  "Датчик",
  "Клапан",
  "Насос",
  "Конвейер",
  "Шкаф управления",
] as const;

const RECORD_STATUSES: StructStatus[] = [
  "active",
  "active",
  "active",
  "draft",
  "archived",
];

const DAY_MS = 86_400_000;
const RECORD_EPOCH = Date.UTC(2025, 4, 1);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchStructTree(): Promise<StructNode[]> {
  await delay(NETWORK_DELAY_MS);
  return structTree;
}

export async function fetchStructRecords(nodeId: string): Promise<StructRecord[]> {
  await delay(NETWORK_DELAY_MS);

  let seed = 7;
  for (const char of nodeId) {
    seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  }
  const random = () => {
    seed = (seed * 1_103_515_245 + 12_345) >>> 0;
    return seed / 0x1_0000_0000;
  };

  const count = 4 + Math.floor(random() * 6);
  return Array.from({ length: count }, (_, index) => {
    const type = RECORD_TYPES[Math.floor(random() * RECORD_TYPES.length)];
    return {
      id: `${nodeId}-rec-${index + 1}`,
      name: `${type} ${String(index + 1).padStart(2, "0")}`,
      type,
      status: RECORD_STATUSES[Math.floor(random() * RECORD_STATUSES.length)],
      value: Math.round(random() * 10_000) / 10,
      updatedAt: new Date(RECORD_EPOCH - Math.floor(random() * 90) * DAY_MS)
        .toISOString()
        .slice(0, 10),
    };
  });
}
