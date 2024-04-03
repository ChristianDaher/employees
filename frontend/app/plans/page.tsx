"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { Plan, ContactCustomer, User, Customer, Contact } from "@/utils/interfaces/models";
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
import UserService from "@/services/user.service";
import ContactCustomerService from "@/services/contact-customer.service";
import { Dropdown } from "primereact/dropdown";
import { saveAsExcelFile } from "@/utils/helpers";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

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
    },
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
  const [users, setUsers] = useState<User[]>([]);
  const [contactCustomers, setContactCustomers] = useState<ContactCustomer[]>(
    []
  );
  const [uniqueCustNames, setUniqueNames] = useState<any>([]);
  const [uniqueContactNames, setUniqueContactNames] = useState<any>([]);
  

  const [planDialog, setPlanDialog] = useState<boolean>(false);
  const [deletePlanDialog, setDeletePlanDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const [globalDateSearchValue, setGlobalDateSearchValue] = useState<string>("");

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Plan[]>>(null);
  const { setTitle } = useContext(NavbarContext);

  useEffect(() => {
    setTitle("Plans");
    fetchPlans();
    fetchUsers();
    fetchContactCustomers();
  }, []);

  async function fetchPlans() {
    const plans = await PlanService.search('','plans');
    plans.forEach((plan: Plan) => {
      console.log("DATE FOR FETCHED PLAN , " , plan.date)

      if (plan.user)
        plan.user.fullName = `${plan.user.firstName} ${plan.user.lastName}`;
      plan.contactCustomer.contact.fullName = `${plan.contactCustomer.contact.firstName} ${plan.contactCustomer.contact.lastName}`;
      plan.contactCustomer.label = `${plan.contactCustomer.contact.fullName} for ${plan.contactCustomer.customer.name}`;
      plan.contactCustomer.contact.departmentId =
        plan.contactCustomer.contact.department.id;
      delete plan.contactCustomer.contact.department;
      plan.contactCustomer.customer.regionId =
        plan.contactCustomer.customer.region.id;
      delete plan.contactCustomer.customer.region;
    });
    setPlans(plans);
    setIsLoading(false);
  }

  async function fetchContactCustomers() {
    const contactCustomers = await ContactCustomerService.getAll();
    contactCustomers.forEach((contactCustomer: ContactCustomer) => {
      contactCustomer.contact.fullName = `${contactCustomer.contact.firstName} ${contactCustomer.contact.lastName}`;
      contactCustomer.label = `${contactCustomer.contact.fullName} for ${contactCustomer.customer.name}`;
    });

    const uniqueCustName = new Set(contactCustomers.map(cc => cc.customer.name));
    let uniqueNames:string[] = []
    uniqueCustName.forEach((name) => uniqueNames.push(name))
    setUniqueNames(uniqueNames)

    console.log("CONTACT CUSTOMERS : ", contactCustomers)
    setContactCustomers(contactCustomers);
  }

  async function fetchUsers() {
    const users = await UserService.getAll();
    users.forEach((user: User) => {
      user.fullName = `${user.firstName} ${user.lastName}`;
      user.departmentId = user.department.id;
      delete user.department;
    });
    setUsers(users);
  }

  const header = () => {
    return (
      <CustomDatatableHeader
        onClickNew={openNew}
        onClickExport={exportExcel}
        globalSearchValue={globalSearchValue}
        onSearch={(event) => {
          setGlobalSearchValue(event.target.value) 
          search(event.target.value, globalDateSearchValue)
        }}
        haveDateSearch={true}
        globalDateSearchValue={globalDateSearchValue}
        DateRangeSearch={(event) => {
          setGlobalDateSearchValue(event.target.value) 
          search(globalSearchValue,event.target.value)
        }}
      />
    );
  };
  async function search(searchkey:string, searchdate:string) {
    const newValue = searchkey;
    // console.log('GLOBAL DATE : ',  searchdate, searchkey)
    let fromDate = ''
    let toDate = ''
    if(searchdate){
      fromDate = searchdate[0]?.toString()
      toDate = searchdate[1]?.toString()
    }
    
    console.log('THE TWO DATES: ',  fromDate, toDate)

    const newPlans = await PlanService.search(newValue,'plans',fromDate,toDate);
    newPlans.forEach((plan: Plan) => {
      if (plan.user)
        plan.user.fullName = `${plan.user.firstName} ${plan.user.lastName}`;
        plan.contactCustomer.contact.fullName = `${plan.contactCustomer.contact.firstName} ${plan.contactCustomer.contact.lastName}`;
        plan.contactCustomer.label = `${plan.contactCustomer.contact.fullName} for ${plan.contactCustomer.customer.name}`;
        plan.contactCustomer.contact.departmentId =
        plan.contactCustomer.contact.department.id;
        delete plan.contactCustomer.contact.department;
        plan.contactCustomer.customer.regionId =
        plan.contactCustomer.customer.region.id;
        delete plan.contactCustomer.customer.region;
  
    });

    console.log("PLANS ON SEARCH : ", newPlans)
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
    const uniqueCustName = new Set(contactCustomers.map(cc => {
      if(cc.customer.name == plan.contactCustomer.customer.name){
        return cc.contact.fullName
      }
    }));
    let uniqueNames:string[] = []
    uniqueCustName.forEach((name) => {if(name) uniqueNames.push(name)})
    setUniqueContactNames(uniqueNames)
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
        const {
          id,
          user,
          contactCustomer,
          ...otherProps
        } = plan;
        
        return {
          ...otherProps,
          user:user?.fullName,
          contactCustomer:contactCustomer?.label
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
      plan.contactCustomer.contact.firstName &&
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
            resizableColumns
            columnResizeMode="expand"
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
            <Column
              field="date"
              header="Date"
              body={(rowData:Plan) => {
                if (rowData.date) {
                  const date = new Date(rowData.date);
                  const formatted = date.toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  });
            
                  return formatted;
                }
                return 'N/A';
              }}
              sortable
            />
            <Column
              field="user"
              header="User"
              body={(rowData) => rowData.user?.fullName ?? "Unspecified"}
              sortable
              sortField="user.fullName"
            />
            <Column
              field="contact"
              header="Contact"
              body={(rowData) => rowData.contactCustomer.contact.fullName}
              sortable
            />
            <Column
              field="Customer"
              header="Customer"
              body={(rowData) => rowData.contactCustomer.customer.name}
              sortable
            />
            <Column field="how" header="How" sortable />
            <Column field="objective" header="Objective" sortable />
            <Column field="output" header="Output" sortable />
            <Column field="offer" header="Offer" sortable />
            <Column field="meeting" header="Meeting" sortable />
            <Column field="status" header="Status" sortable />
            <Column field="note" header="Note" sortable />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              className="w-10"
            />
          </DataTable>
          <Dialog
            visible={planDialog}
            style={{ width: "40rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Plan Details"
            modal
            footer={planDialogFooter}
            onHide={hideDialog}
          >
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="date" className="font-bold basis-1/3">
                Date
              </label>
              <Calendar
                id="date"
                value={plan.date ? new Date(plan.date) : new Date()}
                onChange={(event) =>{
                  const localDate = new Date(event.target.value || '');
                  const timezoneOffset = localDate.getTimezoneOffset() * 60000;
                  const date = new Date(localDate.getTime() - timezoneOffset);
                  setPlan({ ...plan, date: date })
                }
                  
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.date,
                })}
              />
              {submitted && !plan.date && (
                <small className="p-error">Date is required.</small>
              )}
            </div>
            {/* <div className="field py-2 flex items-center gap-4">
              <label htmlFor="user" className="font-bold basis-1/3">
                User
              </label>
              <Dropdown
                value={plan.user}
                onChange={(event) =>
                  setPlan({ ...plan, user: event.target.value })
                }
                options={users}
                optionLabel="fullName"
                placeholder="Select a User"
                filter
                className="w-1/2"
              />
            </div> */}
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="contactCustomer" className="font-bold basis-1/3">
                Customer
              </label>
              <Dropdown
                value={plan.contactCustomer.customer.name}
                onChange={(event) =>{
                  const CustomerContact = contactCustomers.find(obj => obj.customer.name === event.target.value);
                  if(CustomerContact){
                    const Customer:Customer = {...CustomerContact?.customer}
                    console.log('TARGETED CUSTOMER : ', Customer)
                    if(Customer){
                      setPlan({ ...plan, contactCustomer: {
                        customer:Customer,
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
                        } })
                        const uniqueCustName = new Set(contactCustomers.map(cc => {
                          if(cc.customer.name == event.target.value){
                            return cc.contact.fullName
                          }
                        }));
                        let uniqueNames:string[] = []
                        uniqueCustName.forEach((name) => {if(name) uniqueNames.push(name)})
                        setUniqueContactNames(uniqueNames)
                    }
                  
                  }
                }
                  
                }
                options={uniqueCustNames}
                placeholder="Select a Customer"
                filter
                className={classNames("w-1/2", {
                  "p-invalid":
                    submitted && !plan.contactCustomer.contact.firstName,
                })}
              />
              {submitted && !plan.contactCustomer.contact.firstName && (
                <small className="p-error">Customer is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="contactCustomer" className="font-bold basis-1/3">
                Contact
              </label>
              <Dropdown
                value={plan.contactCustomer.contact.fullName}
                onChange={(event) =>{
                  const CustomerContact = contactCustomers.find(obj => obj.contact.fullName === event.target.value && obj.customer.name === plan.contactCustomer.customer.name);
                  if(CustomerContact){
                    setPlan({ 
                      ...plan,contactCustomer:{ ...CustomerContact}
                    })
                  }
                                   
                }}
                
                options={uniqueContactNames}
                placeholder="Select a Contact Customer"
                filter
                className={classNames("w-1/2", {
                  "p-invalid":
                    submitted && !plan.contactCustomer.contact.firstName,
                })}
              />
              {submitted && !plan.contactCustomer.contact.firstName && (
                <small className="p-error">Contact Customer is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="how" className="font-bold basis-1/3">
                How
              </label>
              <Dropdown
                value={plan.how}
                onChange={(event) =>
                  setPlan({ ...plan, how: event.target.value })
                }
                options={["Visit", "Phone Call", "Email"]}
                placeholder="Select a how"
                filter
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.how,
                })}
              />
              {submitted && !plan.how && (
                <small className="p-error">How is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="objective" className="font-bold basis-1/3">
                Objective
              </label>
              <InputText
                id="objective"
                value={plan.objective}
                onChange={(event) =>
                  setPlan({ ...plan, objective: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.objective,
                })}
              />
              {submitted && !plan.objective && (
                <small className="p-error">Objective is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="output" className="font-bold basis-1/3">
                Output
              </label>
              <InputText
                id="output"
                value={plan.output}
                onChange={(event) =>
                  setPlan({ ...plan, output: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.output,
                })}
              />
              {submitted && !plan.output && (
                <small className="p-error">Output is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="offer" className="font-bold basis-1/3">
                Offer
              </label>
              <InputText
                id="offer"
                value={plan.offer}
                onChange={(event) =>
                  setPlan({ ...plan, offer: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.offer,
                })}
              />
              {submitted && !plan.offer && (
                <small className="p-error">Offer is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="meeting" className="font-bold basis-1/3">
                Meeting
              </label>
              <Dropdown
                value={plan.meeting}
                onChange={(event) =>
                  setPlan({ ...plan, meeting: event.target.value })
                }
                options={["Planned", "Scheduled", "Unplanned"]}
                placeholder="Select a status"
                filter
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.meeting,
                })}
              />
              {submitted && !plan.meeting && (
                <small className="p-error">meeting is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="status" className="font-bold basis-1/3">
                Status
              </label>
              <Dropdown
                value={plan.status}
                onChange={(event) =>
                  setPlan({ ...plan, status: event.target.value })
                }
                options={["Completed", "Postponed", "Cancelled", "Pending"]}
                placeholder="Select a status"
                filter
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.status,
                })}
              />
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="note" className="font-bold basis-1/3">
                Note
              </label>
              <InputTextarea
                id="note"
                value={plan.note}
                onChange={(event) =>
                  setPlan({ ...plan, note: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !plan.note,
                })}
              />
              {submitted && !plan.note && (
                <small className="p-error">Note is required.</small>
              )}
            </div>
          </Dialog>
          <DeleteDialog
            visible={deletePlanDialog}
            onHide={hideDeletePlanDialog}
            onCancelDelete={hideDeletePlanDialog}
            onConfirmDelete={deletePlan}
            entity={plan}
            entityName="plan"
            entityDisplay={plan.contactCustomer?.customer?.name}
          />
        </>
      )}
    </AuthLayout>
  );
}
