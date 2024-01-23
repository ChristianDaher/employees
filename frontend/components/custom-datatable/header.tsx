import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { CustomDatatableHeaderProps } from "@/utils/interfaces/components";

export default function header({
  onClickNew,
  onClickExport,
  globalSearchValue,
  onSearch,
}: CustomDatatableHeaderProps) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={onClickNew}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={onClickExport}
        />
      </div>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          className="pl-8 w-48"
          value={globalSearchValue}
          onChange={onSearch}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  );
}
