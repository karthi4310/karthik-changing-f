import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { farmersAPI, employeesAPI, adminAPI, superAdminAPI } from '../api/apiService';
import '../styles/Dashboard.css';
import FarmerForm from '../components/FarmerForm';
import FarmerRegistrationForm from '../components/FarmerRegistrationForm';
import EmployeeRegistrationForm from '../components/EmployeeRegistrationForm';
import AssignmentModal from '../components/AssignmentModal';
import KYCDocumentUpload from '../components/KYCDocumentUpload';
import ViewFarmerRegistrationDetails from '../components/ViewFarmerRegistrationDetails';
import ViewEditEmployeeDetails from '../components/ViewEditEmployeeDetails';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import UserProfileDropdown from '../components/UserProfileDropdown';
import RegistrationApprovalModal from '../components/RegistrationApprovalModal';
import RegistrationDetailModal from '../components/RegistrationDetailModal';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [farmers, setFarmers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [selectedFarmerData, setSelectedFarmerData] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [showKYCDocumentUpload, setShowKYCDocumentUpload] = useState(false);
  const [selectedFarmerForKYC, setSelectedFarmerForKYC] = useState(null);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showRegistrationDetailModal, setShowRegistrationDetailModal] = useState(false);
  const [selectedRegistrationForDetail, setSelectedRegistrationForDetail] = useState(null);
  const [showEmployeeRegistration, setShowEmployeeRegistration] = useState(false);
  const [showFarmerRegistration, setShowFarmerRegistration] = useState(false);
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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

  // Load data from API
  useEffect(() => {
    fetchData();
    
    // Listen for KYC status updates from Employee Dashboard
    const handleKYCUpdate = (event) => {
      console.log('🔄 Admin Dashboard: KYC status updated, refreshing data...');
      console.log('📊 KYC Update details:', event.detail);
      fetchData(); // Refresh data when KYC status changes
    };
    
    window.addEventListener('kycStatusUpdated', handleKYCUpdate);
    
    return () => {
      window.removeEventListener('kycStatusUpdated', handleKYCUpdate);
    };
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔍 Admin: Starting to fetch real data from API...');
      
      // Fetch farmers, employees, and registrations from API using admin endpoints
      const [farmersData, employeesData, registrationsData] = await Promise.all([
        adminAPI.getFarmersWithKyc(),
        adminAPI.getEmployeesWithStats(),
        superAdminAPI.getRegistrationList()
      ]);
      
      console.log('✅ Admin API Response:', { 
        farmersCount: farmersData?.length || 0,
        employeesCount: employeesData?.length || 0,
        registrationsCount: registrationsData?.length || 0
      });
      
      // Use real data from APIs
      setFarmers(farmersData || []);
      setEmployees(employeesData || []);
      setRegistrations(registrationsData || []);
      
      console.log('✅ Admin: Using real data from APIs');
      console.log('- Farmers:', farmersData?.length || 0, 'records');
      console.log('- Employees:', employeesData?.length || 0, 'records');
      console.log('- Registrations:', registrationsData?.length || 0, 'records');
      
    } catch (error) {
      console.error('❌ Admin error fetching data:', error);
      console.log('❌ Using fallback endpoints due to API error');
      
      // Try basic admin endpoints as fallback
      try {
        const [fallbackFarmers, fallbackEmployees, fallbackRegistrations] = await Promise.all([
          adminAPI.getAllFarmers(),
          adminAPI.getAllEmployees(),
          superAdminAPI.getRegistrationList()
        ]);
        
        console.log('✅ Fallback API Response:', {
          farmersCount: fallbackFarmers?.length || 0,
          employeesCount: fallbackEmployees?.length || 0,
          registrationsCount: fallbackRegistrations?.length || 0
        });
        
        setFarmers(fallbackFarmers || []);
        setEmployees(fallbackEmployees || []);
        setRegistrations(fallbackRegistrations || []);
        
      } catch (fallbackError) {
        console.error('❌ Fallback API also failed:', fallbackError);
        // Set empty arrays if all APIs fail
        setFarmers([]);
        setEmployees([]);
        setRegistrations([]);
      }
    }
  };

  const loadMockData = () => {
    const mockFarmers = [
      {
        id: 1,
        name: 'Ramu Yadav',
        phone: '9876543210',
        state: 'Telangana',
        district: 'Karimnagar',
        region: 'Southern',
        kycStatus: 'PENDING',
        assignmentStatus: 'ASSIGNED',
        assignedEmployee: 'harish reddy',
        assignedDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Krishna Kumar',
        phone: '9983733210',
        state: 'Andhrapradesh',
        district: 'rangareddy',
        region: 'Southern',
        kycStatus: 'PENDING',
        assignmentStatus: 'ASSIGNED',
        assignedEmployee: 'harish reddy',
        assignedDate: '2024-01-18'
      },
      {
        id: 3,
        name: 'suman kurrapati',
        phone: '9783733210',
        state: 'Andhrapradesh',
        district: 'kadapa',
        region: 'Southern',
        kycStatus: 'NOT_STARTED',
        assignmentStatus: 'ASSIGNED',
        assignedEmployee: 'harish reddy',
        assignedDate: '2024-01-10'
      },
      {
        id: 4,
        name: 'vamsi krishna',
        phone: '9783733210',
        state: 'Andhrapradesh',
        district: 'kadapa',
        region: 'Southern',
        kycStatus: 'NOT_STARTED',
        assignmentStatus: 'ASSIGNED',
        assignedEmployee: 'harish reddy',
        assignedDate: '2024-01-20'
      },
      {
        id: 5,
        name: 'hari kumar chowdary',
        phone: '6271979190',
        state: 'Andhrapradesh',
        district: 'Kadapa',
        region: 'Southern',
        kycStatus: 'NOT_STARTED',
        assignmentStatus: 'ASSIGNED',
        assignedEmployee: 'harish reddy',
        assignedDate: '2024-01-25'
      },
      {
        id: 6,
        name: 'kumar sreenu chowdary',
        phone: '6302949363',
        state: 'Andhrapradesh',
        district: 'kadpaa',
        region: 'Southern',
        kycStatus: 'NOT_STARTED',
        assignmentStatus: 'ASSIGNED',
        assignedEmployee: 'karthik kumar',
        assignedDate: '2024-01-12'
      },
      {
        id: 7,
        name: 'Ainash kumar',
        phone: '9798433210',
        state: 'Andhrapradesh',
        district: 'Kuppam',
        region: 'Southern',
        kycStatus: 'NOT_STARTED',
        assignmentStatus: 'ASSIGNED',
        assignedEmployee: 'harish reddy',
        assignedDate: '2024-01-12'
      }
    ];

    const mockEmployees = [
      {
        id: 1,
        name: 'John Doe',
        phone: '9876543201',
        email: 'john.doe@company.com',
        designation: 'KYC Officer',
        state: 'Maharashtra',
        district: 'Pune',
        region: 'Western',
        status: 'ACTIVE',
        assignedFarmersCount: 15,
        kycStats: {
          approved: 8,
          pending: 5,
          referBack: 2,
          rejected: 0
        }
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '9876543202',
        email: 'jane.smith@company.com',
        designation: 'KYC Officer',
        state: 'Gujarat',
        district: 'Ahmedabad',
        region: 'Western',
        status: 'ACTIVE',
        assignedFarmersCount: 12,
        kycStats: {
          approved: 6,
          pending: 4,
          referBack: 1,
          rejected: 1
        }
      },
      {
        id: 3,
        name: 'Mike Johnson',
        phone: '9876543203',
        email: 'mike.johnson@company.com',
        designation: 'KYC Officer',
        state: 'Punjab',
        district: 'Amritsar',
        region: 'Northern',
        status: 'ACTIVE',
        assignedFarmersCount: 8,
        kycStats: {
          approved: 5,
          pending: 2,
          referBack: 1,
          rejected: 0
        }
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        phone: '9876543204',
        email: 'sarah.wilson@company.com',
        designation: 'KYC Officer',
        state: 'Karnataka',
        district: 'Bangalore',
        region: 'Southern',
        status: 'ACTIVE',
        assignedFarmersCount: 0,
        kycStats: {
          approved: 0,
          pending: 0,
          referBack: 0,
          rejected: 0
        }
      }
    ];

    setFarmers(mockFarmers);
    setEmployees(mockEmployees);
  };

  const loadMockRegistrationData = () => {
    const mockRegistrations = [
      {
        id: 1,
        name: 'Ramu Yadav',
        email: 'ramu.yadav@example.com',
        phoneNumber: '9876543210',
        role: 'FARMER',
        status: 'PENDING',
        createdAt: '2024-01-15',
        documents: ['Aadhar Card', 'PAN Card'],
        kycStatus: 'PENDING'
      },
      {
        id: 2,
        name: 'Krishna Kumar',
        email: 'krishna.kumar@example.com',
        phoneNumber: '9983733210',
        role: 'FARMER',
        status: 'PENDING',
        createdAt: '2024-01-14',
        documents: ['Aadhar Card', 'PAN Card'],
        kycStatus: 'PENDING'
      },
      {
        id: 3,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '9876543211',
        role: 'EMPLOYEE',
        status: 'APPROVED',
        createdAt: '2024-01-14',
        documents: ['Aadhar Card', 'PAN Card', 'Educational Certificate'],
        kycStatus: 'APPROVED'
      },
      {
        id: 4,
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        phoneNumber: '9876543212',
        role: 'FARMER',
        status: 'REJECTED',
        createdAt: '2024-01-13',
        documents: ['Aadhar Card'],
        kycStatus: 'REJECTED',
        rejectionReason: 'Incomplete documentation'
      }
    ];
    setRegistrations(mockRegistrations);
  };

  const getFilteredFarmers = () => {
    return (farmers || []).filter(farmer => {
      const matchesState = !filters.state || farmer.state === filters.state;
      const matchesDistrict = !filters.district || farmer.district === filters.district;
      const matchesKycStatus = !filters.kycStatus || farmer.kycStatus === filters.kycStatus;
      const matchesEmployee = !filters.employeeFilter || farmer.assignedEmployee === filters.employeeFilter;
      
      return matchesState && matchesDistrict && matchesKycStatus && matchesEmployee;
    });
  };

  const getFilteredEmployees = () => {
    return (employees || []).filter(employee => {
      const matchesDistrict = !filters.district || employee.district === filters.district;
      return matchesDistrict;
    });
  };

  const getFilteredRegistrations = () => {
    console.log('All registrations:', registrations);
    // Apply filters
    const filtered = (registrations || []).filter(registration => {
      const roleMatch = !registrationFilters.role || registration.role === registrationFilters.role;
      const statusMatch = !registrationFilters.status || registration.status === registrationFilters.status;
      return roleMatch && statusMatch;
    });
    console.log('Filtered registrations:', filtered);
    return filtered;
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
      await superAdminAPI.approveUser(registrationId, 'FARMER'); // Default role, can be updated
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: 'APPROVED' } : reg
      ));
      alert('Registration approved successfully!');
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Failed to approve registration. Please try again.');
    }
  };

  const handleRejectRegistration = async (registrationId) => {
    try {
      await superAdminAPI.rejectUser(registrationId, 'Rejected by Admin');
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: 'REJECTED' } : reg
      ));
      alert('Registration rejected successfully!');
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Failed to reject registration. Please try again.');
    }
  };

  const getStats = () => {
    const totalFarmers = farmers?.length || 0;
    const totalEmployees = employees?.length || 0;
    const unassignedFarmers = (farmers || []).filter(f => !f.assignedEmployee || f.assignedEmployee === 'Not Assigned').length;
    
    // Handle different KYC status formats
    const pendingKYC = (farmers || []).filter(f => 
      f.kycStatus === 'PENDING' || f.kycStatus === 'pending' || 
      f.kycStatus === 'NOT_STARTED' || f.kycStatus === 'not_started'
    ).length;
    
    const approvedKYC = (farmers || []).filter(f => 
      f.kycStatus === 'APPROVED' || f.kycStatus === 'approved'
    ).length;
    
    const referBackKYC = (farmers || []).filter(f => 
      f.kycStatus === 'REFER_BACK' || f.kycStatus === 'refer_back'
    ).length;
    
    const rejectedKYC = (farmers || []).filter(f => 
      f.kycStatus === 'REJECTED' || f.kycStatus === 'rejected'
    ).length;

    console.log('Admin Stats calculated from real data:');
    console.log('- Total Farmers:', totalFarmers);
    console.log('- Total Employees:', totalEmployees);
    console.log('- Unassigned Farmers:', unassignedFarmers);
    console.log('- Pending KYC:', pendingKYC);
    console.log('- Approved KYC:', approvedKYC);
    console.log('- Refer Back KYC:', referBackKYC);
    console.log('- Rejected KYC:', rejectedKYC);

    return {
      totalFarmers,
      totalEmployees,
      unassignedFarmers,
      pendingKYC,
      approvedKYC,
      referBackKYC,
      rejectedKYC
    };
  };

  const getTodoList = () => {
    const unassignedFarmers = (farmers || []).filter(f => !f.assignedEmployee || f.assignedEmployee === 'Not Assigned');
    const overdueKYC = (farmers || []).filter(f => {
      if ((f.kycStatus === 'PENDING' || f.kycStatus === 'NOT_STARTED') && f.assignedEmployee && f.assignedEmployee !== 'Not Assigned') {
        // For now, consider all pending KYC as overdue if assigned
        return true;
      }
      return false;
    });
    const employeesWithLargeQueues = (employees || []).filter(emp => {
      const pendingCount = emp.pendingKyc || 0;
      return pendingCount > 5; // Large queue if more than 5 pending
    });

    console.log('Admin Todo list calculated from real data:');
    console.log('- Unassigned Farmers:', unassignedFarmers.length);
    console.log('- Overdue KYC:', overdueKYC.length);
    console.log('- Employees with Large Queues:', employeesWithLargeQueues.length);

    return {
      unassignedFarmers,
      overdueKYC,
      employeesWithLargeQueues
    };
  };

  const handleLogout = () => {
    logout();
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleChangePassword = () => {
    // Navigate to change password page
    window.location.href = '/change-password';
  };

  const handleViewFarmer = (farmer) => {
    setSelectedFarmerData(farmer);
    setShowFarmerDetails(true);
  };

  const handleCloseFarmerDetails = () => {
    setShowFarmerDetails(false);
    setSelectedFarmerData(null);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployeeData(employee);
    setShowEmployeeDetails(true);
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(false);
    setSelectedEmployeeData(null);
  };

  const handleUpdateEmployee = (updatedData) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === updatedData.id ? updatedData : emp
    ));
    setShowEmployeeDetails(false);
    setSelectedEmployeeData(null);
  };

  const handleKYCDocumentUpload = (farmer) => {
    setSelectedFarmerForKYC(farmer);
    setShowKYCDocumentUpload(true);
  };

  const handleCloseKYCDocumentUpload = () => {
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const handleKYCApprove = (farmerId, documents) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === farmerId 
        ? { ...farmer, kycStatus: 'APPROVED' }
        : farmer
    ));
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const handleKYCReject = (farmerId, reason, documents) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === farmerId 
        ? { ...farmer, kycStatus: 'REJECTED' }
        : farmer
    ));
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const handleKYCReferBack = (farmerId, reason, documents) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === farmerId 
        ? { ...farmer, kycStatus: 'REFER_BACK' }
        : farmer
    ));
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const handleEditFarmer = (farmer) => {
    setEditingFarmer(farmer);
    setShowFarmerForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
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
        await adminAPI.bulkAssignFarmers(farmerIds, employeeId);
      } catch (bulkError) {
        console.log('Bulk assign failed, trying individual assignments...');
        // Fallback to individual assignments
        for (const farmerId of farmerIds) {
          try {
            await adminAPI.assignFarmer(farmerId, employeeId);
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

    const renderOverview = () => {
    const stats = getStats();

    return (
      <div className="overview-section">
        <div className="overview-header">
          <h2 className="overview-title">Admin Dashboard Overview</h2>
          <p className="overview-description">
            Manage farmers, employees, and assignments efficiently.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="FARMERS"
            value={stats.totalFarmers}
            change="+12.4%"
            changeType="positive"
            icon="👥"
          />
          <StatsCard
            title="EMPLOYEES"
            value={stats.totalEmployees}
            change="-3.0%"
            changeType="negative"
            icon="👨‍💼"
          />
          <StatsCard
            title="FPO"
            value="0"
            change="+0.0%"
            changeType="neutral"
            icon="🏢"
          />
        </div>

        {/* Recent Activities Section */}
        <div className="bottom-sections">
          <div className="section-card">
            <div className="section-header">
              <h3>Recent Activities</h3>
              <button className="section-link" onClick={() => console.log('View All clicked')}>View All</button>
            </div>
            <div className="activities-list">
              <div className="activity-item">
                <div className="activity-content">
                  <div className="activity-text">
                    <span className="activity-dot success"></span>
                    Farmer profile updated
                  </div>
                  <div className="activity-time">20m ago</div>
                  <button className="activity-badge success">SUCCESS</button>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-content">
                  <div className="activity-text">
                    <span className="activity-dot error"></span>
                    Employee profile updated
                  </div>
                  <div className="activity-time">10m ago</div>
                  <button className="activity-badge success">SUCCESS</button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="section-card">
            <div className="section-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action-btn primary">
                <i className="fas fa-users"></i>
                View Users
              </button>
              <button className="quick-action-btn secondary">
                <i className="fas fa-tractor"></i>
                View Farmers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

    const renderFarmers = () => {
    const filteredFarmers = getFilteredFarmers();

    return (
      <div className="overview-section">
        {!showFarmerRegistration ? (
          <>
            <div className="overview-header">
              <h2 className="overview-title">Farmer Management</h2>
              <p className="overview-description">
                View and manage all farmer profiles with KYC status and assignments.
              </p>
              <div className="overview-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => setShowFarmerRegistration(true)}
                >
                    Add Farmer
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => setShowAssignmentModal(true)}
                >
                    Assign Farmers
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
                  onChange={(e) => setFilters(prev => ({ ...prev, employeeFilter: e.target.value }))}
                  className="filter-select"
                >
                  <option value="">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
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

            {/* Farmers Table */}
      <DataTable
              data={filteredFarmers}
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
                  className: 'action-btn-small info',
                  onClick: handleViewFarmer
                },
                {
                  label: 'Edit',
                  className: 'action-btn-small primary',
                  onClick: handleEditFarmer
                },
                {
                  label: 'KYC',
                  className: 'action-btn-small warning',
            onClick: handleKYCDocumentUpload
          }
        ]}
      />
          </>
        ) : (
          <div className="farmer-registration-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Add New Farmer</h2>
                <p className="section-description">
                  Fill in the farmer details to create a new farmer account.
                </p>
              </div>
              <div className="section-actions">
                <button 
                  className="action-btn-small secondary"
                  onClick={() => setShowFarmerRegistration(false)}
                >
                  <i className="fas fa-arrow-left"></i>
                  Back to Farmers
                </button>
              </div>
            </div>

            <FarmerRegistrationForm 
              isInDashboard={true}
              onClose={() => setShowFarmerRegistration(false)}
              onSubmit={async (farmerData) => {
                try {
                  const newFarmer = await farmersAPI.createFarmer(farmerData);
                  setFarmers(prev => [...prev, newFarmer]);
                  alert('Farmer created successfully!');
                  setShowFarmerRegistration(false);
                } catch (error) {
                  console.error('Error creating farmer:', error);
                  alert('Failed to create farmer. Please try again.');
                }
              }}
            />
          </div>
        )}
    </div>
  );
  };

  const renderRegistration = () => {
    const filteredRegistrations = getFilteredRegistrations();

    return (
      <div className="registration-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Registration Management</h2>
            <p className="section-description">
              Review and manage user registration requests.
            </p>
          </div>
          <div className="section-actions">
            <button 
              className="action-btn-small primary"
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

        {/* Filters */}
      <div className="filters-section">
          <div className="filter-group">
          <select 
              className="filter-select"
              value={registrationFilters.role}
              onChange={(e) => setRegistrationFilters(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="">All Roles</option>
              <option value="FARMER">Farmer</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="filter-group">
            <select 
              className="filter-select"
              value={registrationFilters.status}
              onChange={(e) => setRegistrationFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

        {/* Registration Table */}
      <DataTable
          data={filteredRegistrations}
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
              className: 'action-btn-small info',
              onClick: handleViewRegistration
            },
            {
              label: 'Approve',
              className: 'action-btn-small success',
              onClick: (registration) => handleApproveRegistration(registration.id),
              show: (registration) => registration.status === 'PENDING'
            },
            {
              label: 'Reject',
              className: 'action-btn-small danger',
              onClick: (registration) => handleRejectRegistration(registration.id),
              show: (registration) => registration.status === 'PENDING'
            }
          ]}
      />
    </div>
  );
  };

  const renderEmployees = () => {
    const filteredEmployees = getFilteredEmployees();

  return (
      <div className="overview-section">
        {!showEmployeeRegistration ? (
          <>
            <div className="overview-header">
              <h2 className="overview-title">Employee Management</h2>
              <p className="overview-description">
                View and manage employee profiles with KYC assignment statistics.
              </p>
              <div className="overview-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => setShowEmployeeRegistration(true)}
                >
                  Add Employee
          </button>
        </div>
      </div>

            {/* Employee Stats */}
            <div className="employee-stats">
              <h3>Employee KYC Progress</h3>
              <div className="employee-stats-grid">
                {employees.map(employee => {
                  // Calculate real stats from farmers data
                  const assignedFarmers = (farmers || []).filter(f => 
                    f.assignedEmployee === employee.name || 
                    f.assignedEmployee === employee.contactNumber ||
                    f.assignedEmployeeId === employee.id
                  );
                  
                  const approvedCount = assignedFarmers.filter(f => 
                    f.kycStatus === 'APPROVED' || f.kycStatus === 'approved'
                  ).length;
                  
                  const pendingCount = assignedFarmers.filter(f => 
                    f.kycStatus === 'PENDING' || f.kycStatus === 'pending' || 
                    f.kycStatus === 'NOT_STARTED' || f.kycStatus === 'not_started'
                  ).length;
                  
                  const referBackCount = assignedFarmers.filter(f => 
                    f.kycStatus === 'REFER_BACK' || f.kycStatus === 'refer_back'
                  ).length;
                  
                  const rejectedCount = assignedFarmers.filter(f => 
                    f.kycStatus === 'REJECTED' || f.kycStatus === 'rejected'
                  ).length;
                  
                  return (
                    <div key={employee.id} className="employee-stat-card">
                      <div className="employee-info">
                        <h4>{employee.name}</h4>
                        <p>{employee.designation} - {employee.district}</p>
                      </div>
                      <div className="employee-kyc-stats">
                        <div className="kyc-stat">
                          <span className="stat-number">{assignedFarmers.length}</span>
                          <span className="stat-label">Total Assigned</span>
                        </div>
                        <div className="kyc-stat">
                          <span className="stat-number approved">{approvedCount}</span>
                          <span className="stat-label">Approved</span>
                        </div>
                        <div className="kyc-stat">
                          <span className="stat-number pending">{pendingCount}</span>
                          <span className="stat-label">Pending</span>
                        </div>
                        <div className="kyc-stat">
                          <span className="stat-number refer-back">{referBackCount}</span>
                          <span className="stat-label">Refer Back</span>
                        </div>
                        <div className="kyc-stat">
                          <span className="stat-number rejected">{rejectedCount}</span>
                          <span className="stat-label">Rejected</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

            {/* Employees Table */}
          <DataTable
            data={filteredEmployees.map(employee => {
              // Calculate real stats from farmers data
              const assignedFarmers = (farmers || []).filter(f => 
                f.assignedEmployee === employee.name || 
                f.assignedEmployee === employee.contactNumber ||
                f.assignedEmployeeId === employee.id
              );
              
              const approvedCount = assignedFarmers.filter(f => 
                f.kycStatus === 'APPROVED' || f.kycStatus === 'approved'
              ).length;
              
              const pendingCount = assignedFarmers.filter(f => 
                f.kycStatus === 'PENDING' || f.kycStatus === 'pending' || 
                f.kycStatus === 'NOT_STARTED' || f.kycStatus === 'not_started'
              ).length;
              
              return {
                ...employee,
                totalAssigned: assignedFarmers.length,
                approvedKyc: approvedCount,
                pendingKyc: pendingCount
              };
            })}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'contactNumber', label: 'Contact' },
              { key: 'email', label: 'Email' },
              { key: 'state', label: 'State' },
              { key: 'district', label: 'District' },
              { key: 'totalAssigned', label: 'Assigned Farmers' },
              { key: 'approvedKyc', label: 'Approved KYC' },
              { key: 'pendingKyc', label: 'Pending KYC' }
            ]}
            customActions={[
              {
                label: 'View',
                className: 'action-btn-small info',
                onClick: handleViewEmployee
              },
              {
                label: 'Edit',
                className: 'action-btn-small primary',
                onClick: handleEditEmployee
              }
            ]}
          />
          </>
        ) : (
          <div className="employee-registration-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Add New Employee</h2>
                <p className="section-description">
                  Fill in the employee details to create a new employee account.
                </p>
              </div>
              <div className="section-actions">
        <button 
                  className="action-btn-small secondary"
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
    );
  };

  const renderKYCOverview = () => {
    const stats = getStats();
    
    return (
      <div className="overview-section">
        <div className="overview-header">
          <h2 className="overview-title">KYC Overview</h2>
          <p className="overview-description">
            Comprehensive view of KYC status across all farmers and employees.
          </p>
        </div>

        {/* KYC Status Breakdown */}
        <div className="kyc-breakdown">
          <h3>KYC Status Breakdown</h3>
          <div className="kyc-stats-grid">
            <div className="kyc-stat-card approved">
              <span className="kyc-stat-number">{stats.approvedKYC}</span>
              <span className="kyc-stat-label">Approved</span>
            </div>
            <div className="kyc-stat-card pending">
              <span className="kyc-stat-number">{stats.pendingKYC}</span>
              <span className="kyc-stat-label">Pending</span>
            </div>
            <div className="kyc-stat-card refer-back">
              <span className="kyc-stat-number">{stats.referBackKYC}</span>
              <span className="kyc-stat-label">Refer Back</span>
            </div>
            <div className="kyc-stat-card rejected">
              <span className="kyc-stat-number">{stats.rejectedKYC}</span>
              <span className="kyc-stat-label">Rejected</span>
            </div>
          </div>
        </div>

        {/* Employee KYC Progress */}
        <div className="employee-stats">
          <h3>Employee KYC Progress</h3>
          <div className="employee-stats-grid">
            {employees.map(employee => {
              // Calculate real stats from farmers data
              const assignedFarmers = (farmers || []).filter(f => 
                f.assignedEmployee === employee.name || 
                f.assignedEmployee === employee.contactNumber ||
                f.assignedEmployeeId === employee.id
              );
              
              const approvedCount = assignedFarmers.filter(f => 
                f.kycStatus === 'APPROVED' || f.kycStatus === 'approved'
              ).length;
              
              const pendingCount = assignedFarmers.filter(f => 
                f.kycStatus === 'PENDING' || f.kycStatus === 'pending' || 
                f.kycStatus === 'NOT_STARTED' || f.kycStatus === 'not_started'
              ).length;
              
              const referBackCount = assignedFarmers.filter(f => 
                f.kycStatus === 'REFER_BACK' || f.kycStatus === 'refer_back'
              ).length;
              
              const rejectedCount = assignedFarmers.filter(f => 
                f.kycStatus === 'REJECTED' || f.kycStatus === 'rejected'
              ).length;
              
              return (
                <div key={employee.id} className="employee-stat-card">
                  <div className="employee-info">
                    <h4>{employee.name}</h4>
                    <p>{employee.designation} - {employee.district}</p>
                  </div>
                  <div className="employee-kyc-stats">
                    <div className="kyc-stat">
                      <span className="stat-number">{assignedFarmers.length}</span>
                      <span className="stat-label">Total Assigned</span>
                    </div>
                    <div className="kyc-stat">
                      <span className="stat-number approved">{approvedCount}</span>
                      <span className="stat-label">Approved</span>
                    </div>
                    <div className="kyc-stat">
                      <span className="stat-number pending">{pendingCount}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                    <div className="kyc-stat">
                      <span className="stat-number refer-back">{referBackCount}</span>
                      <span className="stat-label">Refer Back</span>
                    </div>
                    <div className="kyc-stat">
                      <span className="stat-number rejected">{rejectedCount}</span>
                      <span className="stat-label">Rejected</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KYC Progress Overview */}
        <div className="kyc-progress-section">
          <h3>KYC Progress Overview</h3>
          <div className="kyc-progress-grid">
            <div className="progress-card approved">
              <div className="progress-circle">
                <div className="progress-number">{stats.approvedKYC}</div>
              </div>
              <div className="progress-label">Approved KYC</div>
            </div>
            <div className="progress-card pending">
              <div className="progress-circle">
                <div className="progress-number">{stats.pendingKYC}</div>
              </div>
              <div className="progress-label">Pending KYC</div>
            </div>
            <div className="progress-card refer-back">
              <div className="progress-circle">
                <div className="progress-number">{stats.referBackKYC}</div>
              </div>
              <div className="progress-label">Refer Back</div>
            </div>
            <div className="progress-card rejected">
              <div className="progress-circle">
                <div className="progress-number">{stats.rejectedKYC}</div>
              </div>
              <div className="progress-label">Rejected KYC</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <h2>DATE Digital Agristack</h2>
          <p>Admin Dashboard</p>
        </div>
        
        <div className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Overview</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'kyc-overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('kyc-overview')}
          >
            <i className="fas fa-clipboard-check"></i>
            <span>KYC Overview</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'farmers' ? 'active' : ''}`}
            onClick={() => setActiveTab('farmers')}
          >
            <i className="fas fa-users"></i>
            <span>Farmers</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <i className="fas fa-user-tie"></i>
            <span>Employees</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('registration')}
          >
            <i className="fas fa-user-plus"></i>
            <span>Registration</span>
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
              <h2 className="greeting-text">{getGreeting()}, {user?.name || 'Admin'}! 👋</h2>
              <p className="greeting-time">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <h1 className="header-title">Admin Dashboard</h1>
            <p className="header-subtitle">Welcome back! Here's what's happening with your agricultural data.</p>
          </div>
          <div className="header-right">
            <div className="filter-buttons">
              <button className="filter-btn">Refresh</button>
              <button className="filter-btn active">Today</button>
              <button className="filter-btn">This Month</button>
              <button className="filter-btn">This Year</button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'kyc-overview' && renderKYCOverview()}
          {activeTab === 'farmers' && renderFarmers()}
          {activeTab === 'employees' && renderEmployees()}
          {activeTab === 'registration' && renderRegistration()}
        </div>
      </div>

      {/* Modals */}
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

      {showEmployeeForm && (
        <EmployeeRegistrationForm 
          isInDashboard={true}
          editData={editingEmployee}
          onClose={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
          onSubmit={async (employeeData) => {
            try {
              if (editingEmployee) {
                const updatedEmployee = await employeesAPI.updateEmployee(editingEmployee.id, employeeData);
                setEmployees(prev => prev.map(employee => 
                  employee.id === editingEmployee.id ? updatedEmployee : employee
                ));
                alert('Employee updated successfully!');
              } else {
                const newEmployee = await employeesAPI.createEmployee(employeeData);
                setEmployees(prev => [...prev, newEmployee]);
                alert('Employee created successfully!');
              }
              setShowEmployeeForm(false);
              setEditingEmployee(null);
            } catch (error) {
              console.error('Error saving employee:', error);
              alert('Failed to save employee. Please try again.');
            }
          }}
        />
      )}

      {showAssignmentModal && (
        <AssignmentModal 
          farmers={farmers.filter(f => {
            // Check if farmer is unassigned based on backend data structure
            return !f.assignedEmployee || 
                   f.assignedEmployee === 'Not Assigned' || 
                   f.assignedEmployee === null ||
                   f.assignedEmployee === undefined ||
                   f.assignedEmployee === '';
          })}
          employees={employees}
          onClose={() => setShowAssignmentModal(false)}
          onAssign={handleAssignFarmers}
        />
      )}

      {showFarmerDetails && selectedFarmerData && (
                   <ViewFarmerRegistrationDetails
                     farmerData={selectedFarmerData}
                     onClose={handleCloseFarmerDetails}
                   />
                 )}

      {showEmployeeDetails && selectedEmployeeData && (
                   <ViewEditEmployeeDetails
          employee={selectedEmployeeData}
                     onClose={handleCloseEmployeeDetails}
                     onUpdate={handleUpdateEmployee}
                   />
                 )}

      {showKYCDocumentUpload && selectedFarmerForKYC && (
                   <KYCDocumentUpload
                     farmer={selectedFarmerForKYC}
                     onClose={handleCloseKYCDocumentUpload}
                     onApprove={handleKYCApprove}
                     onReject={handleKYCReject}
                     onReferBack={handleKYCReferBack}
                   />
                 )}

      {showRegistrationDetailModal && selectedRegistrationForDetail && (
        <RegistrationDetailModal
          registration={selectedRegistrationForDetail}
          onClose={handleCloseRegistrationDetailModal}
          onUpdate={handleRegistrationUpdate}
          onApprove={handleApproveRegistration}
          onReject={handleRejectRegistration}
                   />
                 )}
               </div>
             );
};

export default AdminDashboard; 