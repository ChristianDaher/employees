import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CustomDatatableDeleteDialogProps } from "@/utils/interfaces/components";

const DeleteDialog = ({
  visible,
  onHide,
  onCancelDelete,
  onConfirmDelete,
  entity,
  entityName,
  entityDisplay,
}: CustomDatatableDeleteDialogProps) => {
  const footer = () => {
    return (
      <>
        <Button
          label="Cancel"
          icon="pi pi-times"
          outlined
          onClick={onCancelDelete}
        />
        <Button label="Save" icon="pi pi-check" onClick={onConfirmDelete} />
      </>
    );
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirm"
      modal
      footer={footer}
      onHide={onHide}
    >
      <div className="confirmation-content flex items-center gap-4">
        <i
          className="pi pi-exclamation-triangle"
          style={{ fontSize: "2rem" }}
        />
        {entity && (
          <span>
            Are you sure you want to delete the <b>{entityDisplay}</b>{" "}
            {entityName}?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
