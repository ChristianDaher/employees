"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { Department } from "@/utils/interfaces/models";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import CustomDatatableHeader from "@/components/custom-datatable/header";
import { InputText } from "primereact/inputtext";
import { NavbarContext } from "@/components/contexts/navbar.context";
import DeleteDialog from "@/components/custom-datatable/dialog-delete";
import DepartmentService from "@/services/department.service";
import { saveAsExcelFile } from "@/utils/helpers";

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
  const { setTitle } = useContext(NavbarContext);

  useEffect(() => {
    setTitle("Departments");
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    const departments = await DepartmentService.getAll();
    setDepartments(departments);
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
    const newDepartments = await DepartmentService.search(newValue);
    setDepartments(newDepartments);
  }

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

  function exportExcel() {
    import("xlsx").then((xlsx) => {
      const simpleDepartments = departments.map((department) => {
        const { id, ...otherProps } = department;
        return {
          ...otherProps,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(simpleDepartments);
      const workbook = {
        Sheets: { departments: worksheet },
        SheetNames: ["departments"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "departments");
    });
  }

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

  async function deleteDepartment() {
    try {
      const isDelete = await DepartmentService.delete(department.id);
      if (!isDelete) throw new Error();
      setDeleteDepartmentDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Department Deleted",
        life: 3000,
      });
      fetchDepartments();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Department NOT Deleted",
        life: 3000,
      });
    }
  }

  async function saveDepartment() {
    setSubmitted(true);
    if (department.name.trim()) {
      try {
        if (department.id) {
          await DepartmentService.update(department);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Department Updated",
            life: 3000,
          });
        } else {
          await DepartmentService.create(department);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Department Created",
            life: 3000,
          });
        }
        fetchDepartments();
        setDepartmentDialog(false);
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
            />
          </DataTable>
          <Dialog
            visible={departmentDialog}
            style={{ width: "40rem" }}
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
          <DeleteDialog
            visible={deleteDepartmentDialog}
            onHide={hideDeleteDepartmentDialog}
            onCancelDelete={hideDeleteDepartmentDialog}
            onConfirmDelete={deleteDepartment}
            entity={department}
            entityName="department"
            entityDisplay={department.name}
          />
        </>
      )}
    </AuthLayout>
  );
}
