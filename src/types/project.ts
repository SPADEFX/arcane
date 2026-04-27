export interface ProjectTheme {
  font: string;
  headingFont?: string;
  brandColor: string;
  dark: boolean;
  radius: string;
  customCSS: string;
}

export interface Block {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children?: Block[];
  locked: boolean;
  hidden: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  theme: ProjectTheme;
  blocks: Block[];
  meta: {
    title: string;
    description: string;
    favicon?: string;
  };
  createdAt: number;
  updatedAt: number;
}
