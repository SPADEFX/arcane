import type { Block } from "../builder-registry/types";
import { blockMap } from "../builder-registry/blocks";

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const def = blockMap.get(block.type);
  if (!def) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-red-400">
        Unknown block type: {block.type}
      </div>
    );
  }

  const Component = def.component;
  return <Component {...block.props} />;
}
