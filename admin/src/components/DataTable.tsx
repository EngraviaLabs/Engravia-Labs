'use client';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string;
}

export default function DataTable<T>({ columns, data, loading, emptyMessage = 'No records found.', rowKey }: Props<T>) {
  if (loading) {
    return (
      <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 skeleton" />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-16 text-center">
        <div className="text-3xl mb-3 text-[rgba(212,175,55,0.4)]">◈</div>
        <div className="text-[rgba(255,255,255,0.4)] text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] overflow-x-auto">
      <table className="w-full border-collapse min-w-[720px]">
        <thead>
          <tr className="border-b border-[rgba(212,175,55,0.08)]">
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }} className="px-5 py-3 text-left text-[10px] font-bold tracking-[1.5px] uppercase text-[rgba(255,255,255,0.35)]">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={rowKey(row)} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(212,175,55,0.02)] transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-5 py-3.5 text-[13px] text-[rgba(255,255,255,0.8)]">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
