import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import type { FreezerInventory, PantryInventory } from '@/lib/types';

type Tab = 'freezer' | 'pantry';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<Tab>('freezer');
  const store = useAppStore();

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="flex gap-2 mb-4">
        {(['freezer', 'pantry'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {tab === 'freezer' ? 'Freezer' : 'Pantry'}
          </button>
        ))}
      </div>

      {activeTab === 'freezer' ? (
        <FreezerTab
          freezer={store.freezer}
          onUpdate={store.updateFreezerQuantity}
          onAdd={store.addFreezerItem}
          onRemove={store.removeFreezerItem}
          onAddCategory={store.addFreezerCategory}
        />
      ) : (
        <PantryTab
          pantry={store.pantry}
          onToggle={store.togglePantryItem}
          onAdd={store.addPantryItem}
          onRemove={store.removePantryItem}
          onAddCategory={store.addPantryCategory}
        />
      )}
    </div>
  );
}

// ─── Add Item Inline Form ───

function AddItemForm({
  onAdd,
  placeholder,
  extraField,
}: {
  onAdd: (label: string, extra: string) => void;
  placeholder: string;
  extraField?: { placeholder: string; defaultValue: string };
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [extra, setExtra] = useState(extraField?.defaultValue ?? '');

  const submit = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    onAdd(trimmed, extra || extraField?.defaultValue || '');
    setLabel('');
    setExtra(extraField?.defaultValue ?? '');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:border-amber-400 hover:text-amber-600 transition-colors"
      >
        + Add item
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        autoFocus
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500"
      />
      {extraField && (
        <input
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder={extraField.placeholder}
          className="w-20 px-2 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500"
        />
      )}
      <button
        onClick={submit}
        className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
      >
        Add
      </button>
      <button
        onClick={() => { setOpen(false); setLabel(''); }}
        className="px-2 py-2 text-gray-400 text-sm hover:text-gray-600"
      >
        Cancel
      </button>
    </div>
  );
}

// ─── Add Category Form ───

function AddCategoryForm({ onAdd }: { onAdd: (key: string, label: string, emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('');

  const submit = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase().replace(/\s+/g, '-');
    onAdd(key, trimmed, emoji || '\u{1F4E6}');
    setLabel('');
    setEmoji('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-amber-400 hover:text-amber-600 transition-colors"
      >
        + Add category
      </button>
    );
  }

  return (
    <div className="flex gap-2 bg-white rounded-xl p-3 shadow-sm">
      <input
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        placeholder="Emoji"
        className="w-14 px-2 py-2 rounded-lg border border-gray-300 text-sm text-center focus:outline-none focus:border-amber-500"
      />
      <input
        autoFocus
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Category name"
        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500"
      />
      <button
        onClick={submit}
        className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
      >
        Add
      </button>
      <button
        onClick={() => { setOpen(false); setLabel(''); }}
        className="px-2 py-2 text-gray-400 text-sm hover:text-gray-600"
      >
        Cancel
      </button>
    </div>
  );
}

// ─── Freezer Tab ───

function FreezerTab({
  freezer,
  onUpdate,
  onAdd,
  onRemove,
  onAddCategory,
}: {
  freezer: FreezerInventory;
  onUpdate: (categoryKey: string, itemId: string, quantity: number) => void;
  onAdd: (categoryKey: string, label: string, unit: string) => void;
  onRemove: (categoryKey: string, itemId: string) => void;
  onAddCategory: (key: string, label: string, emoji: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {Object.entries(freezer).map(([key, category]) => (
        <section key={key}>
          <h2 className="text-base font-bold text-gray-800 mb-3">
            {category.emoji} {category.label}
          </h2>
          <div className="space-y-2">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm"
              >
                {confirmDelete === item.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm text-gray-600 flex-1">Remove {item.label}?</span>
                    <button
                      onClick={() => { onRemove(key, item.id); setConfirmDelete(null); }}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1 text-gray-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirmDelete(item.id)}
                      className="mr-2 text-gray-300 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      <span className="text-xs text-gray-400 ml-1.5">({item.unit})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdate(key, item.id, item.quantity - 1)}
                        className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 text-lg font-bold flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className={`w-8 text-center text-sm font-bold tabular-nums ${
                        item.quantity > 0 ? 'text-amber-600' : 'text-gray-300'
                      }`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdate(key, item.id, item.quantity + 1)}
                        className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 text-lg font-bold flex items-center justify-center hover:bg-amber-200 active:bg-amber-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <AddItemForm
              onAdd={(label, unit) => onAdd(key, label, unit)}
              placeholder="Item name"
              extraField={{ placeholder: "Unit", defaultValue: "count" }}
            />
          </div>
        </section>
      ))}
      <AddCategoryForm onAdd={onAddCategory} />
    </div>
  );
}

// ─── Pantry Tab ───

function PantryTab({
  pantry,
  onToggle,
  onAdd,
  onRemove,
  onAddCategory,
}: {
  pantry: PantryInventory;
  onToggle: (categoryKey: string, itemId: string) => void;
  onAdd: (categoryKey: string, label: string) => void;
  onRemove: (categoryKey: string, itemId: string) => void;
  onAddCategory: (key: string, label: string, emoji: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {Object.entries(pantry).map(([key, category]) => (
        <section key={key}>
          <h2 className="text-base font-bold text-gray-800 mb-3">
            {category.emoji} {category.label}
          </h2>
          <div className="space-y-2">
            {category.items.map((item) => (
              <div
                key={item.id}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 shadow-sm transition-colors ${
                  item.inStock
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-white border border-gray-100'
                }`}
              >
                {confirmDelete === item.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm text-gray-600 flex-1">Remove {item.label}?</span>
                    <button
                      onClick={() => { onRemove(key, item.id); setConfirmDelete(null); }}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1 text-gray-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirmDelete(item.id)}
                      className="mr-2 text-gray-300 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onToggle(key, item.id)}
                      className="flex-1 text-left"
                    >
                      <span className={`text-sm font-medium ${
                        item.inStock ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                    <button onClick={() => onToggle(key, item.id)}>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${
                        item.inStock ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          item.inStock ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                  </>
                )}
              </div>
            ))}
            <AddItemForm
              onAdd={(label) => onAdd(key, label)}
              placeholder="Item name"
            />
          </div>
        </section>
      ))}
      <AddCategoryForm onAdd={onAddCategory} />
    </div>
  );
}
