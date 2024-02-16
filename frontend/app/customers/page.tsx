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
import ContactService from "@/services/contact.service";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { MultiSelect } from "primereact/multiselect";

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
  contacts: [emptyContact],
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
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
  const [step, setStep] = useState(0);
  const [contactOption, setContactOption] = useState("existing");

  useEffect(() => {
    setTitle("Customers");
    fetchCustomers();
    fetchRegions();
    fetchContacts();
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

  async function fetchContacts() {
    const contacts = await ContactService.getAll();
    setContacts(contacts);
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

  function next() {
    setSubmitted(true);
    if (
      customer.name?.trim() &&
      customer.phoneNumber?.trim() &&
      customer.customerCode?.trim() &&
      customer.accountNumber
    ) {
      setSubmitted(false);
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
                  : rowData.contacts.map((contact: Contact) => contact.fullName)
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
                      setCustomer({
                        ...customer,
                        phoneNumber: event.target.value,
                      })
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
                      "p-invalid": submitted && !customer.customerCode,
                    })}
                  />
                  {submitted && !customer.customerCode && (
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
                      "p-invalid": submitted && !customer.accountNumber,
                    })}
                  />
                  {submitted && !customer.accountNumber && (
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
                      value="Mushroom"
                      onChange={(e) => {
                        setCustomer({ ...customer, contacts: [emptyContact] });
                        setContactOption(e.value);
                      }}
                      checked={contactOption === "Mushroom"}
                    />
                    <label htmlFor="new" className="ml-2">
                      Add New Contact
                    </label>
                  </div>
                </div>
                {contactOption === "existing" ? (
                  <>
                    <MultiSelect
                      value={customer.contacts}
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
                  </>
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
                        value={customer.contacts[0].firstName}
                        onChange={(event) =>
                          setCustomer({
                            ...customer,
                            contacts: [
                              {
                                ...customer.contacts[0],
                                firstName: event.target.value,
                              },
                            ],
                          })
                        }
                        required
                        autoFocus
                        className={classNames("w-1/2", {
                          "p-invalid":
                            submitted && !customer.contacts[0].firstName,
                        })}
                      />
                      {submitted && !customer.contacts[0].firstName && (
                        <small className="p-error">
                          First name is required.
                        </small>
                      )}
                    </div>
                    {/* <div className="field py-2 flex items-center gap-4">
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
                          "p-invalid": submitted && !contact.lastName,
                        })}
                      />
                      {submitted && !contact.lastName && (
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
                          "p-invalid": submitted && !contact.phoneNumber,
                        })}
                      />
                      {submitted && !contact.phoneNumber && (
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
                          "p-invalid": submitted && !contact.email,
                        })}
                      />
                      {submitted && !contact.email && (
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
                          "p-invalid": submitted && !contact.title,
                        })}
                      />
                      {submitted && !contact.title && (
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
                        className={classNames("w-1/2", {
                          "p-invalid": submitted && !contact.note,
                        })}
                      />
                      {submitted && !contact.note && (
                        <small className="p-error">Note is required.</small>
                      )}
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
                    </div> */}
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
