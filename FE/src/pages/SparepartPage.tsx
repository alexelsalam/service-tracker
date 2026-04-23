import { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparepart, SparepartFormData } from '@/types';
import { sparepartApi } from '@/services/api';
import { formatCurrency } from '@/utils/dummy-data';
import { useDebounce } from '@/hooks/useDebounce';
import { useForm } from '@/hooks/useForm';
import { DataTable } from '@/components/DataTable';
import { SearchInput } from '@/components/SearchInput';
import { ReusableModal } from '@/components/ReusableModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

const emptySparepart: SparepartFormData = { nama: '', harga: 0, stok: 0 };

function validateSparepart(v: SparepartFormData) {
  const e: Record<string, string> = {};
  if (!v.nama.trim()) e.nama = 'Nama sparepart wajib diisi';
  if (v.harga <= 0) e.harga = 'Harga harus lebih dari 0';
  if (v.stok < 0) e.stok = 'Stok tidak boleh negatif';
  return e;
}

export default function SparepartPage() {
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  useEffect(() => { loadData(); }, [loadData]);

  const form = useForm<SparepartFormData>({
    initialValues: emptySparepart,
    validate: validateSparepart,
    onSubmit: async (values) => {
      if (editingId) {
        await sparepartApi.update(editingId, values);
        toast.success('Sparepart berhasil diupdate');
      } else {
        await sparepartApi.create(values);
        toast.success('Sparepart berhasil ditambahkan');
      }
      setModalOpen(false);
      setEditingId(null);
      form.reset();
      loadData();
    },
  });

  const openCreate = () => { form.reset(); setEditingId(null); setModalOpen(true); };
  const openEdit = (s: Sparepart) => {
    setEditingId(s.id);
    form.reset({ nama: s.nama, harga: s.harga, stok: s.stok });
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    await sparepartApi.remove(id);
    toast.success('Sparepart berhasil dihapus');
    loadData();
  };

  const filtered = useMemo(() => {
    if (!debouncedSearch) return spareparts;
    const q = debouncedSearch.toLowerCase();
    return spareparts.filter(s => s.nama.toLowerCase().includes(q));
  }, [spareparts, debouncedSearch]);

  const columns = [
    { key: 'nama', header: 'Nama Sparepart', render: (s: Sparepart) => <span className="font-medium text-foreground">{s.nama}</span> },
    { key: 'harga', header: 'Harga', render: (s: Sparepart) => formatCurrency(s.harga) },
    {
      key: 'stok', header: 'Stok', render: (s: Sparepart) => (
        <Badge variant={s.stok <= 5 ? 'destructive' : s.stok <= 15 ? 'outline' : 'secondary'}>
          {s.stok} unit
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
            <h1 className="text-xl font-semibold text-foreground">Data Sparepart</h1>
            <p className="text-sm text-muted-foreground">{spareparts.length} sparepart tersedia</p>
          </div>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Tambah Sparepart</Button>
      </div>

      <div className="max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama sparepart..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Belum ada sparepart"
        actions={(s) => (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <ReusableModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); }} title={editingId ? 'Edit Sparepart' : 'Tambah Sparepart'}>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div>
            <Label>Nama Sparepart</Label>
            <Input value={form.values.nama} onChange={(e) => form.handleChange('nama', e.target.value)} className={form.errors.nama ? 'border-destructive' : ''} />
            {form.errors.nama && <p className="text-sm text-destructive mt-1">{form.errors.nama}</p>}
          </div>
          <div>
            <Label>Harga (Rp)</Label>
            <Input type="number" value={form.values.harga || ''} onChange={(e) => form.handleChange('harga', Number(e.target.value))} className={form.errors.harga ? 'border-destructive' : ''} />
            {form.errors.harga && <p className="text-sm text-destructive mt-1">{form.errors.harga}</p>}
          </div>
          <div>
            <Label>Stok</Label>
            <Input type="number" value={form.values.stok || ''} onChange={(e) => form.handleChange('stok', Number(e.target.value))} className={form.errors.stok ? 'border-destructive' : ''} />
            {form.errors.stok && <p className="text-sm text-destructive mt-1">{form.errors.stok}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={form.isSubmitting}>
              {form.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingId ? 'Simpan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </ReusableModal>
    </div>
  );
}
