import { ReactNode, useEffect, useRef, useState } from "react";
import { Loader2, Inbox } from "lucide-react";
import { DataTableProps } from "@/types";

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  emptyMessage = "Belum ada data",
  actions,
}: DataTableProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollLeft > 0);
      }
    };

    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener("scroll", handleScroll);

    return () => scrollElement?.removeEventListener("scroll", handleScroll);
  }, []);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-3" />
        <p>Memuat data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Inbox className="h-12 w-12 mb-3 opacity-40" />
        <p className="text-lg font-medium">{emptyMessage}</p>
        <p className="text-sm">Tambahkan data baru untuk memulai</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="rounded-lg border bg-card hide-scrollbar max-w-screen flex-1  overflow-x-scroll"
    >
      <table className="w-full text-xs sm:text-sm table-auto ">
        <thead className="">
          <tr className={`border-b bg-muted`}>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`
                    px-4 py-3 text-left font-medium text-muted-foreground 
                    ${
                      index === 2
                        ? `sticky left-0  z-10 bg-muted ${
                            isScrolled
                              ? "shadow-[2px_0_4px_rgba(0,0,0,0.1)]"
                              : ""
                          }`
                        : ""
                    }
                  `}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={item.id}
              className={`border-b last:border-0 transition-colors hover:bg-muted/30 animate-fade-in`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {columns.map((col, index) => (
                <td
                  key={col.key}
                  className={`
                      px-4 py-3
                      ${
                        index === 2
                          ? `sticky left-0 z-10 bg-card ${
                              isScrolled
                                ? "shadow-[2px_0_4px_rgba(0,0,0,0.1)]"
                                : ""
                            }`
                          : ""
                      }
                    `}
                >
                  {col.render ? col.render(item) : (item as unknown)[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">{actions(item)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
