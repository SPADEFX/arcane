import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from "lucide-react";

/* ─── Object Editor ─────────────────────────────── */

export function ObjectEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-1.5">
      {Object.entries(value).map(([key, val]) => (
        <FieldRow
          key={key}
          label={formatLabel(key)}
          value={val}
          onChange={(v) => onChange({ ...value, [key]: v })}
        />
      ))}
    </div>
  );
}

/* ─── List Editor ───────────────────────────────── */

export function ListEditor({
  value,
  onChange,
}: {
  value: unknown[];
  onChange: (v: unknown[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function addItem() {
    const template = value.length > 0 ? createEmptyFrom(value[0]) : {};
    onChange([...value, template]);
  }

  function removeItem(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, val: unknown) {
    const next = [...value];
    next[i] = val;
    onChange(next);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.findIndex((_, i) => String(i) === active.id);
    const newIndex = value.findIndex((_, i) => String(i) === over.id);
    onChange(arrayMove(value, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={value.map((_, i) => String(i))} strategy={verticalListSortingStrategy}>
        <div className="space-y-0.5">
          {value.map((item, i) => (
            <SortableListItem
              key={i}
              id={String(i)}
              item={item}
              index={i}
              onUpdate={(val) => updateItem(i, val)}
              onDelete={() => removeItem(i)}
            />
          ))}

          {/* Add button */}
          <button
            onClick={addItem}
            className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-white/[0.06] bg-transparent py-1 text-[9px] text-white/[0.15] transition-colors hover:border-white/[0.09] hover:bg-white/[0.015] hover:text-white/[0.22]"
          >
            <Plus className="h-2 w-2" />
            Add item
          </button>
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ─── Sortable List Item ────────────────────────── */

function SortableListItem({
  id,
  item,
  index,
  onUpdate,
  onDelete,
}: {
  id: string;
  item: unknown;
  index: number;
  onUpdate: (v: unknown) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [expanded, setExpanded] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const summary = getItemSummary(item);

  return (
    <div ref={setNodeRef} style={style} className="rounded-md bg-white/[0.02] overflow-hidden">
      {/* Item header */}
      <div className="flex items-center gap-0.5 px-1.5 py-1 group/item">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab shrink-0 rounded p-0.5 text-white/15 transition-colors hover:bg-white/[0.04] hover:text-white/30 active:cursor-grabbing"
        >
          <GripVertical className="h-2.5 w-2.5" />
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-0.5 flex-1 min-w-0 rounded px-0.5 py-0.5 transition-colors hover:bg-white/[0.03]"
        >
          {expanded ? (
            <ChevronDown className="h-2.5 w-2.5 text-white/25 shrink-0" />
          ) : (
            <ChevronRight className="h-2.5 w-2.5 text-white/25 shrink-0" />
          )}
          <span className="flex-1 text-[10px] text-white/50 truncate text-left">
            {summary || `Item ${index + 1}`}
          </span>
        </button>

        <button
          onClick={onDelete}
          className="shrink-0 rounded p-0.5 text-white/15 transition-colors hover:bg-red-500/15 hover:text-red-400"
        >
          <Trash2 className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-1.5 pb-1.5 pt-0.5 space-y-1.5 border-t border-white/[0.04]">
          {isObject(item) ? (
            Object.entries(item as Record<string, unknown>).map(([key, val]) => (
              <FieldRow
                key={key}
                label={formatLabel(key)}
                value={val}
                onChange={(newVal) => {
                  const updated = { ...(item as Record<string, unknown>), [key]: newVal };
                  onUpdate(updated);
                }}
              />
            ))
          ) : (
            <input
              type="text"
              value={String(item ?? "")}
              onChange={(e) => onUpdate(e.target.value)}
              className="w-full rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/70 outline-none transition-colors focus:bg-white/[0.06]"
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Field Row ─────────────────────────────────── */

function FieldRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  // Nested array → nested ListEditor
  if (Array.isArray(value)) {
    return (
      <div>
        <div className="mb-0.5 text-[9px] font-medium text-white/30 uppercase tracking-wide">
          {label}
        </div>
        <div className="ml-1 border-l border-white/[0.04] pl-1.5">
          <ListEditor value={value} onChange={onChange} />
        </div>
      </div>
    );
  }

  // Nested object → nested ObjectEditor
  if (isObject(value)) {
    return (
      <div>
        <div className="mb-0.5 text-[9px] font-medium text-white/30 uppercase tracking-wide">
          {label}
        </div>
        <div className="ml-1 border-l border-white/[0.04] pl-1.5">
          <ObjectEditor
            value={value as Record<string, unknown>}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }

  // Boolean → toggle
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center justify-between py-0.5">
        <span className="text-[9px] text-white/40">{label}</span>
        <button
          onClick={() => onChange(!value)}
          className={`relative h-3.5 w-6 rounded-full transition-colors ${
            value ? "bg-blue-500" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform ${
              value ? "translate-x-2.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    );
  }

  // Number → number input
  if (typeof value === "number") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-white/40 shrink-0 w-20 truncate">{label}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 min-w-0 rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/70 outline-none transition-colors focus:bg-white/[0.06]"
        />
      </div>
    );
  }

  // String → text input (inline label for short values)
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-white/40 shrink-0 w-20 truncate">{label}</span>
      <input
        type="text"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/70 outline-none transition-colors focus:bg-white/[0.06]"
      />
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────── */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function getItemSummary(item: unknown): string {
  if (typeof item === "string") return item;
  if (!isObject(item)) return String(item);
  const obj = item as Record<string, unknown>;
  // Try common label keys in priority order
  for (const key of ["label", "title", "name", "question", "quote", "text"]) {
    if (typeof obj[key] === "string" && obj[key]) return obj[key] as string;
  }
  // Fallback: first string value
  const first = Object.values(obj).find((v) => typeof v === "string" && v);
  return (first as string) ?? "";
}

function createEmptyFrom(template: unknown): unknown {
  if (typeof template === "string") return "";
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  if (Array.isArray(template)) return [];
  if (isObject(template)) {
    const obj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(template as Record<string, unknown>)) {
      if (typeof val === "string") obj[key] = "";
      else if (typeof val === "number") obj[key] = 0;
      else if (typeof val === "boolean") obj[key] = false;
      else if (Array.isArray(val)) obj[key] = [];
      else if (isObject(val)) obj[key] = createEmptyFrom(val);
      else obj[key] = null;
    }
    return obj;
  }
  return null;
}
