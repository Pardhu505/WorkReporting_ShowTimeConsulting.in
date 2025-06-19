import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Table, Users, Moon, Sun, Palette, CheckCircle, AlertCircle, X } from 'lucide-react';
import './App.css';

const DailyWorkTracker = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form state with multiple tasks
  const [formData, setFormData] = useState({
    department: '',
    team: '',
    reportingManager: '',
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    tasks: [{ task: '', status: '' }] // Array of tasks with individual statuses
  });

  // Filter state
  const [filters, setFilters] = useState({
    department: '',
    team: '',
    reportingManager: ''
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getThemeClasses = () => {
    return isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white'
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900';
  };

  const getCardClasses = () => {
    return isDarkMode
      ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700/50 shadow-2xl'
      : 'bg-white/80 backdrop-blur-sm border-white/20 shadow-2xl';
  };

  const getInputClasses = () => {
    return isDarkMode
      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30'
      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30';
  };

  // Data structure
  const departmentData = {
    "Soul Centre": {
      "Soul Central": ["Atia", "Akhilesh Mishra"],
      "Field Team": ["Siddharth Gautam", "Sai Kiran Gurram", "Himani Sehgal", "Pawan Beniwal"]
    },
    "Directors team": {
      "Directors Team": ["Aditya Pandit", "Sravya", "Eshwar"]
    },
    "Campaign": {
      "Campaign": ["S S Manoharan"]
    },
    "Data": {
      "Data": ["I Pardhasaradhi"]
    },
    "Media": {
      "Media": ["Aakanksha Tandon"]
    },
    "Research": {
      "Research": ["P Srinath Rao"]
    },
    "DMC": {
      "HIVE": ["Ruhi"],
      "Digital Communication": ["Keerthana"],
      "Digital Production": ["Bapan"]
    }
  };

  const statusOptions = ["WIP", "Completed", "Yet to Start", "Delayed"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));

    // Reset dependent fields when department changes
    if (field === 'department') {
      setFormData(prev => ({...prev, team: '', reportingManager: ''}));
    }

    // Reset reporting manager when team changes
    if (field === 'team') {
      setFormData(prev => ({...prev, reportingManager: ''}));
    }
  };

  const handleTaskChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const addNewTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { task: '', status: '' }]
    }));
  };

  const removeTask = (index) => {
    if (formData.tasks.length > 1) {
      setFormData(prev => ({
        ...prev,
        tasks: prev.tasks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({...prev, [field]: value}));

    // Reset dependent filters
    if (field === 'department') {
      setFilters(prev => ({...prev, team: '', reportingManager: ''}));
    }

    if (field === 'team') {
      setFilters(prev => ({...prev, reportingManager: ''}));
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.department || !formData.team || !formData.reportingManager ||
        !formData.employeeName || !formData.date || !formData.tasks || !formData.status) {
      setSuccessMessage('Please fill in all required fields.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    setIsLoading(true);

    const newReport = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(prev => [...prev, newReport]);

      setSuccessMessage('Report submitted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setFormData({
        department: '',
        team: '',
        reportingManager: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        tasks: '',
        status: ''
      });

    } catch (error) {
      console.error('Error submitting report:', error);
      setSuccessMessage('Error submitting report. Please try again.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter reports based on current filters
  useEffect(() => {
    if (!filters.department && !filters.team && !filters.reportingManager) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter(report => {
      return (!filters.department || report.department === filters.department) &&
             (!filters.team || report.team === filters.team) &&
             (!filters.reportingManager || report.reportingManager === filters.reportingManager);
    });

    setFilteredReports(filtered);
  }, [filters, reports]);

  const getTeamsForDepartment = (department) => {
    return department && departmentData[department] ? Object.keys(departmentData[department]) : [];
  };

  const getReportingManagersForTeam = (department, team) => {
    return department && team && departmentData[department] && departmentData[department][team]
           ? departmentData[department][team] : [];
  };

  const exportToCSV = () => {
    const dataToExport = filteredReports.length > 0 ? filteredReports : reports;
    if (dataToExport.length === 0) {
      alert('No data to export');
      return;
    }

    const csvContent = [
      ['Date', 'Employee Name', 'Department', 'Team', 'Reporting Manager', 'Status', 'Tasks'],
      ...dataToExport.map(report => [
        new Date(report.date).toLocaleDateString(),
        report.employeeName,
        report.department,
        report.team,
        report.reportingManager,
        report.status,
        report.tasks
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'work_reports.csv';
    a.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return isDarkMode ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
      case 'WIP': return isDarkMode ? 'bg-blue-900/50 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Yet to Start': return isDarkMode ? 'bg-gray-900/50 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Delayed': return isDarkMode ? 'bg-red-900/50 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-200';
      default: return isDarkMode ? 'bg-gray-900/50 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${getCardClasses()} p-6 rounded-2xl max-w-md mx-4 border`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>
            </div>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {message}
            </p>
            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleSubmitWithConfirmation = () => {
    setShowConfirmDialog(true);
  };

  const confirmSubmit = () => {
    setShowConfirmDialog(false);
    handleSubmit();
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getThemeClasses()}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${getCardClasses()} rounded-3xl p-6 mb-8 border`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Showtime Logo */}
              <motion.div 
                className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://showtimeconsulting.in/images/settings/2fd13f50.png" 
                  alt="Showtime Consulting"
                  className="w-12 h-12 object-contain"
                />
              </motion.div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SHOWTIME</h1>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>CONSULTING</p>
              </div>
              <div className={`hidden lg:block h-8 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} mx-2`}></div>
              <div className="hidden lg:block">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Daily Work Report</h2>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('report')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'report'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-gray-700 text-indigo-300 border-2 border-indigo-400 hover:bg-gray-600'
                    : 'bg-white text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Daily Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('summary')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'summary'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-gray-700 text-indigo-300 border-2 border-indigo-400 hover:bg-gray-600'
                    : 'bg-white text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                RM's Team Report
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`${
                successMessage.includes('Error') || successMessage.includes('Please fill')
                  ? isDarkMode ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-red-100 border-red-400 text-red-700'
                  : isDarkMode ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-green-100 border-green-400 text-green-700'
              } px-6 py-4 rounded-2xl mb-6 shadow-md border flex items-center gap-3`}
            >
              {successMessage.includes('Error') || successMessage.includes('Please fill') ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className={`${getCardClasses()} rounded-3xl p-8 border`}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Department */}
                  <motion.div 
                    className="group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    >
                      <option value="">Select Department</option>
                      {Object.keys(departmentData).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Team */}
                  <motion.div 
                    className="group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Team *
                    </label>
                    <select
                      value={formData.team}
                      onChange={(e) => handleInputChange('team', e.target.value)}
                      required
                      disabled={!formData.department}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 disabled:opacity-50 ${getInputClasses()}`}
                    >
                      <option value="">Select Team</option>
                      {getTeamsForDepartment(formData.department).map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Reporting Manager */}
                  <motion.div 
                    className="group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Reporting Manager *
                    </label>
                    <select
                      value={formData.reportingManager}
                      onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                      required
                      disabled={!formData.team}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 disabled:opacity-50 ${getInputClasses()}`}
                    >
                      <option value="">Select Reporting Manager</option>
                      {getReportingManagersForTeam(formData.department, formData.team).map(manager => (
                        <option key={manager} value={manager}>{manager}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Employee Name */}
                  <motion.div 
                    className="group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Employee Name *
                    </label>
                    <input
                      type="text"
                      value={formData.employeeName}
                      onChange={(e) => handleInputChange('employeeName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    />
                  </motion.div>

                  {/* Date */}
                  <motion.div 
                    className="group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    />
                  </motion.div>

                  {/* Status */}
                  <motion.div 
                    className="group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                {/* Task Details */}
                <motion.div 
                  className="group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Task Details *
                  </label>
                  <textarea
                    value={formData.tasks}
                    onChange={(e) => handleInputChange('tasks', e.target.value)}
                    placeholder="Enter detailed task description..."
                    required
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-vertical ${getInputClasses()}`}
                  />
                </motion.div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleSubmitWithConfirmation}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Submit Report
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className={`${getCardClasses()} rounded-3xl p-8 border`}
            >
              <div className="mb-8">
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>RM's Team Work Report</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Department Filter */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Filter by Department
                    </label>
                    <select
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    >
                      <option value="">All Departments</option>
                      {Object.keys(departmentData).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Team Filter */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Filter by Team
                    </label>
                    <select
                      value={filters.team}
                      onChange={(e) => handleFilterChange('team', e.target.value)}
                      disabled={!filters.department}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 disabled:opacity-50 ${getInputClasses()}`}
                    >
                      <option value="">All Teams</option>
                      {getTeamsForDepartment(filters.department).map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Manager Filter */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Filter by Reporting Manager
                    </label>
                    <select
                      value={filters.reportingManager}
                      onChange={(e) => handleFilterChange('reportingManager', e.target.value)}
                      disabled={!filters.team}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 disabled:opacity-50 ${getInputClasses()}`}
                    >
                      <option value="">All Reporting Managers</option>
                      {getReportingManagersForTeam(filters.department, filters.team).map(manager => (
                        <option key={manager} value={manager}>{manager}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                <div className="flex gap-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </motion.button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Date</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Employee Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Department</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Team</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Reporting Manager</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tasks</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    <AnimatePresence>
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan="7" className={`px-6 py-12 text-center italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No reports found
                          </td>
                        </tr>
                      ) : (
                        filteredReports.map((report, index) => (
                          <motion.tr
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                          >
                            <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {new Date(report.date).toLocaleDateString()}
                            </td>
                            <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {report.employeeName}
                            </td>
                            <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {report.department}
                            </td>
                            <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {report.team}
                            </td>
                            <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {report.reportingManager}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                {report.status}
                              </span>
                            </td>
                            <td className={`px-6 py-4 text-sm max-w-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              <div className="truncate" title={report.tasks}>
                                {report.tasks.length > 100 ? `${report.tasks.substring(0, 100)}...` : report.tasks}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={confirmSubmit}
          title="Confirm Submission"
          message="Are you sure you want to submit this report? Please review all details before confirming."
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <DailyWorkTracker />
    </div>
  );
}

export default App;