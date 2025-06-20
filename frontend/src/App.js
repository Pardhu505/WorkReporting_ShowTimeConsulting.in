import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Table, Users, Moon, Sun, Palette, CheckCircle, AlertCircle, X, Edit2, Save, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import './App.css';

const DailyWorkTracker = () => {
  const [currentView, setCurrentView] = useState('landing'); // landing, app
  const [activeTab, setActiveTab] = useState('report');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');

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
    reportingManager: '',
    fromDate: '',
    toDate: ''
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
      "Soul Central": ["Atia"],
      "Field Team": ["Siddharth Gautam", "Sai Kiran Gurram", "Akhilesh Mishra"]
    },
    "Directors": {
      "Director": ["Anant Tiwari"],
      "Associate Director": ["Alimpan Banerjee"]
    },
    "Directors team": {
      "Directors Team": ["Himani Sehgal", "Pawan Beniwal", "Aditya Pandit", "Sravya", "Eshwar"]
    },
    "Campaign": {
      "Campaign": ["S S Manoharan"]
    },
    "Data": {
      "Data": ["T. Pardhasaradhi"]
    },
    "Media": {
      "Media": ["Aakanksha Tandon"]
    },
    "Research": {
      "Research": ["P. Srinath Rao"]
    },
    "DMC": {
      "HIVE": ["Madhunisha and Apoorva"],
      "Digital Communication": ["Keerthana"],
      "Digital Production": ["Bapan"]
    },
    "HR": {
      "HR": ["Tejaswini"]
    },
    "Admin": {
      "Operations": ["Nikash"]
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
        !formData.employeeName || !formData.date) {
      setSuccessMessage('Please fill in all required fields.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    // Validate that all tasks have both task and status filled
    const hasEmptyTasks = formData.tasks.some(task => !task.task || !task.status);
    if (hasEmptyTasks) {
      setSuccessMessage('Please fill in all task details and their statuses.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    setIsLoading(true);

    // Create separate reports for each task
    const newReports = formData.tasks.map((taskItem, index) => ({
      ...formData,
      tasks: taskItem.task,
      status: taskItem.status,
      id: Date.now() + index,
      timestamp: new Date().toISOString()
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(prev => [...prev, ...newReports]);

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
        tasks: [{ task: '', status: '' }]
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
    if (!filters.department && !filters.team && !filters.reportingManager && !filters.fromDate && !filters.toDate) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter(report => {
      // Department filter
      if (filters.department && report.department !== filters.department) return false;
      
      // Team filter
      if (filters.team && report.team !== filters.team) return false;
      
      // Reporting Manager filter
      if (filters.reportingManager && report.reportingManager !== filters.reportingManager) return false;
      
      // Date range filter
      const reportDate = new Date(report.date);
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        if (reportDate < fromDate) return false;
      }
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        if (reportDate > toDate) return false;
      }
      
      return true;
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

  const exportToPDF = () => {
    const dataToExport = reports
      .filter(report => {
        // Department filter
        if (filters.department && report.department !== filters.department) return false;
        
        // Date range filter
        const reportDate = new Date(report.date);
        if (filters.fromDate) {
          const fromDate = new Date(filters.fromDate);
          if (reportDate < fromDate) return false;
        }
        if (filters.toDate) {
          const toDate = new Date(filters.toDate);
          if (reportDate > toDate) return false;
        }
        
        return true;
      });
    
    if (dataToExport.length === 0) {
      alert('No data to export');
      return;
    }

    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;

    // Title
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Team Summary Report', 20, yPosition);
    yPosition += 10;

    // Date and filters info
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 5;
    if (filters.fromDate || filters.toDate) {
      const dateRange = `${filters.fromDate ? new Date(filters.fromDate).toLocaleDateString() : 'Start'} - ${filters.toDate ? new Date(filters.toDate).toLocaleDateString() : 'End'}`;
      pdf.text(`Date Range: ${dateRange}`, 20, yPosition);
      yPosition += 5;
    }
    if (filters.department) {
      pdf.text(`Filtered by Department: ${filters.department}`, 20, yPosition);
      yPosition += 5;
    }
    yPosition += 10;

    // Group data hierarchically
    const groupedData = dataToExport.reduce((acc, report) => {
      const dateKey = new Date(report.date).toLocaleDateString();
      if (!acc[dateKey]) acc[dateKey] = {};
      if (!acc[dateKey][report.department]) acc[dateKey][report.department] = {};
      if (!acc[dateKey][report.department][report.team]) acc[dateKey][report.department][report.team] = {};
      if (!acc[dateKey][report.department][report.team][report.reportingManager]) {
        acc[dateKey][report.department][report.team][report.reportingManager] = {};
      }
      if (!acc[dateKey][report.department][report.team][report.reportingManager][report.employeeName]) {
        acc[dateKey][report.department][report.team][report.reportingManager][report.employeeName] = [];
      }
      acc[dateKey][report.department][report.team][report.reportingManager][report.employeeName].push({
        task: report.tasks,
        status: report.status
      });
      return acc;
    }, {});

    // Generate PDF content
    Object.entries(groupedData).forEach(([date, departments]) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(`Date: ${date}`, 20, yPosition);
      yPosition += 8;

      Object.entries(departments).forEach(([department, teams]) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.text(`  Department: ${department}`, 25, yPosition);
        yPosition += 6;

        Object.entries(teams).forEach(([team, managers]) => {
          if (yPosition > pageHeight - 25) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFont(undefined, 'normal');
          pdf.text(`    Team: ${team}`, 30, yPosition);
          yPosition += 5;

          Object.entries(managers).forEach(([manager, employees]) => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            
            pdf.text(`      Manager: ${manager}`, 35, yPosition);
            yPosition += 5;

            Object.entries(employees).forEach(([employee, tasks]) => {
              if (yPosition > pageHeight - 15) {
                pdf.addPage();
                yPosition = 20;
              }
              
              pdf.text(`        Employee: ${employee}`, 40, yPosition);
              yPosition += 4;

              tasks.forEach((taskItem, index) => {
                if (yPosition > pageHeight - 10) {
                  pdf.addPage();
                  yPosition = 20;
                }
                
                const taskText = `          Task: ${taskItem.task.substring(0, 60)}${taskItem.task.length > 60 ? '...' : ''}`;
                const statusText = `Status: ${taskItem.status}`;
                
                pdf.text(taskText, 45, yPosition);
                yPosition += 4;
                pdf.text(`          ${statusText}`, 45, yPosition);
                yPosition += 6;
              });
            });
          });
        });
      });
    });

    pdf.save('team_summary_report.pdf');
  };

  const startEditTask = (reportId, currentTask) => {
    setEditingTask(reportId);
    setEditedTaskText(currentTask);
  };

  const saveEditTask = (reportId) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, tasks: editedTaskText }
        : report
    ));
    setEditingTask(null);
    setEditedTaskText('');
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setEditedTaskText('');
  };

  const navigateToApp = (tab = 'report') => {
    setCurrentView('app');
    setActiveTab(tab);
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className={`min-h-screen transition-all duration-500 ${getThemeClasses()}`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Theme Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${getCardClasses()} rounded-3xl p-6 mb-8 border`}
        >
          <div className="flex justify-between items-center">
            <div></div>
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
          </div>
        </motion.div>

        {/* Main Landing Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          {/* Logo and Company Branding */}
          <motion.div 
            className="flex flex-col items-center mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="relative w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="https://showtimeconsulting.in/images/settings/2fd13f50.png" 
                alt="Showtime Consulting"
                className="w-24 h-24 object-contain"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            
            <motion.h1 
              className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              SHOWTIME
            </motion.h1>
            
            <motion.p 
              className={`text-xl md:text-2xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              CONSULTING
            </motion.p>
            
            <motion.div
              className={`w-24 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-8`}
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome to the
            </h2>
            <h3 className={`text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
              Daily Work Reporting Portal
            </h3>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Streamline your daily work reporting with our professional, intuitive platform designed for efficient team management and progress tracking.
            </p>
          </motion.div>

          {/* Navigation Cards */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
          >
            {/* Daily Report Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateToApp('report')}
              className={`${getCardClasses()} p-8 rounded-2xl border cursor-pointer group`}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <h4 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Daily Report
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Submit your daily work reports with multiple tasks and status tracking
              </p>
            </motion.div>

            {/* RM's Team Report Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateToApp('summary')}
              className={`${getCardClasses()} p-8 rounded-2xl border cursor-pointer group`}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <h4 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                RM's Team Report
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                View, filter, and manage team reports with editing capabilities
              </p>
            </motion.div>

            {/* Summary Report Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateToApp('teamSummary')}
              className={`${getCardClasses()} p-8 rounded-2xl border cursor-pointer group`}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Table className="w-8 h-8 text-white" />
              </motion.div>
              <h4 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Summary Report
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Hierarchical team summary with PDF export functionality
              </p>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className={`${getCardClasses()} rounded-2xl p-8 border max-w-4xl mx-auto`}
          >
            <h4 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Platform Features
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                  <CheckCircle className={`w-6 h-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Easy Reporting
                </h5>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Simple and intuitive daily reporting interface
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                  <Download className={`w-6 h-6 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
                </div>
                <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  PDF Export
                </h5>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Professional PDF reports with hierarchical structure
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                  <Edit2 className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                </div>
                <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Live Editing
                </h5>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Edit and update reports in real-time
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                  <Palette className={`w-6 h-6 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                </div>
                <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dark Mode
                </h5>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Professional light and dark themes
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

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
    <>
      {currentView === 'landing' ? (
        <LandingPage />
      ) : (
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
                  className="flex items-center gap-4 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={navigateToLanding}
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
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('teamSummary')}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeTab === 'teamSummary'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : isDarkMode
                        ? 'bg-gray-700 text-indigo-300 border-2 border-indigo-400 hover:bg-gray-600'
                        : 'bg-white text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    <Table className="w-4 h-4 inline mr-2" />
                    Summary Report
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>

                {/* Dynamic Task Fields */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Tasks & Status
                  </h3>
                  
                  <AnimatePresence>
                    {formData.tasks.map((taskItem, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start"
                      >
                        {/* Task Details */}
                        <div className="md:col-span-3">
                          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Task Details {index + 1} *
                          </label>
                          <textarea
                            value={taskItem.task}
                            onChange={(e) => handleTaskChange(index, 'task', e.target.value)}
                            placeholder="Enter detailed task description..."
                            required
                            rows={2}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-vertical ${getInputClasses()}`}
                          />
                        </div>

                        {/* Status */}
                        <div className="flex flex-col">
                          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Status *
                          </label>
                          <div className="flex gap-2 h-full">
                            <select
                              value={taskItem.status}
                              onChange={(e) => handleTaskChange(index, 'status', e.target.value)}
                              required
                              className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 h-[52px] ${getInputClasses()}`}
                            >
                              <option value="">Select Status</option>
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            {formData.tasks.length > 1 && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => removeTask(index)}
                                className="px-3 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors h-[52px] flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add New Task Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={addNewTask}
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-xl font-semibold transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 text-gray-400 hover:border-indigo-400 hover:text-indigo-400' 
                        : 'border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-500'
                    }`}
                  >
                    + Add New Task
                  </motion.button>
                </div>

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
                              {editingTask === report.id ? (
                                <div className="flex items-center gap-2">
                                  <textarea
                                    value={editedTaskText}
                                    onChange={(e) => setEditedTaskText(e.target.value)}
                                    className={`flex-1 px-2 py-1 text-xs border rounded resize-none ${getInputClasses()}`}
                                    rows="2"
                                  />
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => saveEditTask(report.id)}
                                    className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                  >
                                    <Save className="w-3 h-3" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={cancelEditTask}
                                    className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </motion.button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="truncate flex-1" title={report.tasks}>
                                    {report.tasks.length > 100 ? `${report.tasks.substring(0, 100)}...` : report.tasks}
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => startEditTask(report.id, report.tasks)}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </motion.button>
                                </div>
                              )}
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

          {activeTab === 'teamSummary' && (
            <motion.div
              key="teamSummary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className={`${getCardClasses()} rounded-3xl p-8 border`}
            >
              <div className="mb-8">
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Team Summary Report
                </h2>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Hierarchical view: Date → Department → Team → Manager → Employee → Tasks → Status
                </p>

                {/* Filter Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* From Date Filter */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.fromDate || ''}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    />
                  </motion.div>

                  {/* To Date Filter */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.toDate || ''}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                      min={filters.fromDate || ''}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    />
                  </motion.div>

                  {/* Department Filter */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Filter by Department
                    </label>
                    <select
                      value={filters.department || ''}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${getInputClasses()}`}
                    >
                      <option value="">All Departments</option>
                      {Object.keys(departmentData).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Clear Filters Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-end"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters({ department: '', team: '', reportingManager: '', fromDate: '', toDate: '' })}
                      className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      Clear Filters
                    </motion.button>
                  </motion.div>
                </div>

                {/* Export Button */}
                <div className="flex gap-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </motion.button>
                </div>

                {reports.length === 0 ? (
                  <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Table className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No reports available</p>
                    <p>Submit some reports to see the team summary</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(
                      reports
                        .filter(report => {
                          // Apply department filter if set
                          if (filters.department && report.department !== filters.department) return false;
                          
                          // Apply date range filter if set
                          const reportDate = new Date(report.date);
                          if (filters.fromDate) {
                            const fromDate = new Date(filters.fromDate);
                            if (reportDate < fromDate) return false;
                          }
                          if (filters.toDate) {
                            const toDate = new Date(filters.toDate);
                            if (reportDate > toDate) return false;
                          }
                          
                          return true;
                        })
                        .reduce((acc, report) => {
                        const dateKey = new Date(report.date).toLocaleDateString();
                        if (!acc[dateKey]) acc[dateKey] = {};
                        
                        if (!acc[dateKey][report.department]) acc[dateKey][report.department] = {};
                        if (!acc[dateKey][report.department][report.team]) acc[dateKey][report.department][report.team] = {};
                        if (!acc[dateKey][report.department][report.team][report.reportingManager]) {
                          acc[dateKey][report.department][report.team][report.reportingManager] = {};
                        }
                        if (!acc[dateKey][report.department][report.team][report.reportingManager][report.employeeName]) {
                          acc[dateKey][report.department][report.team][report.reportingManager][report.employeeName] = [];
                        }
                        
                        acc[dateKey][report.department][report.team][report.reportingManager][report.employeeName].push({
                          task: report.tasks,
                          status: report.status,
                          id: report.id
                        });
                        
                        return acc;
                      }, {})
                    ).map(([date, departments]) => (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-2xl p-6 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}
                      >
                        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                          📅 {date}
                        </h3>
                        
                        {Object.entries(departments).map(([department, teams]) => (
                          <div key={department} className="mb-6">
                            <h4 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              🏢 {department}
                            </h4>
                            
                            {Object.entries(teams).map(([team, managers]) => (
                              <div key={team} className="mb-4 ml-4">
                                <h5 className={`text-md font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                                  👥 {team}
                                </h5>
                                
                                {Object.entries(managers).map(([manager, employees]) => (
                                  <div key={manager} className="mb-3 ml-4">
                                    <h6 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                                      👨‍💼 {manager}
                                    </h6>
                                    
                                    {Object.entries(employees).map(([employee, tasks]) => (
                                      <div key={employee} className="mb-2 ml-4">
                                        <div className={`text-sm font-medium mb-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                          👤 {employee}
                                        </div>
                                        
                                        <div className="ml-6 space-y-1">
                                          {tasks.map((taskItem, index) => (
                                            <div key={taskItem.id} className={`text-xs p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                              <div className="flex items-start justify-between gap-2">
                                                <span className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                  📝 {taskItem.task}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(taskItem.status)}`}>
                                                  {taskItem.status}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                )}
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
      )}
    </>
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