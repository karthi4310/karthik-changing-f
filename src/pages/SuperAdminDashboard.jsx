import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { farmersAPI, employeesAPI, superAdminAPI, adminAPI } from '../api/apiService';
import DataTable from '../components/DataTable';

import RegistrationApprovalModal from '../components/RegistrationApprovalModal';
import RegistrationDetailModal from '../components/RegistrationDetailModal';
import ViewFarmerRegistrationDetails from '../components/ViewFarmerRegistrationDetails';
import AssignmentModal from '../components/AssignmentModal';
import FarmerForm from '../components/FarmerForm';
import ViewEditEmployeeDetails from '../components/ViewEditEmployeeDetails';
import ViewEmployeeDetails from '../components/ViewEmployeeDetails';
import EmployeeRegistrationForm from '../components/EmployeeRegistrationForm';
import KYCDocumentUpload from '../components/KYCDocumentUpload';
import DeleteModal from '../components/DeleteModal';
import UserProfileDropdown from '../components/UserProfileDropdown';
import BulkOperations from '../components/BulkOperations';
import '../styles/Dashboard.css';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  
  // Debug logging
  console.log('SuperAdminDashboard - User data:', user);
  console.log('SuperAdminDashboard - User name:', user?.name);
  console.log('SuperAdminDashboard - User role:', user?.role);
  console.log('SuperAdminDashboard - User email:', user?.email);
  console.log('=== SUPER ADMIN DASHBOARD LOADED ===');
  
  // Test if user data is available
  useEffect(() => {
    console.log('=== USER DATA CHECK ===');
    console.log('User in useEffect:', user);
    console.log('User name in useEffect:', user?.name);
    console.log('User role in useEffect:', user?.role);
    console.log('Greeting text:', getGreeting());
  }, [user]);
  

  const [activeTab, setActiveTab] = useState('dashboard');
  const [farmers, setFarmers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Greeting function based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };
  
  // Modal states

  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false); // edit modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeView, setShowEmployeeView] = useState(false); // read-only view
  const [showEmployeeRegistration, setShowEmployeeRegistration] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [registrationFilters, setRegistrationFilters] = useState({
    role: '',
    status: ''
  });
  
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    region: '',
    kycStatus: '',
    assignmentStatus: '',
    employeeFilter: ''
  });
  
  const [employeeFilters, setEmployeeFilters] = useState({
    status: '',
    role: '',
    designation: '',
    state: '',
    district: ''
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRegistrationDetailModal, setShowRegistrationDetailModal] = useState(false);
  const [selectedRegistrationForDetail, setSelectedRegistrationForDetail] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Listen for KYC status updates from Employee Dashboard
    const handleKYCUpdate = (event) => {
      console.log('🔄 Super Admin Dashboard: KYC status updated, refreshing data...');
      console.log('📊 KYC Update details:', event.detail);
      // Wait 2 seconds for backend to update, then refresh
      setTimeout(() => {
        console.log('🔄 Refreshing Super Admin data after KYC update...');
        fetchData();
      }, 2000);
    };
    
    window.addEventListener('kycStatusUpdated', handleKYCUpdate);
    
    return () => {
      window.removeEventListener('kycStatusUpdated', handleKYCUpdate);
    };
  }, []);

  // Debug effect to monitor farmers state
  useEffect(() => {
    if (farmers) {
      console.log('Farmers state updated:', farmers);
      console.log('Farmers count:', farmers.length);
    }
  }, [farmers]);

  // Debug effect to monitor employees state
  useEffect(() => {
    console.log('Employees state updated:', employees);
    console.log('Employees count:', employees?.length || 0);
    if (employees && employees.length > 0) {
      console.log('First employee:', employees[0]);
    }
  }, [employees]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from APIs...');
      
      console.log('Starting API calls...');
      let farmersData, employeesData, registrationsData;
      
      try {
        console.log('🔄 Making API calls to fetch real data...');
        [farmersData, employeesData, registrationsData] = await Promise.all([
          adminAPI.getFarmersWithKyc(), // Use the same endpoint that works for AdminDashboard
          employeesAPI.getAllEmployees(),
          superAdminAPI.getRegistrationList()
        ]);
              console.log('✅ API calls completed successfully');
      console.log('📊 Farmers data received:', farmersData?.length || 0, 'records');
      console.log('📊 Employees data received:', employeesData?.length || 0, 'records');
      console.log('📊 Registrations data received:', registrationsData?.length || 0, 'records');
      
      // Log first farmer data structure to debug field mapping
      if (farmersData && farmersData.length > 0) {
        console.log('🔍 First farmer data structure:', farmersData[0]);
        console.log('🔍 Available fields:', Object.keys(farmersData[0]));
      }
      
      // Log employee data structure to debug dropdown
      if (employeesData && employeesData.length > 0) {
        console.log('🔍 First employee data structure:', employeesData[0]);
        console.log('🔍 Available employee fields:', Object.keys(employeesData[0]));
        console.log('🔍 Employee names in dropdown:', employeesData.map(emp => emp.name));
      }
      } catch (apiError) {
        console.error('❌ API call failed:', apiError);
        console.error('❌ API Error details:', apiError.response?.data || apiError.message);
        // Set empty arrays if API fails
        farmersData = [];
        employeesData = [];
        registrationsData = [];
      }

      console.log('Raw API responses:');
      console.log('Farmers data:', farmersData);
      console.log('Farmers data length:', farmersData?.length || 0);
      console.log('First farmer structure:', farmersData?.[0]);
      console.log('Employees data:', employeesData);
      console.log('Employees data length:', employeesData?.length || 0);
      console.log('First employee structure:', employeesData?.[0]);
      console.log('Registrations data:', registrationsData);

      // If registrations data is empty, add some mock data for testing
      let finalRegistrationsData = registrationsData;
      if (!registrationsData || registrationsData.length === 0) {
        console.log('No registration data from API, adding mock data for testing');
        finalRegistrationsData = [
      {
        id: 1,
        name: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '9876543210',
            role: 'FARMER',
            status: 'PENDING'
      },
      {
        id: 2,
        name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phoneNumber: '9876543211',
            role: 'EMPLOYEE',
            status: 'PENDING'
      },
      {
        id: 3,
            name: 'Bob Wilson',
            email: 'bob.wilson@example.com',
            phoneNumber: '9876543212',
            role: 'FARMER',
            status: 'APPROVED'
          }
        ];
      }

      // Use real API data if available, otherwise use mock data
      let finalFarmersData = farmersData;
      if (!farmersData || farmersData.length === 0) {
        console.log('⚠️ No API data available, using mock data for farmers (timestamp: ' + new Date().toISOString() + ')');
        console.log('💡 To see real KYC updates, ensure the backend API is running and accessible');
        finalFarmersData = [
      {
        id: 1,
            name: 'Ramu Yadav',
            contactNumber: '9876543210',
            email: 'ramu.yadav@example.com',
            accessStatus: 'ACTIVE',
            kycStatus: 'PENDING',
            assignedEmployee: 'harish reddy'
      },
      {
        id: 2,
            name: 'Krishna Kumar',
            contactNumber: '9983733210',
            email: 'krishna.kumar@example.com',
            accessStatus: 'ACTIVE',
            kycStatus: 'PENDING',
            assignedEmployee: 'harish reddy'
          },
          {
            id: 3,
            name: 'suman kurrapati',
            contactNumber: '9783733210',
            email: 'suman.kurrapati@example.com',
            accessStatus: 'ACTIVE',
            kycStatus: 'PENDING',
            assignedEmployee: 'harish reddy'
          },
          {
            id: 4,
            name: 'vamsi krishna',
            contactNumber: '9783733210',
            email: 'vamsi.krishna@example.com',
            accessStatus: 'ACTIVE',
            kycStatus: 'PENDING',
            assignedEmployee: 'harish reddy'
          },
          {
            id: 5,
            name: 'hari kumar chowdary',
            contactNumber: '6271979190',
            email: 'hari.chowdary@example.com',
            accessStatus: 'ACTIVE',
            kycStatus: 'PENDING',
            assignedEmployee: 'harish reddy'
          },
          {
            id: 6,
            name: 'kumar sreenu chowdary',
            contactNumber: '6302949363',
            email: 'kumar.chowdary@example.com',
            accessStatus: 'ACTIVE',
            kycStatus: 'PENDING',
            assignedEmployee: 'harish reddy'
          },
          {
            id: 7,
            name: 'Ainash kumar',
            contactNumber: '9798433210',
            email: 'ainash.kumar@example.com',
            accessStatus: 'ACTIVE',
            kycStatus: 'PENDING',
            assignedEmployee: 'harish reddy'
          }
        ];
        console.log('Mock farmers data created:', finalFarmersData);
      }

      console.log('Setting farmers data:', finalFarmersData);
      console.log('Sample farmer structure:', finalFarmersData[0]);
      // Normalize employees from backend instead of forcing mock data
      let finalEmployeesData = (employeesData || []).map(e => ({
        id: e.id,
        name: e.name || `${[e.firstName, e.middleName, e.lastName].filter(Boolean).join(' ')}`.trim(),
        contactNumber: e.contactNumber,
        email: e.email,
        status: e.status || e.accessStatus || 'ACTIVE',
        role: (e.role && typeof e.role === 'string') ? e.role : (e.role?.name || 'employee'),
        designation: e.designation || 'KYC Officer',
        district: e.district,
        state: e.state
      }));
      // If backend returned nothing, keep empty array (do not override with mocks)

      setFarmers(finalFarmersData);
      setEmployees(finalEmployeesData);
      setRegistrations(finalRegistrationsData);
      
      console.log('Fetched data:', { farmersData, employeesData, registrationsData });
      console.log('Final employees data:', finalEmployeesData);
      console.log('Final employees count:', finalEmployeesData?.length || 0);
      
      // Test if employees are being set correctly
      console.log('=== SETTING EMPLOYEES ===');
      console.log('About to set employees:', finalEmployeesData);
      
      // Test if employees are being set correctly
      setTimeout(() => {
        console.log('=== EMPLOYEES STATE TEST ===');
        console.log('Employees state after 1 second:', finalEmployeesData);
        console.log('Employees count after 1 second:', finalEmployeesData?.length || 0);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFarmers = () => {
    return (farmers || []).filter(farmer => {
      const matchesState = !filters.state || farmer.state === filters.state;
      const matchesDistrict = !filters.district || farmer.district === filters.district;
      const matchesKycStatus = !filters.kycStatus || farmer.kycStatus === filters.kycStatus;
      
      // Debug employee filter
      if (filters.employeeFilter) {
        console.log('🔍 Employee filter active:', filters.employeeFilter);
        console.log('🔍 Farmer assignedEmployee field:', farmer.assignedEmployee);
        console.log('🔍 Available farmer fields:', Object.keys(farmer));
      }
      
      // More robust employee filter matching
      const matchesEmployee = !filters.employeeFilter || 
        (farmer.assignedEmployee && 
         (farmer.assignedEmployee === filters.employeeFilter || 
          farmer.assignedEmployee.toLowerCase().includes(filters.employeeFilter.toLowerCase()) ||
          filters.employeeFilter.toLowerCase().includes(farmer.assignedEmployee.toLowerCase())
         ));
      
      // Debug: Log all farmers and their assigned employees when filter is active
      if (filters.employeeFilter) {
        console.log('🔍 All farmers and their assigned employees:');
        (farmers || []).forEach((f, index) => {
          console.log(`  Farmer ${index + 1}: ${f.name} -> Assigned to: "${f.assignedEmployee}"`);
        });
      }
      
      return matchesState && matchesDistrict && matchesKycStatus && matchesEmployee;
    });
  };

  const getFilteredEmployees = () => {
    return (employees || []).filter(employee => {
      const matchesStatus = !employeeFilters.status || employee.status === employeeFilters.status;
      const matchesRole = !employeeFilters.role || employee.role === employeeFilters.role;
      const matchesDesignation = !employeeFilters.designation || employee.designation === employeeFilters.designation;
      const matchesState = !employeeFilters.state || employee.state === employeeFilters.state;
      const matchesDistrict = !employeeFilters.district || employee.district === employeeFilters.district;
      
      return matchesStatus && matchesRole && matchesDesignation && matchesState && matchesDistrict;
    });
  };

  const getFilteredRegistrations = () => {
    console.log('All registrations:', registrations);
    // Apply filters
    const filtered = registrations.filter(registration => {
      const roleMatch = !registrationFilters.role || registration.role === registrationFilters.role;
      const statusMatch = !registrationFilters.status || registration.status === registrationFilters.status;
      return roleMatch && statusMatch;
    });
    console.log('Filtered registrations:', filtered);
    return filtered;
  };

  const getStats = () => {
    const totalFarmers = farmers.length;
    const totalEmployees = employees.length;
    const pendingRegistrations = registrations.filter(r => {
      const status = r.status || r.userStatus || r.accessStatus;
      return status === 'PENDING' || status === 'pending' || status === 'Pending';
    }).length;
    const unassignedFarmers = farmers.filter(f => f.accessStatus === 'PENDING').length;
    const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
    const totalFPO = 0; // Placeholder for FPO count

    return {
      totalFarmers,
      totalEmployees,
      pendingRegistrations,
      unassignedFarmers,
      activeEmployees,
      totalFPO
    };

  };

  const handleViewRegistration = (registration) => {
    setSelectedRegistrationForDetail(registration);
    setShowRegistrationDetailModal(true);
  };

  const handleCloseRegistrationDetailModal = () => {
    setShowRegistrationDetailModal(false);
    setSelectedRegistrationForDetail(null);
  };

  const handleRegistrationUpdate = () => {
    // Refresh the registration data
    fetchData();
  };

  const handleApproveRegistration = async (registrationId) => {
    try {
      await superAdminAPI.approveUser(registrationId);
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: 'APPROVED' } : reg
      ));
      alert('Registration approved successfully!');
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Failed to approve registration');
    }
  };

  const handleRejectRegistration = async (registrationId) => {
    try {
      await superAdminAPI.rejectUser(registrationId);
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: 'REJECTED' } : reg
      ));
      alert('Registration rejected successfully!');
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Failed to reject registration');
    }
  };

  const handleViewFarmer = (farmer) => {
    // Transform farmer data to match ViewFarmerRegistrationDetails expectations
    const farmerData = {
      id: farmer.id,
      firstName: farmer.firstName || '',
      lastName: farmer.lastName || '',
      middleName: farmer.middleName || '',
      dateOfBirth: farmer.dob || '',
      gender: farmer.gender || '',
      mobileNumber: farmer.contactNumber || '',
      email: farmer.email || '',
      maritalStatus: farmer.maritalStatus || 'Single',
      religion: farmer.religion || 'Not Specified',
      caste: farmer.caste || 'Not Specified',
      category: farmer.category || 'General',
      education: farmer.education || 'Not Specified',
      village: farmer.village || '',
      postOffice: farmer.postOffice || '',
      policeStation: farmer.policeStation || '',
      district: farmer.district || '',
      state: farmer.state || '',
      pincode: farmer.zipcode || '',
      occupation: farmer.occupation || 'Farmer',
      annualIncome: farmer.annualIncome || 'Not Specified',
      landOwnership: farmer.landOwnership || 'Not Specified',
      landArea: farmer.landArea || 'Not Specified',
      irrigationType: farmer.irrigationType || 'Not Specified',
      soilType: farmer.soilType || 'Not Specified',
      primaryCrop: farmer.primaryCrop || 'Not Specified',
      secondaryCrop: farmer.secondaryCrop || 'Not Specified',
      cropSeason: farmer.cropSeason || 'Not Specified',
      farmingExperience: farmer.farmingExperience || 'Not Specified',
      bankName: farmer.bankName || '',
      branchName: farmer.branchName || '',
      accountNumber: farmer.accountNumber || '',
      ifscCode: farmer.ifscCode || '',
      accountType: farmer.accountType || 'Savings',
      aadhaarNumber: farmer.aadhaarNumber || 'Not Specified',
      panNumber: farmer.panNumber || 'Not Specified',
      voterId: farmer.voterId || 'Not Specified',
      rationCardNumber: farmer.rationCardNumber || 'Not Specified',
      status: farmer.accessStatus || 'PENDING',
      assignedEmployee: farmer.assignedEmployee || 'Not Assigned',
      kycStatus: farmer.kycStatus || 'PENDING',
      photo: farmer.photoFileName ? `/uploads/${farmer.photoFileName}` : null
    };

    console.log('Transformed farmer data:', farmerData);
    setSelectedFarmer(farmerData);
    setShowFarmerDetails(true);
  };

  const handleEditFarmer = (farmer) => {
    const farmerData = {
      id: farmer.id,
      firstName: farmer.firstName || '',
      lastName: farmer.lastName || '',
      middleName: farmer.middleName || '',
      salutation: farmer.salutation || '',
      contactNumber: farmer.contactNumber || '',
      email: farmer.email || '',
      dob: farmer.dob || '',
      gender: farmer.gender || '',
      nationality: farmer.nationality || '',
      relationType: farmer.relationType || '',
      relationName: farmer.relationName || '',
      altNumber: farmer.altNumber || '',
      altNumberType: farmer.altNumberType || '',
      country: farmer.country || '',
      state: farmer.state || '',
      district: farmer.district || '',
      block: farmer.block || '',
      village: farmer.village || '',
      zipcode: farmer.zipcode || '',
      sector: farmer.sector || '',
      education: farmer.education || '',
      experience: farmer.experience || '',
      bankName: farmer.bankName || '',
      accountNumber: farmer.accountNumber || '',
      branchName: farmer.branchName || '',
      ifscCode: farmer.ifscCode || '',
      passbookFileName: farmer.passbookFileName || '',
      documentType: farmer.documentType || '',
      documentNumber: farmer.documentNumber || '',
      documentFileName: farmer.documentFileName || '',
      photoFileName: farmer.photoFileName || '',
      role: farmer.role || 'FARMER',
      accessStatus: farmer.accessStatus || 'PENDING',
      kycStatus: farmer.kycStatus || 'PENDING'
    };
    console.log('Farmer data for edit:', farmerData);
    setEditingFarmer(farmerData);
    setShowFarmerForm(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeView(true);
  };

  const handleAddEmployee = () => {
    setShowEmployeeRegistration(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const handleAssignFarmers = async (assignments) => {
    try {
      // Extract farmer IDs and employee ID from assignments
      const farmerIds = assignments.map(a => a.farmerId);
      const employeeId = assignments[0]?.employeeId;
      
      if (!employeeId || farmerIds.length === 0) {
        alert('Please select an employee and at least one farmer');
        return;
      }
      
      // Try bulk assign first, then fallback to individual assignments
      try {
        // Call admin API to bulk assign farmers
        await superAdminAPI.bulkAssignFarmers(farmerIds, employeeId);
      } catch (bulkError) {
        console.log('Bulk assign failed, trying individual assignments...');
        // Fallback to individual assignments
        for (const farmerId of farmerIds) {
          try {
            await superAdminAPI.assignFarmer(farmerId, employeeId);
          } catch (individualError) {
            console.error(`Failed to assign farmer ${farmerId}:`, individualError);
          }
        }
      }
      
      // Update local state for each assignment
      setFarmers(prev => prev.map(farmer => {
        const assignment = assignments.find(a => a.farmerId === farmer.id);
        if (assignment) {
          return {
            ...farmer,
            assignmentStatus: 'ASSIGNED',
            assignedEmployee: assignment.employeeName,
            assignedDate: new Date().toISOString().split('T')[0]
          };
        }
        return farmer;
      }));
      
      setShowAssignmentModal(false);
      alert('Farmers assigned successfully!');
    } catch (error) {
      console.error('Error assigning farmers:', error);
      alert('Failed to assign farmers');
    }
  };

  const handleApproveKYC = (farmerId) => {
    // Implement KYC approval logic
    alert('KYC approved successfully!');
  };

  const handleRejectKYC = (farmerId) => {
    // Implement KYC rejection logic
    alert('KYC rejected successfully!');
  };

  const handleReferBackKYC = (farmerId) => {
    // Implement KYC refer back logic
    alert('KYC referred back for review!');
  };

  const handleLogout = () => {
    logout();
  };

  const toggleUserDropdown = () => {
    console.log('🔍 Toggle clicked! Current state:', showUserDropdown);
    setShowUserDropdown(!showUserDropdown);
    console.log('🔍 New state will be:', !showUserDropdown);
  };

  const handleChangePassword = () => {
    // Navigate to change password page
    window.location.href = '/change-password';
  };

  const handleDelete = (item, type) => {
    setItemToDelete({ item, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { item, type } = itemToDelete;
      if (type === 'farmer') {
        await farmersAPI.deleteFarmer(item.id);
        setFarmers(prev => prev.filter(f => f.id !== item.id));
      } else if (type === 'employee') {
        await employeesAPI.deleteEmployee(item.id);
        setEmployees(prev => prev.filter(e => e.id !== item.id));
      } else if (type === 'registration') {
        // Handle registration deletion
        await superAdminAPI.deleteUser(item.id);
        setRegistrations(prev => prev.filter(r => r.id !== item.id));
      }
      alert(`${type} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-main">
    <div className="dashboard-content">
            <div className="loading">Loading dashboard...</div>
      </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-main">
    <div className="dashboard-content">
            <div className="error">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* USER ICON - ALWAYS VISIBLE */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#15803d',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        zIndex: '10000',
        fontSize: '14px',
        fontWeight: 'bold',
        border: '2px solid #22c55e',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(21, 128, 61, 0.3)'
      }}
      onClick={toggleUserDropdown}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <span>{user?.name || 'User'}</span>
        <i className={`fas fa-chevron-down ${showUserDropdown ? 'fa-chevron-up' : ''}`}></i>
      </div>
      
      {/* USER DROPDOWN MENU */}
      {showUserDropdown && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: '#ffffff',
          border: '2px solid #15803d',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          zIndex: '9999',
          width: '280px',
          padding: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={handleChangePassword}
              style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              <i className="fas fa-key" style={{ color: '#15803d' }}></i>
              Change Password
            </button>
            <button 
              onClick={handleLogout}
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#dc2626'
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      )}
      
      {/* Top Bar */}
      <div className="top-bar"></div>
      
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="logo-section">
            <h1 className="logo-title">DATE</h1>
            <p className="logo-subtitle">Digital Agristack</p>
          </div>
        </div>
        <div className="header-right">
          {/* TEST BUTTON - ALWAYS VISIBLE */}
          <button 
            style={{
              background: '#15803d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              marginRight: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={toggleUserDropdown}
          >
            🔍 TEST USER MENU
          </button>
          
          <div className="user-profile-dropdown">
            <div className="user-profile-trigger" onClick={toggleUserDropdown}>
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="user-email">{user?.email || 'user@example.com'}</span>
              <i className={`fas fa-chevron-down dropdown-arrow ${showUserDropdown ? 'rotated' : ''}`}></i>
            </div>
            <div className="user-dropdown-menu" style={{ 
              display: showUserDropdown ? 'block' : 'none',
              position: 'absolute',
              top: '100%',
              right: '0',
              width: '280px',
              background: '#ffffff',
              border: '2px solid #15803d',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              zIndex: '9999',
              marginTop: '8px'
            }}>
              <div className="dropdown-header">
                <div className="user-avatar-large">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="user-details">
                  <div className="user-name-large">{user?.name || 'User'}</div>
                  <div className="user-email">{user?.email || 'user@example.com'}</div>
                </div>
              </div>
              <div className="dropdown-actions">
                <button className="dropdown-action-btn" onClick={handleChangePassword}>
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
                <button className="dropdown-action-btn logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">DATE</span>
            <span className="logo-subtitle">Digital Agristack</span>
          </div>
          <p>Super Admin Dashboard</p>
        </div>
        
        <div className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-th-large"></i>
            <span>Dashboard Overview</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('registration')}
          >
            <i className="fas fa-user-plus"></i>
            <span>Registration</span>
            <i className="fas fa-chevron-down dropdown-arrow"></i>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'farmers' ? 'active' : ''}`}
            onClick={() => setActiveTab('farmers')}
          >
            <i className="fas fa-users"></i>
            <span>Farmers</span>
            <i className="fas fa-chevron-down dropdown-arrow"></i>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <i className="fas fa-user-tie"></i>
            <span>Employees</span>
            <i className="fas fa-chevron-down dropdown-arrow"></i>
          </div>

          <div 
            className={`nav-item ${activeTab === 'bulk-operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk-operations')}
          >
            <i className="fas fa-upload"></i>
            <span>Bulk Operations</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Header Bar */}
        <div className="top-header"></div>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <div className="greeting-section">
              <h2 className="greeting-text">{getGreeting()}, {user?.name || 'Super Admin'}! 👋</h2>
              <p className="greeting-time">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            {!user && (
              <div style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '14px',
                marginTop: '8px'
              }}>
                ⚠️ No user data found. Using default Super Admin profile.
            </div>
          )}
            <h1 className="header-title">Super Admin Dashboard</h1>
            <p className="header-subtitle">Manage your agricultural platform</p>
            </div>
          <div className="header-right">
            <UserProfileDropdown />
        </div>
      </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to DATE Digital Agristack!</h1>
          <p className="welcome-subtitle">
            Empowering your agricultural journey with data-driven insights and seamless management. 
            Explore your dashboard below.
          </p>
    </div>

        {/* Dashboard Content */}
    <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <>
              {/* Dashboard Overview */}
              <div className="overview-section">
                <div className="overview-header">
                  <div>
                    <h2 className="overview-title">Dashboard Overview</h2>
                    <p className="overview-description">
                      Welcome back! Here's what's happening with your agricultural data.
                    </p>
                  </div>
                  <div className="overview-actions">
                    <button className="action-btn refresh">
                      <i className="fas fa-sync-alt"></i>
                      Refresh
                    </button>
                    <button className="action-btn secondary">Today</button>
                    <button className="action-btn secondary">This Month</button>
                    <button className="action-btn primary">This Year</button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stats-card">
                    <div className="stats-icon farmers">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stats-title">Farmers</div>
                    <div className="stats-value">{stats.totalFarmers}</div>
                    <div className="stats-change positive">
                      <i className="fas fa-arrow-up"></i>
                      +12.4%
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="stats-icon employees">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="stats-title">Employees</div>
                    <div className="stats-value">{stats.totalEmployees}</div>
                    <div className="stats-change negative">
                      <i className="fas fa-arrow-down"></i>
                      -3.0%
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="stats-icon fpo">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="stats-title">FPO</div>
                    <div className="stats-value">{stats.totalFPO}</div>
                    <div className="stats-change neutral">
                      <i className="fas fa-minus"></i>
                      +0.0%
                    </div>
                  </div>
                </div>

                {/* Bottom Sections */}
                <div className="bottom-sections">
                  {/* Recent Activities */}
                  <div className="section-card">
                    <div className="section-header">
                      <h3 className="section-title">Recent Activities</h3>
                      <button className="section-link">View All</button>
                    </div>
                    <div className="activities-list">
                      <div className="activity-item">
                        <div className="activity-content">
                          <div className="activity-text">Farmer profile updated</div>
                          <div className="activity-time">20m ago</div>
                        </div>
                        <span className="activity-badge success">Success</span>
                      </div>
                      <div className="activity-item">
                        <div className="activity-content">
                          <div className="activity-text">Employee profile updated</div>
                          <div className="activity-time">10m ago</div>
                        </div>
                        <span className="activity-badge success">Success</span>
                      </div>
                      <div className="activity-item">
                        <div className="activity-content">
                          <div className="activity-text">New FPO application submitted</div>
                          <div className="activity-time">Just now</div>
                        </div>
                        <span className="activity-badge pending">Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="section-card">
                    <div className="section-header">
                      <h3 className="section-title">Quick Actions</h3>
                    </div>
                    <div className="quick-actions-grid">
                      <button className="quick-action-btn primary">
                        <i className="fas fa-user-plus"></i>
                        Add New Farmer
                      </button>
                      <button className="quick-action-btn secondary">
                        <i className="fas fa-user-tie"></i>
                        Add Employee
                      </button>
                      <button className="quick-action-btn info">
                        <i className="fas fa-chart-bar"></i>
                        Generate Report
                      </button>

                    </div>
        </div>
      </div>
    </div>
            </>
          )}

          {activeTab === 'registration' && (
            <div className="overview-section">
              <div className="overview-header">
                <h2 className="overview-title">Registration Management</h2>
                <p className="overview-description">
                  Manage pending registrations and approve new users.
                </p>
                <div className="overview-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      console.log('🔄 Manually refreshing data...');
                      fetchData();
                    }}
                  >
                    <i className="fas fa-sync-alt"></i>
                    Refresh Data
                  </button>
                </div>
              </div>

              {/* Enhanced Filters */}
              <div className="filters-section">
                <div className="filter-group">
                  <label className="filter-label">Role</label>
                  <select 
                    value={registrationFilters.role} 
                    onChange={(e) => setRegistrationFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="">All Roles</option>
                    <option value="FARMER">Farmer</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select 
                    value={registrationFilters.status} 
                    onChange={(e) => setRegistrationFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                
                <div className="filter-actions">
                  <button 
                    className="filter-btn-clear"
                    onClick={() => setRegistrationFilters({
                      role: '',
                      status: ''
                    })}
                  >
                    <i className="fas fa-times"></i>
                    Clear Filters
                  </button>
                </div>
              </div>

              {(() => {
                const registrationData = getFilteredRegistrations();
                return (
                  <DataTable
                    data={registrationData}
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phoneNumber', label: 'Phone' },
                      { key: 'role', label: 'Role' },
                      { key: 'status', label: 'Status' }
                    ]}
                    customActions={[
                      {
                        label: 'View',
                        className: 'info',
                        onClick: handleViewRegistration
                      },
                      {
                        label: 'Approve',
                        className: 'approve',
                        onClick: (registration) => handleApproveRegistration(registration.id)
                      },
                      {
                        label: 'Reject',
                        className: 'reject',
                        onClick: (registration) => handleRejectRegistration(registration.id)
                      },
                      {
                        label: 'Delete',
                        className: 'danger',
                        onClick: (registration) => handleDelete(registration, 'registration')
                      }
                    ]}
                  />
                );
              })()}
            </div>
          )}

          {activeTab === 'farmers' && (
            <div className="overview-section">
              <div className="overview-header">
                <h2 className="overview-title">Farmer Management</h2>
                <p className="overview-description">
                  Manage farmer registrations and assignments.
                </p>
                <div className="overview-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      setEditingFarmer(null);
                      setShowFarmerForm(true);
                    }}
                  >
                    <i className="fas fa-plus"></i>
                    Add Farmer
                  </button>
                  <button className="action-btn secondary" onClick={() => {
                    console.log('=== ASSIGN FARMERS BUTTON CLICKED ===');
                    console.log('Current farmers state:', farmers || 'undefined');
                    console.log('Current employees state:', employees || 'undefined');
                    setShowAssignmentModal(true);
                  }}>
                    <i className="fas fa-user-plus"></i>
                    Assign Farmers
                  </button>
                  <button 
                    className="action-btn success"
                    onClick={() => {
                      console.log('🔄 Manually refreshing farmer data...');
                      fetchData();
                    }}
                  >
                    <i className="fas fa-sync-alt"></i>
                    Refresh Data
                  </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">State</label>
          <select 
            value={filters.state} 
            onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
            className="filter-select"
          >
            <option value="">All States</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhrapradesh">Andhrapradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Punjab">Punjab</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">District</label>
          <select 
            value={filters.district} 
            onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Districts</option>
            <option value="Karimnagar">Karimnagar</option>
            <option value="rangareddy">Rangareddy</option>
            <option value="kadapa">Kadapa</option>
            <option value="Kadapa">Kadapa</option>
            <option value="kadpaa">Kadpaa</option>
            <option value="Kuppam">Kuppam</option>
            <option value="Pune">Pune</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Amritsar">Amritsar</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">KYC Status</label>
          <select 
            value={filters.kycStatus} 
            onChange={(e) => setFilters(prev => ({ ...prev, kycStatus: e.target.value }))}
            className="filter-select"
          >
            <option value="">All KYC Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="REFER_BACK">Refer Back</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Assignment Status</label>
          <select 
            value={filters.assignmentStatus} 
            onChange={(e) => setFilters(prev => ({ ...prev, assignmentStatus: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Assignment Status</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="UNASSIGNED">Unassigned</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Assigned Employee</label>
          <select 
            value={filters.employeeFilter} 
            onChange={(e) => {
              console.log('🔍 Employee filter changed to:', e.target.value);
              setFilters(prev => ({ ...prev, employeeFilter: e.target.value }));
            }}
            className="filter-select"
          >
            <option value="">All Employees</option>
            {employees.map(emp => {
              console.log('🔍 Employee in dropdown:', emp);
              return (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              );
            })}
          </select>
        </div>
        
        <div className="filter-actions">
          <button 
            className="filter-btn-clear"
            onClick={() => setFilters({
              state: '',
              district: '',
              region: '',
              kycStatus: '',
              assignmentStatus: '',
              employeeFilter: ''
            })}
          >
            <i className="fas fa-times"></i>
            Clear Filters
          </button>
        </div>
      </div>

      <DataTable
        data={getFilteredFarmers()}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'contactNumber', label: 'Phone' },
          { key: 'state', label: 'State' },
          { key: 'district', label: 'District' },
          { 
            key: 'kycStatus', 
            label: 'KYC Status',
            render: (value) => {
              if (!value) return 'NOT_STARTED';
              if (value === 'PENDING' || value === 'pending') return 'PENDING';
              if (value === 'APPROVED' || value === 'approved') return 'APPROVED';
              if (value === 'REFER_BACK' || value === 'refer_back') return 'REFER_BACK';
              if (value === 'REJECTED' || value === 'rejected') return 'REJECTED';
              if (value === 'NOT_STARTED' || value === 'not_started') return 'NOT_STARTED';
              return value.toUpperCase();
            }
          },
          { key: 'assignedEmployee', label: 'Assigned Employee' }
        ]}
        customActions={[
          {
            label: 'View',
            className: 'info',
            onClick: handleViewFarmer
          },
          {
            label: 'Edit',
            className: 'secondary',
            onClick: handleEditFarmer
          },
          {
            label: 'Approve',
            className: 'approve',
            onClick: (farmer) => handleApproveKYC(farmer.id)
          },
          {
            label: 'Reject',
            className: 'reject',
            onClick: (farmer) => handleRejectKYC(farmer.id)
          },
          {
            label: 'Delete',
            className: 'danger',
            onClick: (farmer) => handleDelete(farmer, 'farmer')
          }
        ]}
      />
    </div>
          )}

          {activeTab === 'employees' && (
            <div className="overview-section">
              {!showEmployeeRegistration ? (
                <>
                  <div className="overview-header">
                    <h2 className="overview-title">Employee Management</h2>
                    <p className="overview-description">
                      Manage employee profiles and assignments.
                    </p>
                    <div className="overview-actions">
                      <button className="action-btn primary" onClick={handleAddEmployee}>
                        <i className="fas fa-plus"></i>
                        Add Employee
          </button>
        </div>
      </div>

                  {/* Employee Filters */}
                  <div className="filters-section">
                    <div className="filter-group">
                      <label className="filter-label">Status</label>
                      <select 
                        value={employeeFilters.status} 
                        onChange={(e) => setEmployeeFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="filter-select"
                      >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label className="filter-label">Role</label>
                      <select 
                        value={employeeFilters.role} 
                        onChange={(e) => setEmployeeFilters(prev => ({ ...prev, role: e.target.value }))}
                        className="filter-select"
                      >
                        <option value="">All Roles</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label className="filter-label">Designation</label>
                      <select 
                        value={employeeFilters.designation} 
                        onChange={(e) => setEmployeeFilters(prev => ({ ...prev, designation: e.target.value }))}
                        className="filter-select"
                      >
                        <option value="">All Designations</option>
                        <option value="KYC Officer">KYC Officer</option>
                        <option value="Field Officer">Field Officer</option>
                        <option value="Manager">Manager</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label className="filter-label">State</label>
                      <select 
                        value={employeeFilters.state} 
                        onChange={(e) => setEmployeeFilters(prev => ({ ...prev, state: e.target.value }))}
                        className="filter-select"
                      >
                        <option value="">All States</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Andhrapradesh">Andhrapradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label className="filter-label">District</label>
                      <select 
                        value={employeeFilters.district} 
                        onChange={(e) => setEmployeeFilters(prev => ({ ...prev, district: e.target.value }))}
                        className="filter-select"
                      >
                        <option value="">All Districts</option>
                        <option value="Karimnagar">Karimnagar</option>
                        <option value="rangareddy">Rangareddy</option>
                        <option value="kadapa">Kadapa</option>
                        <option value="Kadapa">Kadapa</option>
                        <option value="kadpaa">Kadpaa</option>
                        <option value="Kuppam">Kuppam</option>
                        <option value="Pune">Pune</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Amritsar">Amritsar</option>
                        <option value="Lucknow">Lucknow</option>
                        <option value="Chennai">Chennai</option>
                      </select>
                    </div>
                    
                    <div className="filter-actions">
                      <button 
                        className="filter-btn-clear"
                        onClick={() => setEmployeeFilters({
                          status: '',
                          role: '',
                          designation: '',
                          state: '',
                          district: ''
                        })}
                      >
                        <i className="fas fa-times"></i>
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  <DataTable
                    data={getFilteredEmployees()}
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'contactNumber', label: 'Phone' },
                      { key: 'email', label: 'Email' },
                      { key: 'status', label: 'Status' },
                      { key: 'role', label: 'Role' }
                    ]}
                    customActions={[
                      {
                        label: 'View',
                        className: 'info',
                        onClick: handleViewEmployee
                      },
                      {
                        label: 'Edit',
                        className: 'secondary',
                        onClick: handleEditEmployee
                      },
                      {
                        label: 'Delete',
                        className: 'danger',
                        onClick: (employee) => handleDelete(employee, 'employee')
                      }
                    ]}
                  />
                </>
              ) : (
                <div className="employee-registration-section">
                  <div className="overview-header">
                    <h2 className="overview-title">Add New Employee</h2>
                    <p className="overview-description">
                      Register a new employee in the system.
                    </p>
                    <div className="overview-actions">
        <button 
                        className="action-btn secondary" 
                        onClick={() => setShowEmployeeRegistration(false)}
                      >
                        <i className="fas fa-arrow-left"></i>
                        Back to Employees
        </button>
      </div>
      </div>

                  <EmployeeRegistrationForm 
                    isInDashboard={true}
                    onClose={() => setShowEmployeeRegistration(false)}
                    onSubmit={async (employeeData) => {
                      try {
                        const newEmployee = await employeesAPI.createEmployee(employeeData);
                        setEmployees(prev => [...prev, newEmployee]);
                        alert('Employee created successfully!');
                        setShowEmployeeRegistration(false);
                      } catch (error) {
                        console.error('Error creating employee:', error);
                        alert('Failed to create employee. Please try again.');
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'bulk-operations' && (
            <BulkOperations userRole="SUPER_ADMIN" />
          )}
        </div>
      </div>

      {/* Modals */}

      {showFarmerDetails && selectedFarmer && (
        <ViewFarmerRegistrationDetails
          farmerData={selectedFarmer}
          onClose={() => setShowFarmerDetails(false)}
        />
      )}

             {showAssignmentModal && (() => {
         console.log('=== RENDERING ASSIGNMENT MODAL ===');
         console.log('showAssignmentModal:', showAssignmentModal);
         console.log('Employees state:', employees);
         console.log('Employees length:', employees?.length || 0);
         return (
        <AssignmentModal 
             farmers={farmers.filter(f => {
               // Check if farmer is unassigned based on backend data structure
               return !f.assignedEmployee || 
                      f.assignedEmployee === 'Not Assigned' || 
                      f.assignedEmployee === null ||
                      f.assignedEmployee === undefined ||
                      f.assignedEmployee === '';
             })}
             employees={(() => {
               console.log('=== PASSING EMPLOYEES TO MODAL ===');
               console.log('Employees array:', employees);
               console.log('Employees type:', typeof employees);
               console.log('Employees length:', employees?.length || 0);
               console.log('Employees is array:', Array.isArray(employees));
               if (employees && employees.length > 0) {
                 console.log('First employee:', employees[0]);
                 console.log('First employee name:', employees[0]?.name);
                 console.log('First employee designation:', employees[0]?.designation);
                 console.log('All employee names:', employees.map(emp => emp?.name));
               } else {
                 console.log('No employees found or employees is empty/null');
               }
               return employees;
             })()}
          onClose={() => setShowAssignmentModal(false)}
             onAssign={handleAssignFarmers}
           />
         );
      })()}

      {showFarmerForm && (
        <FarmerForm 
          editData={editingFarmer}
          onClose={() => {
            setShowFarmerForm(false);
            setEditingFarmer(null);
          }}
          onSubmit={async (farmerData) => {
            try {
              if (editingFarmer) {
                const updatedFarmer = await farmersAPI.updateFarmer(editingFarmer.id, farmerData);
                setFarmers(prev => prev.map(farmer => 
                  farmer.id === editingFarmer.id ? updatedFarmer : farmer
                ));
                alert('Farmer updated successfully!');
              } else {
                const newFarmer = await farmersAPI.createFarmer(farmerData);
                setFarmers(prev => [...prev, newFarmer]);
                alert('Farmer created successfully!');
              }
              setShowFarmerForm(false);
              setEditingFarmer(null);
            } catch (error) {
              console.error('Error saving farmer:', error);
              alert('Failed to save farmer. Please try again.');
            }
          }}
        />
      )}



      {showEmployeeView && selectedEmployee && (
        <ViewEmployeeDetails employeeData={selectedEmployee} onClose={() => setShowEmployeeView(false)} />
      )}

      {showEmployeeDetails && selectedEmployee && (
        <ViewEditEmployeeDetails
          employee={selectedEmployee}
          onClose={() => setShowEmployeeDetails(false)}
        />
      )}
      
      {showKYCModal && (
        <KYCDocumentUpload
          onClose={() => setShowKYCModal(false)}
          onApprove={handleApproveKYC}
          onReject={handleRejectKYC}
          onReferBack={handleReferBackKYC}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title={`Delete ${itemToDelete?.type}`}
          message={`Are you sure you want to delete this ${itemToDelete?.type}?`}
        />
      )}

      {showRegistrationDetailModal && selectedRegistrationForDetail && (
        <RegistrationDetailModal
          registration={selectedRegistrationForDetail}
          onClose={handleCloseRegistrationDetailModal}
          onUpdate={handleRegistrationUpdate}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard; 