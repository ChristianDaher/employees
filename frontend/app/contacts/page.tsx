"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { Customer, Contact, Department } from "@/utils/interfaces/models";
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
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

const emptyContact: Contact = {
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
  customers: [
    {
      name: "",
      phoneNumber: "",
      note: "",
      customerCode: "",
      accountNumber: "",
      region: {
        name: "",
      },
      contacts: [],
    },
  ],
};

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [contactDialog, setContactDialog] = useState<boolean>(false);
  const [deleteContactDialog, setDeleteContactDialog] =
    useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Contact[]>>(null);
  const { setTitle } = useContext(NavbarContext);

  useEffect(() => {
    setTitle("Contacts");
    fetchContacts();
    fetchDepartments();
  }, []);

  async function fetchContacts() {
    const contacts = await ContactService.getAll();
    setContacts(contacts);
    setIsLoading(false);
  }

  async function fetchDepartments() {
    const departments = await DepartmentService.getAll();
    setDepartments(departments);
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
    setSubmitted(false);
    setContactDialog(true);
  }

  function hideDialog() {
    setSubmitted(false);
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
    setSubmitted(true);
    if (
      contact.firstName?.trim() &&
      contact.lastName?.trim() &&
      contact.phoneNumber?.trim() &&
      contact.email?.trim() &&
      contact.title?.trim()
    ) {
      try {
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
        setContactDialog(false);
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

  const contactDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveContact} />
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
              field="KOL"
              header="KOL"
              sortable
              body={(rowData) => <Checkbox checked={rowData.KOL} readOnly />}
            />
            <Column field="phoneNumber" header="Phone Number" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="title" header="Title" sortable />
            <Column field="note" header="Note" sortable />
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
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Contact Details"
            modal
            footer={contactDialogFooter}
            onHide={hideDialog}
          >
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
                  "p-invalid": submitted && !contact.firstName,
                })}
              />
              {submitted && !contact.firstName && (
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
                  "p-invalid": submitted && !contact.lastName,
                })}
              />
              {submitted && !contact.lastName && (
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
                  setContact({ ...contact, phoneNumber: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !contact.phoneNumber,
                })}
              />
              {submitted && !contact.phoneNumber && (
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
              <InputText
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
          </Dialog>
          <DeleteDialog
            visible={deleteContactDialog}
            onHide={hideDeleteContactDialog}
            onCancelDelete={hideDeleteContactDialog}
            onConfirmDelete={deleteContact}
            entity={contact}
            entityName="contact"
            entityDisplay={contact.name}
          />
        </>
      )}
    </AuthLayout>
  );
}
