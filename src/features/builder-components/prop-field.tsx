import type { PropField as PropFieldType } from "../builder-registry/types";
import { ListEditor, ObjectEditor } from "./list-editor";
import { ImageUploadField } from "./image-upload-field";

const inputClass =
  "w-full rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-white/80 outline-none ring-0 ring-blue-500/0 transition-all duration-200 focus:bg-white/[0.07] focus:ring-1 focus:ring-blue-500/30 hover:bg-white/[0.06] placeholder:text-white/20";

interface PropFieldProps {
  field: PropFieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PropField({ field, value, onChange }: PropFieldProps) {
  const id = `prop-${field.key}`;

  switch (field.type) {
    case "text":
      return (
        <div>
          <label htmlFor={id} className="mb-1 block text-[10px] font-medium text-white/40">
            {field.label}
          </label>
          <input
            id={id}
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label htmlFor={id} className="mb-1 block text-[10px] font-medium text-white/40">
            {field.label}
          </label>
          <textarea
            id={id}
            rows={3}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
      );

    case "number":
      return (
        <div>
          <label htmlFor={id} className="mb-1 block text-[10px] font-medium text-white/40">
            {field.label}
          </label>
          <input
            id={id}
            type="number"
            value={(value as number) ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between py-0.5">
          <span className="text-[11px] text-white/50">{field.label}</span>
          <button
            onClick={() => onChange(!value)}
            className={`relative h-4 w-7 rounded-full transition-colors ${
              value ? "bg-blue-500" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
                value ? "translate-x-3" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      );

    case "color":
      return (
        <div>
          <label htmlFor={id} className="mb-1 block text-[10px] font-medium text-white/40">
            {field.label}
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id={id}
              type="color"
              value={(value as string) ?? "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded-md border-none bg-transparent"
            />
            <input
              type="text"
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              className={inputClass.replace("w-full ", "flex-1 ")}
            />
          </div>
        </div>
      );

    case "select":
      return (
        <div>
          <label htmlFor={id} className="mb-1 block text-[10px] font-medium text-white/40">
            {field.label}
          </label>
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "json":
      return (
        <div>
          <label className="mb-1 block text-[10px] font-medium text-white/40">
            {field.label}
          </label>
          <VisualJsonField value={value} onChange={onChange} />
        </div>
      );

    case "image":
      return (
        <ImageUploadField
          value={value as string}
          onChange={onChange}
          label={field.label}
        />
      );

    default:
      return null;
  }
}

function VisualJsonField({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  // Array → list editor
  if (Array.isArray(value)) {
    return <ListEditor value={value} onChange={onChange} />;
  }

  // Object → object editor
  if (typeof value === "object" && value !== null) {
    return (
      <ObjectEditor
        value={value as Record<string, unknown>}
        onChange={onChange}
      />
    );
  }

  // Fallback: simple text input
  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}
