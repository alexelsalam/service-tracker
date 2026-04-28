import { useState, useEffect, useMemo, useCallback } from "react";
import { Customer, CustomerFormData } from "@/types";
import { customerApi } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import { ReusableModal } from "@/components/ReusableModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STATUS_OPTIONS = [
  "proses transaksi",
  "deal",
  "menunggu part",
  "diproses",
  "ok",
  "not good",
  "diambil",
  "cancel",
] as const;

const createCustomerSchema = z.object({
  kode_data: z.string().min(1, "Kode data wajib diisi"),
  nama_konter: z.string().min(1, "Nama konter wajib diisi"),
  nama_customer: z.string().min(1, "Nama customer wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  no_hp: z.string().min(8, "Nomor HP tidak valid"),
  merk_hp: z.string().min(1, "Merk HP wajib diisi"),
  kerusakan: z.string().min(1, "Kerusakan wajib diisi"),
  biaya: z.coerce.number().optional(),
  teknisi: z.string().min(1, "Teknisi wajib dipilih"),
  status: z.enum(STATUS_OPTIONS).default("proses transaksi"),
  tgl_masuk: z.date().optional(),
  tgl_keluar: z.date().optional(),
  catatan: z.string().optional(),
});

type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerApi.getAll();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      status: "proses transaksi",
    },
  });

  const openCreate = () => {
    setEditingId(null);
    reset({
      kode_data: "",
      nama_konter: "",
      nama_customer: "",
      alamat: "",
      no_hp: "",
      merk_hp: "",
      kerusakan: "",
      biaya: undefined,
      teknisi: "",
      status: "proses transaksi",
      tgl_masuk: undefined,
      tgl_keluar: undefined,
      catatan: "",
    });
    setModalOpen(true);
  };

  const openEdit = async (c: Customer) => {
    setEditingId(c.id);
    reset({
      kode_data: c.kode_data,
      nama_konter: c.nama_konter,
      nama_customer: c.nama_customer,
      alamat: c.alamat,
      no_hp: c.no_hp,
      merk_hp: c.merk_hp,
      kerusakan: c.kerusakan,
      biaya: c.biaya,
      teknisi: c.teknisi,
      status: c.status as (typeof STATUS_OPTIONS)[number],
      tgl_masuk: c.tgl_masuk ? new Date(c.tgl_masuk) : undefined,
      tgl_keluar: c.tgl_keluar ? new Date(c.tgl_keluar) : undefined,
      catatan: c.catatan,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await customerApi.remove(id);
    toast.success("Customer berhasil dihapus");
    loadData();
  };

  const filtered = useMemo(() => {
    if (!debouncedSearch) return customers;
    const q = debouncedSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.nama_customer.toLowerCase().includes(q) ||
        c.merk_hp.toLowerCase().includes(q) ||
        c.no_hp.includes(q),
    );
  }, [customers, debouncedSearch]);

  const columns = [
    { key: "kode_data", header: "Kode Data" },
    { key: "nama_konter", header: "Nama Konter" },
    { key: "nama_customer", header: "Nama Customer" },
    { key: "alamat", header: "Alamat" },
    { key: "no_hp", header: "No HP" },
    { key: "merk_hp", header: "Merk HP" },
    { key: "kerusakan", header: "Kerusakan" },
    { key: "biaya", header: "Biaya" },
    { key: "teknisi", header: "Teknisi" },
    { key: "status", header: "Status" },
    { key: "tgl_masuk", header: "Tanggal Masuk" },
    { key: "tgl_keluar", header: "Tanggal Keluar" },
    { key: "catatan", header: "Catatan" },
  ];

  const onSubmit = async (data: CreateCustomerInput) => {
    const payload = {
      kode_data: data.kode_data,
      nama_konter: data.nama_konter,
      nama_customer: data.nama_customer,
      alamat: data.alamat,
      no_hp: data.no_hp,
      merk_hp: data.merk_hp,
      kerusakan: data.kerusakan,
      biaya: data.biaya,
      teknisi: data.teknisi,
      status: data.status,
      tgl_masuk: data.tgl_masuk,
      tgl_keluar: data.tgl_keluar,
      catatan: data.catatan,
    };
    try {
      if (editingId) {
        const result = await customerApi.update(editingId, payload);
        if (!result) {
          toast.error("Gagal memperbarui customer.");
          return;
        }
        toast.success("Customer berhasil diperbarui!");
      } else {
        const result = await customerApi.create(payload);
        if (!result) {
          toast.error("Gagal menambahkan customer.");
          return;
        }
        toast.success("Customer berhasil ditambahkan!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      console.error(error);
    } finally {
      setModalOpen(false);
      setEditingId(null);
      loadData();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Data Customer
            </h1>
            <p className="text-sm text-muted-foreground">
              {customers.length} customer terdaftar
            </p>
          </div>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Customer
        </Button>
      </div>

      <div className="max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama, device, atau no HP..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Belum ada customer"
        actions={(c) => (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(c.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <ReusableModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        title={editingId ? "Edit Customer" : "Tambah Customer"}
        className="overflow-y-auto max-h-[90vh]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(
            [
              "kode_data",
              "nama_customer",
              "nama_konter",
              "alamat",
              "no_hp",
              "merk_hp",
              "kerusakan",
              "biaya",
              "teknisi",
              "tgl_masuk",
              "tgl_keluar",
              "catatan",
            ] as const
          ).map((field) => (
            <div key={field}>
              <Label>
                {field === "no_hp"
                  ? "No HP"
                  : field.replace(/_/g, " ").charAt(0).toUpperCase() +
                    field.replace(/_/g, " ").slice(1)}
              </Label>
              {field === "tgl_masuk" || field === "tgl_keluar" ? (
                <div className="w-full">
                  <Controller
                    name={field}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        dateFormat="dd/MM/yyyy"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                    )}
                  />
                </div>
              ) : (
                <Input
                  type={field === "biaya" ? "number" : "text"}
                  {...register(field)}
                  className={errors[field] ? "border-destructive" : ""}
                />
              )}
              {errors[field] && (
                <p className="text-sm text-destructive mt-1">
                  {errors[field]?.message?.toString() ||
                    "Field ini wajib diisi"}
                </p>
              )}
            </div>
          ))}

          {/* Status Select */}
          <div>
            <Label>Status</Label>
            <select
              {...register("status")}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                errors.status ? "border-destructive" : "border-input"
              }`}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-sm text-destructive mt-1">
                {errors.status?.message?.toString() || "Field ini wajib diisi"}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : editingId ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Customer"
              )}
            </Button>
          </div>
        </form>
      </ReusableModal>
    </div>
  );
}
