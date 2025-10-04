import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../../redux/slices/userSlice";
import { useConfirmDelete } from "../../../hooks/useCustomDelete";

const UserTable = ({ users, handleViewUser, handleDeleteUser, entity }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th> {/* ✅ Role column always visible now */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.user_id}>
                <td className="fw-medium">
                  {u.first_name} {u.last_name}
                </td>
                <td>{u.email}</td>
                <td>
                  <span className="badge bg-primary-subtle text-primary">
                    {u.name}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm text-info p-0"
                      title="View"
                      onClick={() => handleViewUser(u)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm text-danger p-0"
                      onClick={() => handleDeleteUser(u.user_id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              {/* ✅ colSpan fix since Role column is always present */}
              <td colSpan="4" className="text-center">
                No {entity.toLowerCase()}s found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const UserManagementTabs = ({ reusableColor, handleViewUser, setShowAddUserModal }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const { confirmAndDelete } = useConfirmDelete();

  const handleUserDelete = (id) => {
    confirmAndDelete({
      id,
      action: deleteUser,
      entity: "User",
      onSuccess: () => dispatch(getUsers()),
    });
  };

  // Filtering by role_id (example mapping can be adjusted)
  const childUsers = user?.filter((u) => u.role_id === 2) || [];
  const teacherUsers = user?.filter((u) => u.role_id === 1) || [];
  const secretaryUsers = user?.filter((u) => u.role_id === 4) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 fw-semibold text-dark">User Management</h2>
        <button
          className="btn text-white d-flex align-items-center"
          style={{ backgroundColor: reusableColor.customTextColor }}
          onClick={() => setShowAddUserModal(true)}
        >
          <i className="fas fa-plus me-2"></i> Add User
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading ..</div>
      ) : (
        <Tabs defaultActiveKey="child" id="user-management-tabs" className="mb-3">
          <Tab eventKey="child" title="Child">
            <UserTable
              users={childUsers}
              handleViewUser={handleViewUser}
              handleDeleteUser={handleUserDelete}
              entity="Child"
            />
          </Tab>

          <Tab eventKey="teacher" title="Teacher">
            <UserTable
              users={teacherUsers}
              handleViewUser={handleViewUser}
              handleDeleteUser={handleUserDelete}
              entity="Teacher"
            />
          </Tab>

          <Tab eventKey="secretary" title="Secretary">
            <UserTable
              users={secretaryUsers}
              handleViewUser={handleViewUser}
              handleDeleteUser={handleUserDelete}
              entity="Secretary"
            />
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default UserManagementTabs;
