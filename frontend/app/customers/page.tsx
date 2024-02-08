"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { Customer, Region } from "@/utils/interfaces/models";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import CustomDatatableHeader from "@/components/custom-datatable/header";
import { InputText } from "primereact/inputtext";
import { NavbarContext } from "@/components/contexts/navbar.context";
import DeleteDialog from "@/components/custom-datatable/dialog-delete";
import CustomerService from "@/services/customer.service";
import RegionService from "@/services/region.service";
import { Dropdown } from "primereact/dropdown";

const emptyCustomer: Customer = {
  name: "",
  phoneNumber: "",
  note: "",
  customerCode: "",
  accountNumber: 0,
  region: {
    name: "",
  },
  contacts: [
    {
      firstName: "",
      lastName: "",
      KOL: false,
      phoneNumber: "",
      email: "",
      title: "",
      note: "",
      department: {
        name:"",
      },
    },
  ],
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [regions, setRegions] = useState<Region[]>([]);
  const [customerDialog, setCustomerDialog] = useState<boolean>(false);
  const [deleteCustomerDialog, setDeleteCustomerDialog] =
    useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Customer[]>>(null);
  const { setTitle } = useContext(NavbarContext);

  useEffect(() => {
    setTitle("Customers");
    fetchCustomers();
    fetchRegions();
  }, []);

  async function fetchCustomers() {
    const customers = await CustomerService.getAll();
    console.log(customers)
    setCustomers(customers);
    setIsLoading(false);
  }

  async function fetchRegions() {
    const regions = await RegionService.getAll();
    setRegions(regions);
  }

  const header = () => {
    return (
      <CustomDatatableHeader
        onClickNew={openNew}
        onClickExport={exportCSV}
        globalSearchValue={globalSearchValue}
        onSearch={search}
      />
    );
  };

  async function search(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setGlobalSearchValue(newValue);
    const newCustomers = await CustomerService.search(newValue);
    setCustomers(newCustomers);
  }

  function openNew() {
    setCustomer(emptyCustomer);
    setSubmitted(false);
    setCustomerDialog(true);
  }

  function hideDialog() {
    setSubmitted(false);
    setCustomerDialog(false);
  }

  function hideDeleteUserDialog() {
    setDeleteCustomerDialog(false);
  }

  function editUser(customer: Customer) {
    setCustomer({ ...customer });
    setCustomerDialog(true);
  }

  function confirmDeleteUser(customer: Customer) {
    setCustomer(customer);
    setDeleteCustomerDialog(true);
  }

  function exportCSV() {
    dt.current?.exportCSV();
  }

  const actionBodyTemplate = (rowData: Customer) => {
    return (
      <div className="flex gap-2 items-center justify-end">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </div>
    );
  };

  async function deleteUser() {
    try {
      const isDelete = await CustomerService.delete(customer.id);
      if (!isDelete) throw new Error();
      setDeleteCustomerDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Customer Deleted",
        life: 3000,
      });
      fetchCustomers();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Customer NOT Deleted",
        life: 3000,
      });
    }
  }

  async function saveUser() {
    setSubmitted(true);
    if (
      customer.firstName?.trim() &&
      customer.lastName?.trim() &&
      customer.email?.trim() &&
      customer.phoneNumber?.trim()
    ) {
      try {
        if (customer.id) {
          await CustomerService.update(customer);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Customer Updated",
            life: 3000,
          });
        } else {
          await CustomerService.create(customer);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Customer Created",
            life: 3000,
          });
        }
        fetchCustomers();
        setCustomerDialog(false);
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

  const userDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveUser} />
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
            value={customers}
            removableSort
            dataKey="id"
            loading={isLoading}
            header={header}
            globalFilterFields={[
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "region",
            ]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No customers found."
          >
            <Column field="firstName" header="First Name" sortable />
            <Column field="lastName" header="Last Name" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="phoneNumber" header="Phone Number" sortable />
            <Column
              field="region"
              header="Region"
              body={(rowData) => rowData.region?.name ?? "Unspecified"}
              sortable
              sortField="region.name"
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              className="w-10"
            />
          </DataTable>
          <Dialog
            visible={customerDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Customer Details"
            modal
            footer={userDialogFooter}
            onHide={hideDialog}
          >
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="firstName" className="font-bold basis-1/3">
                First Name
              </label>
              <InputText
                id="firstName"
                value={customer.firstName}
                onChange={(event) =>
                  setCustomer({ ...customer, firstName: event.target.value })
                }
                required
                autoFocus
                className={classNames("basis-1/2", {
                  "p-invalid": submitted && !customer.firstName,
                })}
              />
              {submitted && !customer.firstName && (
                <small className="p-error">First name is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="lastName" className="font-bold basis-1/3">
                Last Name
              </label>
              <InputText
                id="lastName"
                value={customer.lastName}
                onChange={(event) =>
                  setCustomer({ ...customer, lastName: event.target.value })
                }
                required
                className={classNames("basis-1/2", {
                  "p-invalid": submitted && !customer.lastName,
                })}
              />
              {submitted && !customer.lastName && (
                <small className="p-error">Last name is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="email" className="font-bold basis-1/3">
                Email
              </label>
              <InputText
                id="email"
                value={customer.email}
                onChange={(event) =>
                  setCustomer({ ...customer, email: event.target.value })
                }
                required
                className={classNames("basis-1/2", {
                  "p-invalid": submitted && !customer.email,
                })}
              />
              {submitted && !customer.email && (
                <small className="p-error">Email is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="phoneNumber" className="font-bold basis-1/3">
                Phone number
              </label>
              <InputText
                id="phoneNumber"
                value={customer.phoneNumber}
                onChange={(event) =>
                  setCustomer({ ...customer, phoneNumber: event.target.value })
                }
                required
                className={classNames("basis-1/2", {
                  "p-invalid": submitted && !customer.phoneNumber,
                })}
              />
              {submitted && !customer.phoneNumber && (
                <small className="p-error">Phone number is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="region" className="font-bold basis-1/3">
                Region
              </label>
              <Dropdown
                value={customer.region}
                onChange={(event) =>
                  setCustomer({ ...customer, region: event.target.value })
                }
                options={regions}
                optionLabel="name"
                placeholder="Select a Region"
                filter
                className="basis-1/2"
              />
            </div>
          </Dialog>
          <DeleteDialog
            visible={deleteCustomerDialog}
            onHide={hideDeleteUserDialog}
            onCancelDelete={hideDeleteUserDialog}
            onConfirmDelete={deleteUser}
            entity={customer}
            entityName="customer"
            entityDisplay={customer.firstName + " " + customer.lastName}
          />
        </>
      )}
    </AuthLayout>
  );
}
