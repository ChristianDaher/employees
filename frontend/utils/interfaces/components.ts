export interface CustomLinkProps {
  href: string;
  title: string;
  icon: string;
}

export interface ClearProps {
  onClick: () => void;
}

export interface CustomDatatableHeaderProps {
  globalSearchValue: string;
  onClickNew: React.MouseEventHandler<HTMLButtonElement>;
  onClickExport: React.MouseEventHandler<HTMLButtonElement>;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface NewButtonProps {
  openNew: () => void;
}
