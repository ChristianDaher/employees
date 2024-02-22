"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import {
  Contact,
  Customer,
  Region,
  Department,
} from "@/utils/interfaces/models";
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
import ContactService from "@/services/contact.service";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import DepartmentService from "@/services/department.service";
import { saveAsExcelFile } from "@/utils/helpers";

const emptyContact: Contact = {
  firstName: "",
  lastName: "",
  fullName: "",
  KOL: false,
  phoneNumber: "",
  email: "",
  title: "",
  note: "",
  department: {
    name: "",
  },
  customers: [],
};

const emptyCustomer: Customer = {
  name: "",
  phoneNumber: "",
  note: "",
  customerCode: "",
  accountNumber: "",
  region: {
    name: "",
  },
  contacts: [],
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [regions, setRegions] = useState<Region[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [customerDialog, setCustomerDialog] = useState<boolean>(false);
  const [deleteCustomerDialog, setDeleteCustomerDialog] =
    useState<boolean>(false);
  const [customerSubmitted, setCustomerSubmitted] = useState<boolean>(false);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Customer[]>>(null);
  const { setTitle } = useContext(NavbarContext);
  const [step, setStep] = useState(0);
  const [contactOption, setContactOption] = useState("existing");

  useEffect(() => {
    setTitle("Customers");
    fetchCustomers();
    fetchRegions();
    fetchContacts();
    fetchDepartments();
  }, []);

  async function fetchCustomers() {
    const customers = await CustomerService.getAll();
    customers.forEach((customer: Customer) => {
      customer.contacts.forEach((contact: Contact) => {
        contact.fullName = `${contact.firstName} ${contact.lastName}`;
      });
    });
    setCustomers(customers);
    setIsLoading(false);
  }

  async function fetchRegions() {
    const regions = await RegionService.getAll();
    setRegions(regions);
  }

  async function fetchContacts() {
    const contacts = await ContactService.getAll();
    contacts.forEach((contact: Contact) => {
      contact.fullName = `${contact.firstName} ${contact.lastName}`;
    });
    setContacts(contacts);
  }

  async function fetchDepartments() {
    const departments = await DepartmentService.getAll();
    setDepartments(departments);
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
    const newCustomers = await CustomerService.search(newValue);
    setCustomers(newCustomers);
  }

  function openNew() {
    setCustomer(emptyCustomer);
    setCustomerSubmitted(false);
    setContactSubmitted(false);
    setCustomerDialog(true);
  }

  function hideDialog() {
    setContactSubmitted(false);
    setCustomerDialog(false);
    setCustomerSubmitted(false);
    setTimeout(() => {
      setStep(0);
    }, 400);
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

  function exportExcel() {
    import("xlsx").then((xlsx) => {
      const simpleCustomers = customers.map((customer) => {
        const {
          id,
          name,
          phoneNumber,
          note,
          customerCode,
          accountNumber,
          region,
          contacts,
          ...otherProps
        } = customer;
        return {
          name,
          phoneNumber,
          note,
          customerCode,
          accountNumber,
          region: customer.region?.name ?? "Unspecified",
          contacts:
            customer.contacts.length === 0
              ? "None"
              : customer.contacts
                  .map((contact: Contact) => contact.fullName)
                  .join(", "),
          ...otherProps,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(simpleCustomers);
      const workbook = {
        Sheets: { customers: worksheet },
        SheetNames: ["customers"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "customers");
    });
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
    if (contactOption === "new") setContactSubmitted(true);
    if (
      (contact.firstName?.trim() &&
        contact.lastName?.trim() &&
        contact.phoneNumber?.trim() &&
        contact.email?.trim() &&
        contact.title?.trim() &&
        contactOption === "new") ||
      contactOption === "existing"
    ) {
      try {
        customer.contacts =
          contactOption === "existing" ? customer.contacts : [contact];
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
        fetchContacts();
        setCustomer(emptyCustomer);
        setContact(emptyContact);
        setContactOption("existing");
        hideDialog();
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

  function next() {
    setCustomerSubmitted(true);
    if (
      customer.name?.trim() &&
      customer.phoneNumber?.trim() &&
      customer.customerCode?.trim() &&
      customer.accountNumber
    ) {
      setStep(step + 1);
    }
  }

  const customerDialogFooter = (
    <>
      {step === 0 ? (
        <>
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={hideDialog}
          />
          <Button label="Next" icon="pi pi-arrow-right" onClick={next} />
        </>
      ) : (
        <>
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            outlined
            onClick={() => setStep(step - 1)}
          />
          <Button label="Save" icon="pi pi-check" onClick={saveCustomer} />
        </>
      )}
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
            resizableColumns
            columnResizeMode="expand"
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
            <Column
              field="note"
              header="Note"
              sortable
              body={(rowData) => (
                <InputTextarea
                  className="w-full"
                  value={rowData.note}
                  readOnly
                />
              )}
            />
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
                      .map((contact: Contact) => contact.fullName)
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
            style={{ width: "40rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Customer Details"
            modal
            footer={customerDialogFooter}
            onHide={hideDialog}
          >
            {step === 0 ? (
              <>
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
                      "p-invalid": customerSubmitted && !customer.name,
                    })}
                  />
                  {customerSubmitted && !customer.name && (
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
                      setCustomer({
                        ...customer,
                        phoneNumber: event.target.value,
                      })
                    }
                    required
                    className={classNames("w-1/2", {
                      "p-invalid": customerSubmitted && !customer.phoneNumber,
                    })}
                  />
                  {customerSubmitted && !customer.phoneNumber && (
                    <small className="p-error">Phone number is required.</small>
                  )}
                </div>
                <div className="field py-2 flex items-center gap-4">
                  <label htmlFor="note" className="font-bold basis-1/3">
                    Note
                  </label>
                  <InputTextarea
                    id="note"
                    value={customer.note}
                    onChange={(event) =>
                      setCustomer({ ...customer, note: event.target.value })
                    }
                    required
                    className={classNames("w-1/2")}
                  />
                </div>
                <div className="field py-2 flex items-center gap-4">
                  <label htmlFor="customerCode" className="font-bold basis-1/3">
                    Customer code
                  </label>
                  <InputText
                    id="customerCode"
                    value={customer.customerCode}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        customerCode: event.target.value,
                      })
                    }
                    required
                    className={classNames("w-1/2", {
                      "p-invalid": customerSubmitted && !customer.customerCode,
                    })}
                  />
                  {customerSubmitted && !customer.customerCode && (
                    <small className="p-error">
                      Customer code is required.
                    </small>
                  )}
                </div>
                <div className="field py-2 flex items-center gap-4">
                  <label
                    htmlFor="accountNumber"
                    className="font-bold basis-1/3"
                  >
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
                      "p-invalid": customerSubmitted && !customer.accountNumber,
                    })}
                  />
                  {customerSubmitted && !customer.accountNumber && (
                    <small className="p-error">
                      Account number is required.
                    </small>
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
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-4 my-2">
                  <div className="flex items-center">
                    <RadioButton
                      inputId="existing"
                      name="contact"
                      value="existing"
                      onChange={(e) => {
                        setCustomer({ ...customer, contacts: [] });
                        setContactOption(e.value);
                      }}
                      checked={contactOption === "existing"}
                    />
                    <label htmlFor="existing" className="ml-2">
                      Use Existing Contacts
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioButton
                      inputId="new"
                      name="contact"
                      value="new"
                      onChange={(e) => {
                        setCustomer({ ...customer, contacts: [emptyContact] });
                        setContactOption(e.value);
                      }}
                      checked={contactOption === "new"}
                    />
                    <label htmlFor="new" className="ml-2">
                      Add New Contact
                    </label>
                  </div>
                </div>
                {contactOption === "existing" ? (
                  <MultiSelect
                    value={contacts.filter((contact) =>
                      customer.contacts.some((c) => c.id === contact.id)
                    )}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        contacts: event.target.value,
                      })
                    }
                    options={contacts}
                    optionLabel="fullName"
                    placeholder="Select Contacts"
                    filter
                    maxSelectedLabels={3}
                    selectedItemsLabel="{0} Contacts Selected"
                  />
                ) : (
                  <>
                    <div className="field py-2 flex items-center gap-4">
                      <label
                        htmlFor="firstName"
                        className="font-bold basis-1/3"
                      >
                        First name
                      </label>
                      <InputText
                        id="firstName"
                        value={contact.firstName}
                        onChange={(event) =>
                          setContact({
                            ...contact,
                            firstName: event.target.value,
                          })
                        }
                        required
                        autoFocus
                        className={classNames("w-1/2", {
                          "p-invalid": contactSubmitted && !contact.firstName,
                        })}
                      />
                      {contactSubmitted && !contact.firstName && (
                        <small className="p-error">
                          First name is required.
                        </small>
                      )}
                    </div>
                    <div className="field py-2 flex items-center gap-4">
                      <label htmlFor="lastName" className="font-bold basis-1/3">
                        Last name
                      </label>
                      <InputText
                        id="lastName"
                        value={contact.lastName}
                        onChange={(event) =>
                          setContact({
                            ...contact,
                            lastName: event.target.value,
                          })
                        }
                        required
                        className={classNames("w-1/2", {
                          "p-invalid": contactSubmitted && !contact.lastName,
                        })}
                      />
                      {contactSubmitted && !contact.lastName && (
                        <small className="p-error">
                          Last name is required.
                        </small>
                      )}
                    </div>
                    <div className="field py-2 flex items-center gap-4">
                      <label htmlFor="KOL" className="font-bold basis-1/3">
                        KOL
                      </label>
                      <Checkbox
                        id="KOL"
                        checked={contact.KOL}
                        onChange={(event) =>
                          setContact({ ...contact, KOL: event.checked })
                        }
                        required
                      />
                    </div>
                    <div className="field py-2 flex items-center gap-4">
                      <label
                        htmlFor="phoneNumber"
                        className="font-bold basis-1/3"
                      >
                        Phone number
                      </label>
                      <InputText
                        id="phoneNumber"
                        value={contact.phoneNumber}
                        onChange={(event) =>
                          setContact({
                            ...contact,
                            phoneNumber: event.target.value,
                          })
                        }
                        required
                        className={classNames("w-1/2", {
                          "p-invalid": contactSubmitted && !contact.phoneNumber,
                        })}
                      />
                      {contactSubmitted && !contact.phoneNumber && (
                        <small className="p-error">
                          Phone number is required.
                        </small>
                      )}
                    </div>
                    <div className="field py-2 flex items-center gap-4">
                      <label htmlFor="email" className="font-bold basis-1/3">
                        Email
                      </label>
                      <InputText
                        id="email"
                        value={contact.email}
                        onChange={(event) =>
                          setContact({ ...contact, email: event.target.value })
                        }
                        required
                        className={classNames("w-1/2", {
                          "p-invalid": contactSubmitted && !contact.email,
                        })}
                      />
                      {contactSubmitted && !contact.email && (
                        <small className="p-error">Email is required.</small>
                      )}
                    </div>
                    <div className="field py-2 flex items-center gap-4">
                      <label htmlFor="title" className="font-bold basis-1/3">
                        Title
                      </label>
                      <InputText
                        id="title"
                        value={contact.title}
                        onChange={(event) =>
                          setContact({ ...contact, title: event.target.value })
                        }
                        required
                        className={classNames("w-1/2", {
                          "p-invalid": contactSubmitted && !contact.title,
                        })}
                      />
                      {contactSubmitted && !contact.title && (
                        <small className="p-error">Title is required.</small>
                      )}
                    </div>
                    <div className="field py-2 flex items-center gap-4">
                      <label htmlFor="note" className="font-bold basis-1/3">
                        Note
                      </label>
                      <InputTextarea
                        id="note"
                        value={contact.note}
                        onChange={(event) =>
                          setContact({ ...contact, note: event.target.value })
                        }
                        required
                        className={classNames("w-1/2")}
                      />
                    </div>
                    <div className="field py-2 flex items-center gap-4">
                      <label
                        htmlFor="department"
                        className="font-bold basis-1/3"
                      >
                        Department
                      </label>
                      <Dropdown
                        value={contact.department}
                        onChange={(event) =>
                          setContact({
                            ...contact,
                            department: event.target.value,
                          })
                        }
                        options={departments}
                        optionLabel="name"
                        placeholder="Select a Department"
                        filter
                        className="w-1/2"
                      />
                    </div>
                  </>
                )}
              </>
            )}
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
