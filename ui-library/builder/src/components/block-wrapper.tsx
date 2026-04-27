import { type ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";

interface BlockWrapperProps {
  id: string;
  selected: boolean;
  label: string;
  index: number;
  totalBlocks: number;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: ReactNode;
}

export function BlockWrapper({
  id,
  selected,
  label,
  index,
  totalBlocks,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  children,
}: BlockWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Close context menu on click outside
  useEffect(() => {
    if (!contextMenu) return;
    function handleClick() {
      setContextMenu(null);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
      className={`group/block relative cursor-pointer ${
        selected
          ? "outline outline-2 outline-blue-500 outline-offset-[-2px]"
          : "hover:outline hover:outline-1 hover:outline-blue-500/30 hover:outline-offset-[-1px]"
      }`}
    >
      {/* Toolbar — centered above the block */}
      <div
        className={`absolute -top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 rounded-lg bg-[#1e1e22]/95 px-1.5 py-1 text-[11px] text-white/60 shadow-border backdrop-blur-md transition-all duration-200 ${
          selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 group-hover/block:opacity-100 group-hover/block:translate-y-0"
        }`}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-md p-1 transition-colors hover:bg-white/[0.08] active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="h-3 w-3 icon-animated" />
        </button>
        <span className="px-1.5 select-none whitespace-nowrap text-white/40">{label}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="rounded-md p-1 transition-colors hover:bg-white/[0.08]"
          title="Duplicate block"
        >
          <Copy className="h-3 w-3 icon-animated" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-md p-1 transition-colors hover:bg-red-500/20 hover:text-red-400"
          title="Delete block"
        >
          <Trash2 className="h-3 w-3 icon-animated" />
        </button>
      </div>

      {/* Block content */}
      <div className="[&_a]:pointer-events-none [&_button]:pointer-events-none">
        {children}
      </div>

      {/* Right-click context menu */}
      {contextMenu && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x, zIndex: 9999 }}
          className="min-w-[160px] rounded-xl shadow-border bg-[#1e1e22]/95 py-1.5 backdrop-blur-md animate-in fade-in-0 slide-in-from-top-1 duration-150"
        >
          <ContextItem
            label="Move Up"
            icon={<ArrowUp className="h-3.5 w-3.5 icon-animated" />}
            disabled={index === 0}
            onClick={() => { onMoveUp(); setContextMenu(null); }}
          />
          <ContextItem
            label="Move Down"
            icon={<ArrowDown className="h-3.5 w-3.5 icon-animated" />}
            disabled={index === totalBlocks - 1}
            onClick={() => { onMoveDown(); setContextMenu(null); }}
          />
          <div className="my-1.5 mx-2 border-t border-white/[0.06]" />
          <ContextItem
            label="Duplicate"
            icon={<Copy className="h-3.5 w-3.5 icon-animated" />}
            onClick={() => { onDuplicate(); setContextMenu(null); }}
          />
          <ContextItem
            label="Delete"
            icon={<Trash2 className="h-3.5 w-3.5 icon-animated" />}
            danger
            onClick={() => { onDelete(); setContextMenu(null); }}
          />
        </div>,
        document.body,
      )}
    </div>
  );
}

function ContextItem({
  label,
  icon,
  disabled,
  danger,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-[12px] transition-colors ${
        disabled
          ? "text-white/15 cursor-not-allowed"
          : danger
            ? "text-white/50 hover:bg-red-500/15 hover:text-red-400"
            : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
