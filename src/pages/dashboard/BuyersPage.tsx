import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { Buyer } from '../../lib/types';
import { normalizeErrorMessage } from '../../lib/utils';

type BuyerForm = {
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  tax_code: string;
  notes: string;
  is_active: boolean;
};

const defaultForm: BuyerForm = {
  company_name: '',
  contact_person: '',
  phone: '',
  email: '',
  address: '',
  tax_code: '',
  notes: '',
  is_active: true,
};

interface BuyersPageProps {
  canManage: boolean;
}

export function BuyersPage({ canManage }: BuyersPageProps) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [formData, setFormData] = useState<BuyerForm>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBuyers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('buyers').select('*').order('company_name', { ascending: true });

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      setIsLoading(false);
      return;
    }

    setBuyers((data ?? []) as Buyer[]);
    setErrorMessage('');
    setIsLoading(false);
  };

  useEffect(() => {
    void loadBuyers();
  }, []);

  const filteredBuyers = useMemo(
    () =>
      buyers.filter((buyer) => {
        const value = searchTerm.toLowerCase();
        return (
          buyer.company_name.toLowerCase().includes(value) ||
          buyer.contact_person.toLowerCase().includes(value) ||
          buyer.phone.includes(searchTerm)
        );
      }),
    [buyers, searchTerm],
  );

  const openNewDialog = () => {
    if (!canManage) {
      return;
    }
    setEditingBuyer(null);
    setFormData(defaultForm);
    setShowDialog(true);
  };

  const openEditDialog = (buyer: Buyer) => {
    if (!canManage) {
      return;
    }
    setEditingBuyer(buyer);
    setFormData({
      company_name: buyer.company_name,
      contact_person: buyer.contact_person,
      phone: buyer.phone,
      email: buyer.email ?? '',
      address: buyer.address,
      tax_code: buyer.tax_code ?? '',
      notes: buyer.notes ?? '',
      is_active: buyer.is_active,
    });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingBuyer(null);
    setFormData(defaultForm);
  };

  const handleSave = async () => {
    if (!canManage) {
      setErrorMessage('У вас немає прав на зміну покупців.');
      return;
    }
    setErrorMessage('');

    if (!formData.company_name.trim() || !formData.contact_person.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage('Заповніть назву компанії, контактну особу, телефон та адресу.');
      return;
    }

    const payload = {
      company_name: formData.company_name.trim(),
      contact_person: formData.contact_person.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      address: formData.address.trim(),
      tax_code: formData.tax_code.trim() || null,
      notes: formData.notes.trim() || null,
      is_active: formData.is_active,
    };

    setIsSaving(true);
    const query = editingBuyer
      ? supabase.from('buyers').update(payload).eq('id', editingBuyer.id)
      : supabase.from('buyers').insert(payload);

    const { error } = await query;
    setIsSaving(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    closeDialog();
    await loadBuyers();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="app-page-title">Покупці</h1>
          <p className="app-page-subtitle">База клієнтів та контактна інформація</p>
        </div>
        {canManage ? (
          <button onClick={openNewDialog} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Додати покупця
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      {!canManage ? (
        <div className="app-alert-info">Режим перегляду: ця роль може лише переглядати список покупців.</div>
      ) : null}

      <div className="app-panel p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Пошук за назвою, контактною особою або телефоном..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="app-input pl-10 pr-4"
          />
        </div>
      </div>

      <div className="app-table-shell">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="app-table-head">
              <tr>
                <th className="app-table-head-cell">Назва компанії</th>
                <th className="app-table-head-cell">Контактна особа</th>
                <th className="app-table-head-cell">Телефон</th>
                <th className="app-table-head-cell">Email</th>
                <th className="app-table-head-cell">Адреса</th>
                <th className="app-table-head-cell">Статус</th>
                {canManage ? <th className="app-table-head-cell text-right">Дії</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredBuyers.map((buyer) => (
                <tr key={buyer.id} className="app-table-row">
                  <td className="app-table-cell-strong whitespace-nowrap">{buyer.company_name}</td>
                  <td className="app-table-cell whitespace-nowrap">{buyer.contact_person}</td>
                  <td className="app-table-cell whitespace-nowrap">{buyer.phone}</td>
                  <td className="app-table-cell whitespace-nowrap">{buyer.email || '-'}</td>
                  <td className="app-table-cell">{buyer.address}</td>
                  <td className="app-table-cell whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${buyer.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {buyer.is_active ? 'Активний' : 'Неактивний'}
                    </span>
                  </td>
                  {canManage ? (
                    <td className="app-table-cell whitespace-nowrap text-right">
                      <button onClick={() => openEditDialog(buyer)} className="inline-flex items-center gap-2 app-status-accent hover:text-blue-800 dark:hover:text-blue-300">
                        <Pencil className="w-4 h-4" />
                        Редагувати
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="app-panel w-full max-w-2xl p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">{editingBuyer ? 'Редагувати покупця' : 'Новий покупець'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={formData.company_name} onChange={(event) => setFormData((current) => ({ ...current, company_name: event.target.value }))} placeholder="Назва компанії" className="app-input" />
              <input value={formData.contact_person} onChange={(event) => setFormData((current) => ({ ...current, contact_person: event.target.value }))} placeholder="Контактна особа" className="app-input" />
              <input value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="Телефон" className="app-input" />
              <input value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="app-input" />
              <input value={formData.tax_code} onChange={(event) => setFormData((current) => ({ ...current, tax_code: event.target.value }))} placeholder="ЄДРПОУ / податковий код" className="app-input" />
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData((current) => ({ ...current, is_active: event.target.checked }))} />
                Активний покупець
              </label>
              <textarea value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} rows={2} placeholder="Адреса" className="app-input md:col-span-2" />
              <textarea value={formData.notes} onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))} rows={3} placeholder="Примітки" className="app-input md:col-span-2" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeDialog} className="app-btn-secondary flex-1">Скасувати</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                {isSaving ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
