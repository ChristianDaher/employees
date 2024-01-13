import { Button } from "primereact/button";
import { ClearProps } from "@/utils/interfaces/components";

export default function Clear({ onClick }: ClearProps) {
  return (
    <Button
      type="button"
      icon="pi pi-filter-slash"
      label="Clear"
      outlined
      onClick={onClick}
    />
  );
}
