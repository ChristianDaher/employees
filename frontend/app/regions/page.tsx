"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { Region } from "@/utils/interfaces/models";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import CustomDatatableHeader from "@/components/custom-datatable/header";
import { InputText } from "primereact/inputtext";
import { NavbarContext } from "@/components/contexts/navbar.context";
import DeleteDialog from "@/components/custom-datatable/dialog-delete";
import RegionService from "@/services/region.service";
import { saveAsExcelFile } from "@/utils/helpers";

const emptyRegion: Region = {
  name: "",
};

export default function Regions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [region, setRegion] = useState<Region>(emptyRegion);
  const [regionDialog, setRegionDialog] = useState<boolean>(false);
  const [deleteRegionDialog, setDeleteRegionDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Region[]>>(null);
  const { setTitle } = useContext(NavbarContext);

  useEffect(() => {
    setTitle("Regions");
    fetchRegions();
  }, []);

  async function fetchRegions() {
    const regions = await RegionService.getAll();
    setRegions(regions);
    setIsLoading(false);
  }

  const header = () => {
    return (
      <CustomDatatableHeader
        onClickNew={openNew}
        onClickExport={exportExcel}
        globalSearchValue={globalSearchValue}
        onSearch={search}
      />
    );
  };

  async function search(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setGlobalSearchValue(newValue);
    const newRegions = await RegionService.search(newValue);
    setRegions(newRegions);
  }

  function openNew() {
    setRegion(emptyRegion);
    setSubmitted(false);
    setRegionDialog(true);
  }

  function hideDialog() {
    setSubmitted(false);
    setRegionDialog(false);
  }

  function hideDeleteRegionDialog() {
    setDeleteRegionDialog(false);
  }

  function editRegion(region: Region) {
    setRegion({ ...region });
    setRegionDialog(true);
  }

  function confirmDeleteRegion(region: Region) {
    setRegion(region);
    setDeleteRegionDialog(true);
  }

  function exportExcel() {
    import("xlsx").then((xlsx) => {
      const simpleRegions = regions.map((region) => {
        const { id, ...otherProps } = region;
        return {
          ...otherProps,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(simpleRegions);
      const workbook = {
        Sheets: { regions: worksheet },
        SheetNames: ["regions"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "regions");
    });
  }

  const actionBodyTemplate = (rowData: Region) => {
    return (
      <div className="flex gap-2 items-center justify-end">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          onClick={() => editRegion(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteRegion(rowData)}
        />
      </div>
    );
  };

  async function deleteRegion() {
    try {
      const isDelete = await RegionService.delete(region.id);
      if (!isDelete) throw new Error();
      setDeleteRegionDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Region Deleted",
        life: 3000,
      });
      fetchRegions();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Region NOT Deleted",
        life: 3000,
      });
    }
  }

  async function saveRegion() {
    setSubmitted(true);
    if (region.name.trim()) {
      try {
        if (region.id) {
          await RegionService.update(region);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Region Updated",
            life: 3000,
          });
        } else {
          await RegionService.create(region);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Region Created",
            life: 3000,
          });
        }
        fetchRegions();
        setRegionDialog(false);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3000,
        });
      }
    }
  }

  const regionDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveRegion} />
    </>
  );

  return (
    <AuthLayout>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <Toast ref={toast} />
          <DataTable
            ref={dt}
            value={regions}
            removableSort
            dataKey="id"
            loading={isLoading}
            header={header}
            globalFilterFields={["name"]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} regions"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No regions found."
          >
            <Column field="name" header="Name" sortable />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              className="w-10"
            />
          </DataTable>
          <Dialog
            visible={regionDialog}
            style={{ width: "40rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Region Details"
            modal
            footer={regionDialogFooter}
            onHide={hideDialog}
          >
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <InputText
                id="name"
                value={region.name}
                onChange={(event) =>
                  setRegion({ ...region, name: event.target.value })
                }
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !region.name,
                })}
              />
              {submitted && !region.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>
          </Dialog>
          <DeleteDialog
            visible={deleteRegionDialog}
            onHide={hideDeleteRegionDialog}
            onCancelDelete={hideDeleteRegionDialog}
            onConfirmDelete={deleteRegion}
            entity={region}
            entityName="region"
            entityDisplay={region.name}
          />
        </>
      )}
    </AuthLayout>
  );
}
