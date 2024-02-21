"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import {
  Customer,
  Contact,
  Department,
  Region,
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
import ContactService from "@/services/contact.service";
import DepartmentService from "@/services/department.service";
import CustomerService from "@/services/customer.service";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { MultiSelect } from "primereact/multiselect";
import RegionService from "@/services/region.service";

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

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [contactDialog, setContactDialog] = useState<boolean>(false);
  const [deleteContactDialog, setDeleteContactDialog] =
    useState<boolean>(false);
  const [customerSubmitted, setCustomerSubmitted] = useState<boolean>(false);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Contact[]>>(null);
  const { setTitle } = useContext(NavbarContext);
  const [step, setStep] = useState(0);
  const [customerOption, setCustomerOption] = useState("existing");

  useEffect(() => {
    setTitle("Contacts");
    fetchContacts();
    fetchDepartments();
    fetchCustomers();
  }, []);

  async function fetchContacts() {
    const contacts = await ContactService.getAll();
    contacts.forEach((contact: Contact) => {
      contact.fullName = `${contact.firstName} ${contact.lastName}`;
    });
    setContacts(contacts);
    setIsLoading(false);
  }

  async function fetchDepartments() {
    const departments = await DepartmentService.getAll();
    setDepartments(departments);
  }

  async function fetchCustomers() {
    const customers = await CustomerService.getAll();
    setCustomers(customers);
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
    const newContacts = await ContactService.search(newValue);
    setContacts(newContacts);
  }

  function openNew() {
    setContact(emptyContact);
    setContactSubmitted(false);
    setCustomerSubmitted(false);
    setContactDialog(true);
  }

  function hideDialog() {
    setContactSubmitted(false);
    setCustomerSubmitted(false);
    setContactDialog(false);
  }

  function hideDeleteContactDialog() {
    setDeleteContactDialog(false);
  }

  function editContact(contact: Contact) {
    setContact({ ...contact });
    setContactDialog(true);
  }

  function confirmDeleteContact(contact: Contact) {
    setContact(contact);
    setDeleteContactDialog(true);
  }

  function exportCSV() {
    dt.current?.exportCSV();
  }

  const actionBodyTemplate = (rowData: Contact) => {
    return (
      <div className="flex gap-2 items-center justify-end">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          onClick={() => editContact(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteContact(rowData)}
        />
      </div>
    );
  };

  async function deleteContact() {
    try {
      const isDelete = await ContactService.delete(contact.id);
      if (!isDelete) throw new Error();
      setDeleteContactDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Contact Deleted",
        life: 3000,
      });
      fetchContacts();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Contact NOT Deleted",
        life: 3000,
      });
    }
  }

  async function saveContact() {
    if (customerOption === "new") setCustomerSubmitted(true);
    if (
      (customer.name?.trim() &&
        customer.phoneNumber?.trim() &&
        customer.customerCode?.trim() &&
        customer.accountNumber &&
        customerOption === "new") ||
      customerOption === "existing"
    ) {
      try {
        contact.customers =
          customerOption === "existing" ? contact.customers : [customer];
        if (contact.id) {
          await ContactService.update(contact);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Contact Updated",
            life: 3000,
          });
        } else {
          await ContactService.create(contact);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Contact Created",
            life: 3000,
          });
        }
        fetchContacts();
        fetchCustomers();
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
    setContactSubmitted(true);
    if (
      contact.firstName?.trim() &&
      contact.lastName?.trim() &&
      contact.phoneNumber?.trim() &&
      contact.email?.trim() &&
      contact.title?.trim()
    ) {
      setStep(step + 1);
    }
  }

  const contactDialogFooter = (
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
          <Button label="Save" icon="pi pi-check" onClick={saveContact} />
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
            value={contacts}
            removableSort
            dataKey="id"
            loading={isLoading}
            header={header}
            globalFilterFields={[
              "firstName",
              "lastName",
              "KOL",
              "phoneNumber",
              "email",
              "title",
              "note",
              "department",
              "customers",
            ]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contacts"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No contacts found."
          >
            <Column field="firstName" header="First Name" sortable />
            <Column field="lastName" header="Last Name" sortable />
            <Column
              className="text-center"
              field="KOL"
              header="KOL"
              sortable
              body={(rowData) => <Checkbox checked={rowData.KOL} readOnly />}
            />
            <Column field="phoneNumber" header="Phone Number" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="title" header="Title" sortable />
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
            <Column
              field="department"
              header="Department"
              body={(rowData: Contact) =>
                rowData.department?.name ?? "Unspecified"
              }
              sortable
              sortField="department.name"
            />
            <Column
              field="customers"
              header="Customers"
              body={(rowData: Contact) =>
                rowData.customers.length === 0
                  ? "None"
                  : rowData.customers
                      .map((cusomer: Customer) => cusomer.name)
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
            visible={contactDialog}
            style={{ width: "40rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Contact Details"
            modal
            footer={contactDialogFooter}
            onHide={hideDialog}
          >
            {step === 0 ? (
              <>
                <div className="field py-2 flex items-center gap-4">
                  <label htmlFor="firstName" className="font-bold basis-1/3">
                    First name
                  </label>
                  <InputText
                    id="firstName"
                    value={contact.firstName}
                    onChange={(event) =>
                      setContact({ ...contact, firstName: event.target.value })
                    }
                    required
                    autoFocus
                    className={classNames("w-1/2", {
                      "p-invalid": contactSubmitted && !contact.firstName,
                    })}
                  />
                  {contactSubmitted && !contact.firstName && (
                    <small className="p-error">First name is required.</small>
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
                      setContact({ ...contact, lastName: event.target.value })
                    }
                    required
                    className={classNames("w-1/2", {
                      "p-invalid": contactSubmitted && !contact.lastName,
                    })}
                  />
                  {contactSubmitted && !contact.lastName && (
                    <small className="p-error">Last name is required.</small>
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
                  <label htmlFor="phoneNumber" className="font-bold basis-1/3">
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
                    <small className="p-error">Phone number is required.</small>
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
                  <label htmlFor="department" className="font-bold basis-1/3">
                    Department
                  </label>
                  <Dropdown
                    value={contact.department}
                    onChange={(event) =>
                      setContact({ ...contact, department: event.target.value })
                    }
                    options={departments}
                    optionLabel="name"
                    placeholder="Select a Department"
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
                      name="customer"
                      value="existing"
                      onChange={(e) => {
                        setContact({ ...contact, customers: [] });
                        setCustomerOption(e.value);
                      }}
                      checked={customerOption === "existing"}
                    />
                    <label htmlFor="existing" className="ml-2">
                      Use Existing Customers
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioButton
                      inputId="new"
                      name="customer"
                      value="Mushroom"
                      onChange={(e) => {
                        setContact({ ...contact, customers: [emptyCustomer] });
                        setCustomerOption(e.value);
                      }}
                      checked={customerOption === "Mushroom"}
                    />
                    <label htmlFor="new" className="ml-2">
                      Add New Customer
                    </label>
                  </div>
                </div>
                {customerOption === "existing" ? (
                  <MultiSelect
                    value={customers.filter((customer) =>
                      contact.customers.some((c) => c.id === customer.id)
                    )}
                    onChange={(event) =>
                      setContact({
                        ...contact,
                        customers: event.target.value,
                      })
                    }
                    options={customers}
                    optionLabel="name"
                    placeholder="Select Customers"
                    filter
                    maxSelectedLabels={3}
                    selectedItemsLabel="{0} Customers Selected"
                  />
                ) : (
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
                      <label
                        htmlFor="phoneNumber"
                        className="font-bold basis-1/3"
                      >
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
                          "p-invalid":
                            customerSubmitted && !customer.phoneNumber,
                        })}
                      />
                      {customerSubmitted && !customer.phoneNumber && (
                        <small className="p-error">
                          Phone number is required.
                        </small>
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
                      <label
                        htmlFor="customerCode"
                        className="font-bold basis-1/3"
                      >
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
                          "p-invalid":
                            customerSubmitted && !customer.customerCode,
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
                          "p-invalid":
                            customerSubmitted && !customer.accountNumber,
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
                          setCustomer({
                            ...customer,
                            region: event.target.value,
                          })
                        }
                        options={regions}
                        optionLabel="name"
                        placeholder="Select a Region"
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
            visible={deleteContactDialog}
            onHide={hideDeleteContactDialog}
            onCancelDelete={hideDeleteContactDialog}
            onConfirmDelete={deleteContact}
            entity={contact}
            entityName="contact"
            entityDisplay={contact.fullName}
          />
        </>
      )}
    </AuthLayout>
  );
}
