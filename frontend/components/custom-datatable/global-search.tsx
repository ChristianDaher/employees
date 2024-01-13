import { InputText } from "primereact/inputtext";
import { GlobalSearchProps } from "@/utils/interfaces/components";

export default function GlobalSearch({ value, onClick }: GlobalSearchProps) {
  return (
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText
        className="pl-8 w-48"
        value={value}
        onChange={onClick}
        placeholder="Keyword Search"
      />
    </span>
  );
}
