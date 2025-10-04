import './App.css';
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout ';
import Login from './components/Auth/Login';
import "react-datepicker/dist/react-datepicker.css";


import StaffDashboard from './components/StaffDashboard/StaffDashboard';
import AccountDashboard from './components/AccountDashboard/AccountDashboard';
import ChildrenDashboard from './components/ChildrenDashboard/ChildrenDashboard';
import ChildrenManagement from './components/AdminDashboard/ChildrenManagement/ChildrenManagement';
import StaffManagement from './components/AdminDashboard/StaffManagement/StaffManagement';
import Accounting from './components/AdminDashboard/Accounting/Accounting';
import AccountAddTransaction from './components/AccountDashboard/AccountAddTransaction';
import AccountViewTransaction from './components/AccountDashboard/AccountViewTransaction';
import AccountReports from './components/AccountDashboard/AccountReport';
import DocumentsPanel from './components/StaffDashboard/DocumentsPanel';
import ChildrenProfile from './components/ChildrenDashboard/ChildrenProfile';
import Myform from './components/ChildrenDashboard/Myform';
import StaffProfile from './components/StaffDashboard/StaffProfile';
import StaffAttendanceManagement from './components/StaffDashboard/StaffAttendanceManagement';
import NotificationsPanel from './components/StaffDashboard/NotificationsPanel';
import LunchForm from './components/ChildrenDashboard/LunchForm';
import MedicalForm from './components/ChildrenDashboard/MedicalForm';
import Setting from './components/AdminDashboard/Settings/Setting';
import Autodialerivr from './components/AdminDashboard/AutoDailerIVR/Autodialerivr';
import MyNotes from './components/ChildrenDashboard/MyNotes';
import NotificationsPage from './components/ChildrenDashboard/NotificationsPage';
import SpecialNeedForm from './components/ChildrenDashboard/SpecialNeedForm';
import DocumentsVault from './components/AdminDashboard/DocumentVault/DocumentsVault';
import ChildrenAttendance from './components/ChildrenDashboard/ChildrenAttendance';
import LocationManagement from './components/AdminDashboard/LocationModal/LocationManagement';
import PayrollManagement from './components/AdminDashboard/PayrollManagement/PayrollManagement';
import SignManagement from './components/AdminDashboard/SignManagement/SignManagement';
import Outstandingrequirement from './components/AdminDashboard/OutStandingRequirement/Outstandingrequirement';
import CallCenter from './components/ChildrenDashboard/CallCenter';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Dashboard from './components/AdminDashboard/Dashboard/Dashboard';
import StaffChildrenManagement from './components/StaffDashboard/StaffChildrenManagement';
import MyProfile from './components/MyProfile/MyProfile';
import ChangePassword from './components/MyProfile/ChangePassword';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';



// import Dashboard from './Components/Dashboard/Dashboard';

// import Login from './Components/Auth/Login';

// import DealershipManagement from './Components/Dashboard/DealershipManagement';
// import OrderManagement from './Components/Dashboard/Ordermanagement';
// import UserManagement from './Components/Dashboard/UserManagement';

// import Setting from './Components/Dashboard/Setting';
// import Reporting from './Components/Dashboard/Reporting';
// import ManagerDashboard from './Components/Manager-Dashboard/ManagerDashboard';
// import ManagerOrderManagement from './Components/Manager-Dashboard/ManagerOrderManagement';
// import ManagerStaff from './Components/Manager-Dashboard/ManagerStaff';
// import ManagerReports from './Components/Manager-Dashboard/ManagerReports';
// import ManagerInventory from './Components/Manager-Dashboard/ManagerInventory';
// import SalespersonDashboard from './Components/Salesperson-Dashboard/SalespersonDashboard';
// import SalespersonInventory from './Components/Salesperson-Dashboard/SalespersonInventory';
// import SalespersonOrder from './Components/Salesperson-Dashboard/SalespersonOrder';
// import SalespersonCustomerInfo from './Components/Salesperson-Dashboard/SalespersonCustomerInfo';

function App() {
  return (
    <>
      <Router>
        <Routes>


          {/* Public routes without sidebar */}
          <Route path="/" element={<Login />} />
          <Route path="/Forgot-Password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Dashboard routes with MainLayout */}
          <Route element={<ProtectedRoute allowedRoles={["3"]}><MainLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/children" element={<ChildrenManagement />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/accounting" element={<Accounting />} />
            <Route path="/admin/setting" element={<Setting />} />
            <Route path="/admin/autodailerivr" element={<Autodialerivr />} />
            <Route path="/admin/document" element={<DocumentsVault />} />
            <Route path="/admin/location" element={<LocationManagement />} />
            <Route path="/admin/reports" element={<AccountReports />} />
            <Route path="/admin/payroll" element={<PayrollManagement />} />
            <Route path="/admin/signin" element={<SignManagement />} />
            <Route path="/admin/outstandingrequirement" element={<Outstandingrequirement />} />
            {/* <Route path='/updatepassword' element={<UpdatePassword />} /> */}
     
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/secretary/dashboard" element={<Dashboard />} />
            <Route path="/secretary/children" element={<ChildrenManagement />} />
            <Route path="/secretary/staff" element={<StaffManagement />} />
            <Route path="/secretary/accounting" element={<Accounting />} />
            {/* <Route path="/secretary/setting" element={<Setting />} /> */}
            <Route path="/secretary/callcenter" element={<Autodialerivr />} />
            <Route path="/secretary/document" element={<DocumentsVault />} />
            <Route path="/secretary/location" element={<LocationManagement />} />
            <Route path="/secretary/setting" element={<Setting />} />
            <Route path="/admin/viewtransaction" element={<AccountViewTransaction />} />
            {/* <Route path="/secretary/reports" element={<AccountReports />} /> */}
            <Route path="/secretary/payroll" element={<PayrollManagement />} />
            <Route path="/secretary/signin" element={<SignManagement />} />
            <Route path="/secretary/outstandingrequirement" element={<Outstandingrequirement />} />
             {/* <Route path='/secretary/updatepassword' element={<UpdatePassword />} /> */}
          </Route>

          {/* Staff Dashboard routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/Staff/dashboard" element={<StaffDashboard />} />
            <Route path="/Staff/profile" element={<StaffProfile />} />
            <Route path="/teacher/documents" element={<DocumentsPanel />} />
            <Route path="/teacher/attendance" element={<StaffAttendanceManagement />} />
            <Route path="/teacher/notifications" element={<NotificationsPanel />} />
            <Route path="/staff/children" element={<StaffChildrenManagement />} />
            <Route path="/staff/signin" element={<SignManagement />} />
             <Route path="/staff/callcenter" element={<CallCenter />} />
               {/* <Route path='/staff/updatepassword' element={<UpdatePassword />} /> */}
            {/* <Route path="/teacher/location" element={<LocationManagement />} /> */}
          </Route>

          {/* Children Dashboard routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/children/dashboard" element={<ChildrenDashboard />} />
            <Route path="/children/myprofile" element={<ChildrenProfile />} />
            <Route path="/children/myform" element={<Myform />} />
            <Route path="/children/mynotes" element={<MyNotes />} />
            <Route path="/children/lunchform" element={<LunchForm />} />
            <Route path="/children/medicalform" element={<MedicalForm />} />
            <Route path="/children/attendence" element={<ChildrenAttendance />} />
            <Route path="/children/notifications" element={<NotificationsPage />} />
            <Route path="/children/specialneedform" element={<SpecialNeedForm />} />
            <Route path="/children/callcenter" element={<CallCenter />} />
          </Route>
           <Route element={<MainLayout />}>
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
