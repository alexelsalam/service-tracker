import * as XLSX from "xlsx";

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
};

type UseExportExcelProps<T> = {
  data: T[];
  columns: Column<T>[];
  filename?: string;
  sheetName?: string;
};

export function useExportExcel<T extends object>() {
  function exportToExcel({
    data,
    columns,
    filename = "export",
    sheetName = "Data",
  }: UseExportExcelProps<T>) {
    // Ambil hanya kolom yang punya key (skip kolom render-only)
    const exportColumns = columns.filter((col) => col.key);

    // Buat header row
    const headers = exportColumns.map((col) => col.header);

    // Buat data rows — pakai nilai raw (bukan render)
    const rows = data.map((item) =>
      exportColumns.map((col) => {
        const value = item[col.key];
        // Kalau value null/undefined, isi string kosong
        return value ?? "";
      }),
    );

    // Gabung header + rows
    const worksheetData = [headers, ...rows];

    // Buat worksheet & workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    // Auto width kolom
    const colWidths = headers.map((header, i) => {
      const maxLength = Math.max(
        header.length,
        ...rows.map((row) => String(row[i] ?? "").length),
      );
      return { wch: Math.min(maxLength + 2, 40) }; // max 40 karakter
    });
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Download file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  return { exportToExcel };
}
