export interface CustomLinkProps {
  href: string;
  title: string;
  icon: string;
}

export interface ClearProps {
  onClick: () => void;
}

export interface GlobalSearchProps {
  value: string;
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface NewButtonProps {
  openNew: () => void;
}
