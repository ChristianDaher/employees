"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { Contact, Customer, Region } from "@/utils/interfaces/models";
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
  accountNumber: "",
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
        name: "",
      },
      customers: [],
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

  function hideDeleteCustomerDialog() {
    setDeleteCustomerDialog(false);
  }

  function editCustomer(customer: Customer) {
    setCustomer({ ...customer });
    setCustomerDialog(true);
  }

  function confirmdeleteCustomer(customer: Customer) {
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
          onClick={() => editCustomer(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmdeleteCustomer(rowData)}
        />
      </div>
    );
  };

  async function deleteCustomer() {
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

  async function saveCustomer() {
    setSubmitted(true);
    if (
      customer.name?.trim() &&
      customer.phoneNumber?.trim() &&
      customer.customerCode?.trim() &&
      customer.accountNumber
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

  const customerDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveCustomer} />
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
              "name",
              "phoneNumber",
              "note",
              "customerCode",
              "accountNumber",
              "region",
              "contacts",
            ]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No customers found."
          >
            <Column field="name" header="Name" sortable />
            <Column field="phoneNumber" header="Phone Number" sortable />
            <Column field="note" header="Note" sortable />
            <Column field="customerCode" header="Customer Code" sortable />
            <Column field="accountNumber" header="Account Number" sortable />
            <Column
              field="region"
              header="Region"
              body={(rowData: Customer) =>
                rowData.region?.name ?? "Unspecified"
              }
              sortable
              sortField="region.name"
            />
            <Column
              field="contacts"
              header="Contacts"
              body={(rowData: Customer) =>
                rowData.contacts.length === 0
                  ? "None"
                  : rowData.contacts
                      .map(
                        (contact: Contact) =>
                          `${contact.firstName} ${contact.lastName}`
                      )
                      .join(", ")
              }
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
            footer={customerDialogFooter}
            onHide={hideDialog}
          >
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="name" className="font-bold basis-1/3">
                Name
              </label>
              <InputText
                id="name"
                value={customer.name}
                onChange={(event) =>
                  setCustomer({ ...customer, name: event.target.value })
                }
                required
                autoFocus
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !customer.name,
                })}
              />
              {submitted && !customer.name && (
                <small className="p-error">Name is required.</small>
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
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !customer.phoneNumber,
                })}
              />
              {submitted && !customer.phoneNumber && (
                <small className="p-error">Phone number is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="note" className="font-bold basis-1/3">
                Note
              </label>
              <InputText
                id="note"
                value={customer.note}
                onChange={(event) =>
                  setCustomer({ ...customer, note: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !customer.note,
                })}
              />
              {submitted && !customer.note && (
                <small className="p-error">Note is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="customerCode" className="font-bold basis-1/3">
                Customer code
              </label>
              <InputText
                id="customerCode"
                value={customer.customerCode}
                onChange={(event) =>
                  setCustomer({ ...customer, customerCode: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !customer.customerCode,
                })}
              />
              {submitted && !customer.customerCode && (
                <small className="p-error">Customer code is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="accountNumber" className="font-bold basis-1/3">
                Account number
              </label>
              <InputText
                id="accountNumber"
                value={customer.accountNumber}
                onChange={(event) =>
                  setCustomer({
                    ...customer,
                    accountNumber: event.target.value,
                  })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !customer.accountNumber,
                })}
              />
              {submitted && !customer.customerCode && (
                <small className="p-error">Account number is required.</small>
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
                className="w-1/2"
              />
            </div>
          </Dialog>
          <DeleteDialog
            visible={deleteCustomerDialog}
            onHide={hideDeleteCustomerDialog}
            onCancelDelete={hideDeleteCustomerDialog}
            onConfirmDelete={deleteCustomer}
            entity={customer}
            entityName="customer"
            entityDisplay={customer.name}
          />
        </>
      )}
    </AuthLayout>
  );
}
