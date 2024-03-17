"use client";

import AuthLayout from "@/components/layouts/auth.layout";
import Loading from "@/components/loading";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { User, Department } from "@/utils/interfaces/models";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import CustomDatatableHeader from "@/components/custom-datatable/header";
import { InputText } from "primereact/inputtext";
import { NavbarContext } from "@/components/contexts/navbar.context";
import DeleteDialog from "@/components/custom-datatable/dialog-delete";
import UserService from "@/services/user.service";
import DepartmentService from "@/services/department.service";
import { Dropdown } from "primereact/dropdown";
import { saveAsExcelFile, isValidEmail } from "@/utils/helpers";
import { Checkbox } from "primereact/checkbox";

const emptyUser: User = {
  firstName: "",
  lastName: "",
  fullName: "",
  phoneNumber: "",
  email: "",
  department: {
    name: "",
  },
  password:"",
  active:false,
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>(emptyUser);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userDialog, setUserDialog] = useState<boolean>(false);
  const [userPasswordDialog, setUserPasswordDialog] = useState<boolean>(false);
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchValue, setGlobalSearchValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<User[]>>(null);
  const { setTitle } = useContext(NavbarContext);

  useEffect(() => {
    setTitle("Users");
    fetchUsers();
    fetchDepartments();
  }, []);

  async function fetchUsers() {
    const users = await UserService.getAll();
    users.forEach((user: User) => {
      user.fullName = `${user.firstName} ${user.lastName}`;
    });
    setUsers(users);
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
        onClickExport={exportExcel}
        globalSearchValue={globalSearchValue}
        onSearch={search}
      />
    );
  };

  async function search(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setGlobalSearchValue(newValue);
    const newUsers = await UserService.search(newValue);
    setUsers(newUsers);
  }

  function openNew() {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
    setIsCreatingUser(true)
  }

  function hideDialog() {
    setSubmitted(false);
    setUserDialog(false);
    setUserPasswordDialog(false);
    setIsCreatingUser(false)
  }

  function hideDeleteUserDialog() {
    setDeleteUserDialog(false);
  }

  function editUser(user: User) {
    setUser({ ...user });
    setUserDialog(true);
  }

  function editUserPassword(user:User){
    setUser({...user});
    setUserPasswordDialog(true)
  }

  function confirmDeleteUser(user: User) {
    setUser(user);
    setDeleteUserDialog(true);
  }

  function exportExcel() {
    import("xlsx").then((xlsx) => {
      const simpleUsers = users.map((user) => {
        const {
          id,
          firstName,
          lastName,
          fullName,
          phoneNumber,
          email,
          department,
          ...otherProps
        } = user;
        return {
          firstName,
          lastName,
          fullName,
          phoneNumber,
          email,
          department: user.department?.name ?? "Unspecified",
          ...otherProps,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(simpleUsers);
      const workbook = {
        Sheets: { users: worksheet },
        SheetNames: ["users"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "users");
    });
  }

  const actionBodyTemplate = (rowData: User) => {
    return (
      <div className="flex gap-2 items-center justify-end">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-user"
          rounded
          outlined
          severity="danger"
          onClick={() => editUserPassword(rowData)}
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
      const isDelete = await UserService.delete(user.id);
      if (!isDelete) throw new Error();
      setDeleteUserDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Deleted",
        life: 3000,
      });
      fetchUsers();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "User NOT Deleted",
        life: 3000,
      });
    }
  }

  async function saveUser() {
    setSubmitted(true);
    if (
      user.firstName?.trim() &&
      user.lastName?.trim() &&
      user.email?.trim() &&
      isValidEmail(user.email) &&
      user.phoneNumber?.trim()
    ) {
      try {
        if (user.id) {
          await UserService.update(user);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "User Updated",
            life: 3000,
          });
        } else {
          await UserService.create(user);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "User Created",
            life: 3000,
          });
        }
        fetchUsers();
        setUserDialog(false);
        setIsCreatingUser(false)
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

  async function savePassword(){
    setSubmitted(true);
    if (
      user.password?.trim() 
    ) {
      try {
        if (user.id) {
          await UserService.update(user);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Password Updated",
            life: 3000,
          });
          setUserPasswordDialog(false);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "User not Found",
            life: 3000,
          });
        }
        fetchUsers();
        setUserPasswordDialog(false);
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

  const userPassDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={savePassword} />
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
            value={users}
            removableSort
            dataKey="id"
            loading={isLoading}
            header={header}
            globalFilterFields={[
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "department",
              "active",
            ]}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            emptyMessage="No users found."
          >
            <Column field="firstName" header="First Name" sortable />
            <Column field="lastName" header="Last Name" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="phoneNumber" header="Phone Number" sortable />
            <Column
              field="department"
              header="Department"
              body={(rowData) => rowData.department?.name ?? "Unspecified"}
              sortable
              sortField="department.name"
            />
            <Column
              className="text-center"
              field="active"
              header="Active"
              body={(rowData) => <Checkbox checked={rowData.active} readOnly />}
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              className="w-10"
            />
          </DataTable>
          <Dialog
            visible={userDialog}
            style={{ width: "40rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="User Details"
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
                value={user.firstName}
                onChange={(event) =>
                  setUser({ ...user, firstName: event.target.value })
                }
                required
                autoFocus
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !user.firstName,
                })}
              />
              {submitted && !user.firstName && (
                <small className="p-error">First name is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="lastName" className="font-bold basis-1/3">
                Last Name
              </label>
              <InputText
                id="lastName"
                value={user.lastName}
                onChange={(event) =>
                  setUser({ ...user, lastName: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !user.lastName,
                })}
              />
              {submitted && !user.lastName && (
                <small className="p-error">Last name is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="email" className="font-bold basis-1/3">
                Email
              </label>
              <InputText
                id="email"
                value={user.email}
                onChange={(event) =>
                  setUser({ ...user, email: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid":
                    submitted && (!user.email || !isValidEmail(user.email)),
                })}
              />
              {submitted && (!user.email || !isValidEmail(user.email)) && (
                <small className="p-error">Email is required or invalid.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="phoneNumber" className="font-bold basis-1/3">
                Phone number
              </label>
              <InputText
                id="phoneNumber"
                value={user.phoneNumber}
                onChange={(event) =>
                  setUser({ ...user, phoneNumber: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !user.phoneNumber,
                })}
              />
              {submitted && !user.phoneNumber && (
                <small className="p-error">Phone number is required.</small>
              )}
            </div>
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="department" className="font-bold basis-1/3">
                Department
              </label>
              <Dropdown
                value={user.department}
                onChange={(event) =>
                  setUser({ ...user, department: event.target.value })
                }
                options={departments}
                optionLabel="name"
                placeholder="Select a Department"
                filter
                className="w-1/2"
              />
            </div>
            <div className="field py-2 flex items-center gap-4">
                  <label htmlFor="active" className="font-bold basis-1/3">
                    Active
                  </label>
                  <Checkbox
                    id="active"
                    checked={user.active}
                    onChange={(event) =>
                      setUser({ ...user, active: event.checked })
                    }
                    required
                  />
            </div>
            {isCreatingUser && <div className="field py-2 flex items-center gap-4">
              <label htmlFor="password" className="font-bold basis-1/3">
                Password
              </label>
              <InputText
                id="password"
                value={user.password}
                onChange={(event) =>
                  setUser({ ...user, password: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !user.password,
                })}
              />
              {submitted && !user.password && (
                <small className="p-error">Password is required.</small>
              )}
            </div>}
          </Dialog>
          <DeleteDialog
            visible={deleteUserDialog}
            onHide={hideDeleteUserDialog}
            onCancelDelete={hideDeleteUserDialog}
            onConfirmDelete={deleteUser}
            entity={user}
            entityName="user"
            entityDisplay={user.fullName}
          />
          <Dialog
            visible={userPasswordDialog}
            style={{ width: "40rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="User Password"
            modal
            footer={userPassDialogFooter}
            onHide={hideDialog}
          >
            <div className="field py-2 flex items-center gap-4">
              <label htmlFor="password" className="font-bold basis-1/3">
                Password
              </label>
              <InputText
                id="password"
                value={user.password}
                onChange={(event) =>
                  setUser({ ...user, password: event.target.value })
                }
                required
                className={classNames("w-1/2", {
                  "p-invalid": submitted && !user.password,
                })}
              />
              {submitted && !user.password && (
                <small className="p-error">Password is required.</small>
              )}
            </div>
          </Dialog>
        </>
      )}
    </AuthLayout>
  );
}
