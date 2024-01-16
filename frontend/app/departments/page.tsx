"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { Department } from "@/utils/interfaces/models";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import Clear from "@/components/custom-datatable/clear";
import GlobalSearch from "@/components/custom-datatable/global-search";
import { InputText } from "primereact/inputtext";

const emptyDepartment: Department = {
  name: "",
};

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<Department>(emptyDepartment);
  const [departmentDialog, setDepartmentDialog] = useState<boolean>(false);
  const [deleteDepartmentDialog, setDeleteDepartmentDialog] =
    useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Department[]>>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/departments`)
      .then((response) => response.json())
      .then((data: Department[]) => {
        setDepartments(data);
        setIsLoading(false);
      });
  }, []);

  function clear() {
    setGlobalSearchValue("");
  }

  const header = () => {
    return (
      <div className="flex justify-between">
        <Clear onClick={clear} />
        <GlobalSearch
          value={globalSearchValue}
          onClick={(event) => setGlobalSearchValue(event.target.value)}
        />
      </div>
    );
  };

  function openNew() {
    setDepartment(emptyDepartment);
    setSubmitted(false);
    setDepartmentDialog(true);
  }

  function hideDialog() {
    setSubmitted(false);
    setDepartmentDialog(false);
  }

  function hideDeleteDepartmentDialog() {
    setDeleteDepartmentDialog(false);
  }

  function editDepartment(department: Department) {
    setDepartment({ ...department });
    setDepartmentDialog(true);
  }

  function confirmDeleteDepartment(department: Department) {
    setDepartment(department);
    setDeleteDepartmentDialog(true);
  }

  function exportCSV() {
    dt.current?.exportCSV();
  }

  const startToolbarTemplate = () => {
    return (
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        onClick={openNew}
      />
    );
  };

  const endToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const actionBodyTemplate = (rowData: Department) => {
    return (
      <div className="flex gap-2 items-center justify-end">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          onClick={() => editDepartment(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteDepartment(rowData)}
        />
      </div>
    );
  };

  const deleteDepartmentDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteDepartmentDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteDepartment}
      />
    </>
  );

  function deleteDepartment() {
    setDeleteDepartmentDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Department Deleted",
      life: 3000,
    });
  }

  function saveDepartment() {
    setSubmitted(true);

    if (department.name.trim()) {
      if (department.id) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Department Updated",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Department Created",
          life: 3000,
        });
      }

      setDepartmentDialog(false);
    }
  }

  const departmentDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveDepartment} />
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
          <Toolbar
            className="mb-4"
            start={startToolbarTemplate}
            end={endToolbarTemplate}
          />
          <DataTable
            ref={dt}
            value={departments}
            removableSort
            dataKey="id"
            loading={isLoading}
            header={header}
            globalFilterFields={["name"]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} departments"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No departments found."
          >
            <Column field="name" header="Name" sortable />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              className="w-10"
            ></Column>
          </DataTable>

          <Dialog
            visible={departmentDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Department Details"
            modal
            footer={departmentDialogFooter}
            onHide={hideDialog}
          >
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <InputText
                id="name"
                value={department.name}
                onChange={(event) =>
                  setDepartment({ ...department, name: event.target.value })
                }
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !department.name,
                })}
              />
              {submitted && !department.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteDepartmentDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirm"
            modal
            footer={deleteDepartmentDialogFooter}
            onHide={hideDeleteDepartmentDialog}
          >
            <div className="confirmation-content flex items-center gap-4">
              <i
                className="pi pi-exclamation-triangle"
                style={{ fontSize: "2rem" }}
              />
              {department && (
                <span>
                  Are you sure you want to delete the <b>{department.name}</b>{" "}
                  department?
                </span>
              )}
            </div>
          </Dialog>
        </>
      )}
    </AuthLayout>
  );
}
