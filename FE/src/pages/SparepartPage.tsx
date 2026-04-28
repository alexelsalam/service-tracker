import { useState, useEffect, useMemo, useCallback } from "react";
import { Sparepart, SparepartFormData } from "@/types";
import { sparepartApi } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import { ReusableModal } from "@/components/ReusableModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const createSparePartSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  stock: z.number().int().min(0, "Stock tidak boleh negatif"),
});
type CreateSparePartInput = z.infer<typeof createSparePartSchema>;

export default function SparepartPage() {
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sparepartApi.getAll();
      setSpareparts(data);
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
    reset,
  } = useForm<CreateSparePartInput>({
    resolver: zodResolver(createSparePartSchema),
    defaultValues: { nama: "", stock: 0 },
  });

  const openCreate = () => {
    setEditingId(null);
    reset({ nama: "", stock: 0 });
    setModalOpen(true);
  };

  const openEdit = (sparepart: Sparepart) => {
    setEditingId(sparepart.id);
    reset({ nama: sparepart.nama, stock: sparepart.stock });
    setModalOpen(true);
  };

  const onSubmit = async (data: CreateSparePartInput) => {
    const payload: SparepartFormData = {
      nama: data.nama,
      stock: data.stock,
    };
    try {
      if (editingId) {
        const result = await sparepartApi.update(editingId, payload);
        if (!result) {
          toast.error("Gagal memperbarui sparepart.");
          return;
        }
        toast.success("Sparepart berhasil diperbarui");
      } else {
        const result = await sparepartApi.create(payload);
        if (!result) {
          toast.error("Gagal menambahkan sparepart.");
          return;
        }
        toast.success("Sparepart berhasil ditambahkan");
      }
      setModalOpen(false);
      reset();
      loadData();
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await sparepartApi.remove(id);
      toast.success("Sparepart berhasil dihapus");
      loadData();
    } catch (error) {
      toast.error("Gagal menghapus sparepart");
    }
  };

  const filtered = useMemo(() => {
    if (!debouncedSearch) return spareparts;
    const q = debouncedSearch.toLowerCase();
    return spareparts.filter((s) => s.nama.toLowerCase().includes(q));
  }, [spareparts, debouncedSearch]);

  const columns = [
    {
      key: "nama",
      header: "Nama Sparepart",
      render: (s: Sparepart) => (
        <span className="font-medium text-foreground">{s.nama}</span>
      ),
    },

    {
      key: "stock",
      header: "Stock",
      render: (s: Sparepart) => (
        <Badge
          variant={
            s.stock <= 5
              ? "destructive"
              : s.stock <= 15
                ? "outline"
                : "secondary"
          }
        >
          {s.stock} unit
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Data Sparepart
            </h1>
            <p className="text-sm text-muted-foreground">
              {spareparts.length} sparepart tersedia
            </p>
          </div>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Sparepart
        </Button>
      </div>

      <div className="max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama sparepart..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Belum ada sparepart"
        actions={(s) => (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(s.id)}
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
          reset();
        }}
        title={editingId ? "Edit Sparepart" : "Tambah Sparepart"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nama Sparepart</Label>
            <Input
              {...register("nama")}
              className={errors.nama ? "border-destructive" : ""}
            />
            {errors.nama && (
              <p className="text-sm text-destructive mt-1">
                {errors.nama.message}
              </p>
            )}
          </div>

          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className={errors.stock ? "border-destructive" : ""}
            />
            {errors.stock && (
              <p className="text-sm text-destructive mt-1">
                {errors.stock.message}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingId ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </ReusableModal>
    </div>
  );
}
