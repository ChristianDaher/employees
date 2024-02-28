"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { Plan, ContactCustomer } from "@/utils/interfaces/models";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import CustomDatatableHeader from "@/components/custom-datatable/header";
import { InputText } from "primereact/inputtext";
import { NavbarContext } from "@/components/contexts/navbar.context";
import DeleteDialog from "@/components/custom-datatable/dialog-delete";
import PlanService from "@/services/plan.service";
import ContactCustomerService from "@/services/contact-customer.service";
import { Dropdown } from "primereact/dropdown";
import { saveAsExcelFile } from "@/utils/helpers";

const emptyPlan: Plan = {
  date: new Date(),
  user: {
    firstName: "",
    lastName: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    department: {
      name: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  contactCustomer: {
    contact: {
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
    },
    customer: {
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
  },
  how: "",
  objective: "",
  output: "",
  offer: "",
  meeting: "",
  status: "",
  note: "",
  completedAt: new Date(),
};

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plan, setPlan] = useState<Plan>(emptyPlan);
  const [contactCustomers, setContactCustomers] = useState<ContactCustomer[]>(
    []
  );
  const [planDialog, setPlanDialog] = useState<boolean>(false);
  const [deletePlanDialog, setDeletePlanDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Plan[]>>(null);
  const { setTitle } = useContext(NavbarContext);

  useEffect(() => {
    setTitle("Plans");
    fetchPlans();
    fetchContactCustomers();
  }, []);

  async function fetchPlans() {
    const plans = await PlanService.getAll();
    plans.forEach((plan: Plan) => {
      if (plan.user)
        plan.user.fullName = `${plan.user.firstName} ${plan.user.lastName}`;
      plan.contactCustomer.contact.fullName = `${plan.user.firstName} ${plan.user.lastName}`;
    });
    setPlans(plans);
    setIsLoading(false);
  }

  async function fetchContactCustomers() {
    const contactCustomers = await ContactCustomerService.getAll();
    setContactCustomers(contactCustomers);
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
    const newPlans = await PlanService.search(newValue);
    setPlans(newPlans);
  }

  function openNew() {
    setPlan(emptyPlan);
    setSubmitted(false);
    setPlanDialog(true);
  }

  function hideDialog() {
    setSubmitted(false);
    setPlanDialog(false);
  }

  function hideDeletePlanDialog() {
    setDeletePlanDialog(false);
  }

  function editPlan(plan: Plan) {
    setPlan({ ...plan });
    setPlanDialog(true);
  }

  function confirmDeletePlan(plan: Plan) {
    setPlan(plan);
    setDeletePlanDialog(true);
  }

  function exportExcel() {
    import("xlsx").then((xlsx) => {
      const simplePlans = plans.map((plan) => {
        const { id, ...otherProps } = plan;
        return {
          ...otherProps,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(simplePlans);
      const workbook = {
        Sheets: { plans: worksheet },
        SheetNames: ["plans"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "plans");
    });
  }

  const actionBodyTemplate = (rowData: Plan) => {
    return (
      <div className="flex gap-2 items-center justify-end">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          onClick={() => editPlan(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeletePlan(rowData)}
        />
      </div>
    );
  };

  async function deletePlan() {
    try {
      const isDelete = await PlanService.delete(plan.id);
      if (!isDelete) throw new Error();
      setDeletePlanDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Plan Deleted",
        life: 3000,
      });
      fetchPlans();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Plan NOT Deleted",
        life: 3000,
      });
    }
  }

  async function savePlan() {
    setSubmitted(true);
    if (
      plan.date &&
      plan.contactCustomer &&
      plan.how?.trim() &&
      plan.objective?.trim() &&
      plan.output?.trim() &&
      plan.offer?.trim() &&
      plan.meeting?.trim() &&
      plan.status?.trim() &&
      plan.note?.trim()
    ) {
      try {
        if (plan.id) {
          await PlanService.update(plan);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Plan Updated",
            life: 3000,
          });
        } else {
          await PlanService.create(plan);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Plan Created",
            life: 3000,
          });
        }
        fetchPlans();
        setPlanDialog(false);
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

  const planDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={savePlan} />
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
            value={plans}
            removableSort
            dataKey="id"
            loading={isLoading}
            header={header}
            globalFilterFields={[
              "date",
              "user",
              "contactCustomer",
              "how",
              "objective",
              "output",
              "offer",
              "meeting",
              "status",
              "note",
              "completedAt",
            ]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} plans"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No plans found."
          >
            <Column field="date" header="Date" sortable />
            <Column
              field="user"
              header="User"
              body={(rowData) => rowData.user?.fullName ?? "Unspecified"}
              sortable
              sortField="user.fullName"
            />
            <Column
              field="contactCustomer"
              header="Contact"
              body={(rowData) => rowData.contactCustomer.contact.fullName}
              sortable
            />
            <Column
              field="contactCustomer"
              header="Customer"
              body={(rowData) => rowData.contactCustomer.customer.name}
              sortable
            />
            <Column field="how" header="How" sortable />
            <Column field="objective" header="Objective" sortable />
            <Column field="output" header="output" sortable />
            <Column field="offer" header="Offer" sortable />
            <Column field="meeting" header="Meeting" sortable />
            <Column field="status" header="Status" sortable />
            <Column field="note" header="Note" sortable />
            <Column field="completedAt" header="Completed At" sortable />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              className="w-10"
            />
          </DataTable>
          {/* <Dialog
            visible={planDialog}
            style={{ width: "40rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Plan Details"
            modal
            footer={planDialogFooter}
            onHide={hideDialog}
          >
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="firstName" className="font-bold basis-1/3">
                First Name
              </label>
              <InputText
                id="firstName"
                value={plan.firstName}
                onChange={(event) =>
                  setPlan({ ...plan, firstName: event.target.value })
                }
                required
                autoFocus
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.firstName,
                })}
              />
              {submitted && !plan.firstName && (
                <small className="p-error">First name is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="lastName" className="font-bold basis-1/3">
                Last Name
              </label>
              <InputText
                id="lastName"
                value={plan.lastName}
                onChange={(event) =>
                  setPlan({ ...plan, lastName: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.lastName,
                })}
              />
              {submitted && !plan.lastName && (
                <small className="p-error">Last name is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="email" className="font-bold basis-1/3">
                Email
              </label>
              <InputText
                id="email"
                value={plan.email}
                onChange={(event) =>
                  setPlan({ ...plan, email: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid":
                    submitted && (!plan.email || !isValidEmail(plan.email)),
                })}
              />
              {submitted && (!plan.email || !isValidEmail(plan.email)) && (
                <small className="p-error">Email is required or invalid.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="phoneNumber" className="font-bold basis-1/3">
                Phone number
              </label>
              <InputText
                id="phoneNumber"
                value={plan.phoneNumber}
                onChange={(event) =>
                  setPlan({ ...plan, phoneNumber: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.phoneNumber,
                })}
              />
              {submitted && !plan.phoneNumber && (
                <small className="p-error">Phone number is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="department" className="font-bold basis-1/3">
                ContactCustomer
              </label>
              <Dropdown
                value={plan.department}
                onChange={(event) =>
                  setPlan({ ...plan, department: event.target.value })
                }
                options={contactCustomers}
                optionLabel="name"
                placeholder="Select a ContactCustomer"
                filter
                className="w-1/2"
              />
            </div>
          </Dialog>
          <DeleteDialog
            visible={deletePlanDialog}
            onHide={hideDeletePlanDialog}
            onCancelDelete={hideDeletePlanDialog}
            onConfirmDelete={deletePlan}
            entity={plan}
            entityName="plan"
            entityDisplay={plan.fullName}
          /> */}
        </>
      )}
    </AuthLayout>
  );
}
