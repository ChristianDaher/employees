export interface CustomLinkProps {
  href: string;
  title: string;
  icon: string;
}

export interface CustomDatatableHeaderProps {
  globalSearchValue: string;
  onClickNew: React.MouseEventHandler<HTMLButtonElement>;
  onClickExport: React.MouseEventHandler<HTMLButtonElement>;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CustomDatatableDeleteDialogProps {
  visible: boolean;
  onHide: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  entity: Object;
  entityName: string;
  entityDisplay: string;
}
