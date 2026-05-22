'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { staffApi } from '@/lib/api'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Users, UserCheck, UserX, Eye, Pencil, ChevronLeft, ChevronRight, X, Phone, Mail, MapPin, Briefcase, Calendar } from 'lucide-react'

const MOCK_STAFF_MEMBERS = [
  { 
    id: '1', 
    name: 'Dr. Sarah Jenkins', 
    role: 'Head of Mathematics', 
    department: 'Mathematics Dept.', 
    email: 's.jenkins@edumanage.edu', 
    phone: '+234 801 234 5678',
    address: '12 Victoria Island, Lagos',
    joinDate: 'Sept 12, 2018',
    status: 'Active', 
    avatar: null 
  },
  { 
    id: '2', 
    name: 'Prof. Robert Chen', 
    role: 'Senior Lecturer', 
    department: 'Physics Dept.', 
    email: 'r.chen@edumanage.edu', 
    phone: '+234 802 345 6789',
    address: '45 Lekki Phase 1, Lagos',
    joinDate: 'Jan 05, 2020',
    status: 'Active', 
    avatar: null 
  },
  { 
    id: '3', 
    name: 'Elena Rostova', 
    role: 'Academic Coordinator', 
    department: 'Administration', 
    email: 'e.rostova@edumanage.edu', 
    phone: '+234 803 456 7890',
    address: '22 Ikeja GRA, Lagos',
    joinDate: 'Mar 20, 2021',
    status: 'On Leave', 
    avatar: null 
  },
  { id: '4', name: 'David Kim', role: 'Adjunct Professor', department: 'Humanities Dept.', email: 'd.kim@edumanage.edu', phone: '+234 804 567 8901', address: 'Surulere, Lagos', joinDate: 'Aug 15, 2022', status: 'Active', avatar: null },
  { id: '5', name: 'Prof. Alan Smith', role: 'Senior Lecturer', department: 'English Dept.', email: 'a.smith@edumanage.edu', phone: '+234 805 678 9012', address: 'Yaba, Lagos', joinDate: 'Feb 10, 2019', status: 'Active', avatar: null },
  { id: '6', name: 'Dr. Maria Santos', role: 'Lab Instructor', department: 'Science Dept.', email: 'm.santos@edumanage.edu', phone: '+234 806 789 0123', address: 'Maryland, Lagos', joinDate: 'Nov 22, 2023', status: 'Active', avatar: null },
  { id: '7', name: 'James Wilson', role: 'History Teacher', department: 'Humanities Dept.', email: 'j.wilson@edumanage.edu', phone: '+234 807 890 1234', address: 'Gbagada, Lagos', joinDate: 'Oct 01, 2021', status: 'Active', avatar: null },
  { id: '8', name: 'Linda Garcia', role: 'Biology Teacher', department: 'Science Dept.', email: 'l.garcia@edumanage.edu', phone: '+234 808 901 2345', address: 'Apapa, Lagos', joinDate: 'Jan 15, 2024', status: 'Active', avatar: null },
  { id: '9', name: 'Michael Brown', role: 'Chemistry Teacher', department: 'Science Dept.', email: 'm.brown@edumanage.edu', phone: '+234 809 012 3456', address: 'Festac, Lagos', joinDate: 'Sept 30, 2022', status: 'Active', avatar: null },
  { id: '10', name: 'Susan Taylor', role: 'Art Instructor', department: 'Arts Dept.', email: 's.taylor@edumanage.edu', phone: '+234 810 123 4567', address: 'Ikoyi, Lagos', joinDate: 'May 05, 2020', status: 'Active', avatar: null },
  { id: '11', name: 'Christopher Lee', role: 'Music Teacher', department: 'Arts Dept.', email: 'c.lee@edumanage.edu', phone: '+234 811 234 5678', address: 'Ajah, Lagos', joinDate: 'July 12, 2021', status: 'Active', avatar: null },
  { id: '12', name: 'Jessica Davis', role: 'Physical Education', department: 'Sports Dept.', email: 'j.davis@edumanage.edu', phone: '+234 812 345 6789', address: 'Epe, Lagos', joinDate: 'Dec 18, 2018', status: 'Active', avatar: null },
  { id: '13', name: 'Matthew Moore', role: 'IT Specialist', department: 'Administration', email: 'm.moore@edumanage.edu', phone: '+234 813 456 7890', address: 'Ogba, Lagos', joinDate: 'April 22, 2023', status: 'Active', avatar: null },
  { id: '14', name: 'Karen White', role: 'Librarian', department: 'Library', email: 'k.white@edumanage.edu', phone: '+234 814 567 8901', address: 'Mushin, Lagos', joinDate: 'Aug 08, 2020', status: 'Active', avatar: null },
  { id: '15', name: 'Paul Anderson', role: 'Security Head', department: 'Security', email: 'p.anderson@edumanage.edu', phone: '+234 815 678 9012', address: 'Agege, Lagos', joinDate: 'Feb 14, 2019', status: 'Active', avatar: null },
]

const MOCK_STAFF = {
  total: MOCK_STAFF_MEMBERS.length,
  active: MOCK_STAFF_MEMBERS.filter(m => m.status === 'Active').length,
  on_leave: MOCK_STAFF_MEMBERS.filter(m => m.status === 'On Leave').length,
  members: MOCK_STAFF_MEMBERS
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#ECFDF5', text: '#059669' },
  'On Leave': { bg: '#FFF7ED', text: '#C2410C' },
}

export default function StaffPage() {
  const [dept, setDept] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStaff, setSelectedStaff] = useState<typeof MOCK_STAFF_MEMBERS[0] | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [localMembers, setLocalMembers] = useState(MOCK_STAFF_MEMBERS)
  const [editFormData, setEditFormData] = useState<typeof MOCK_STAFF_MEMBERS[0] | null>(null)
  
  const itemsPerPage = 10

  const { data = { members: localMembers, total: localMembers.length, active: localMembers.filter(m => m.status === 'Active').length, on_leave: localMembers.filter(m => m.status === 'On Leave').length } } = useQuery({
    queryKey: ['staff', dept, role, status, localMembers],
    queryFn: () => staffApi.list({ department: dept, role, status }).then(r => r.data),
    placeholderData: { members: localMembers, total: localMembers.length, active: localMembers.filter(m => m.status === 'Active').length, on_leave: localMembers.filter(m => m.status === 'On Leave').length },
  })

  // Filter logic for frontend simulation
  const filteredMembers = data.members.filter(m => {
    return (dept === '' || m.department === dept) &&
           (role === '' || m.role.includes(role)) &&
           (status === '' || m.status === status)
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleViewDetails = (staff: typeof MOCK_STAFF_MEMBERS[0]) => {
    setSelectedStaff(staff)
    setShowDetails(true)
  }

  const handleEditClick = (staff: typeof MOCK_STAFF_MEMBERS[0]) => {
    setEditFormData({ ...staff })
    setShowEdit(true)
    setShowDetails(false)
  }

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFormData) return

    setLocalMembers(prev => prev.map(m => m.id === editFormData.id ? editFormData : m))
    toast.success(`${editFormData.name}'s profile updated successfully!`)
    setShowEdit(false)
  }

  return (
    <AppLayout>
      <Topbar action={{ label: 'Add Staff Member', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Faculty Directory</h1>
        <p className="page-subtitle">Manage institutional staff, roles, and departmental assignments.</p>
      </div>

      <div className="px-6 pb-8 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 animate-in stagger-1">
          {[
            { label: 'Total Staff', value: data.total, icon: Users, color: '#C9A020' },
            { label: 'Active Today', value: data.active, icon: UserCheck, color: '#10B981' },
            { label: 'On Leave', value: data.on_leave, icon: UserX, color: '#F59E0B' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="stat-label">{label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <div className="stat-value">{value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-end justify-between animate-in stagger-2">
          <div className="flex gap-2 flex-wrap">
            <select value={dept} onChange={e => { setDept(e.target.value); setCurrentPage(1); }} className="select w-44">
              <option value="">All Departments</option>
              <option>Mathematics Dept.</option><option>Physics Dept.</option>
              <option>Administration</option><option>Humanities Dept.</option>
              <option>Science Dept.</option><option>Arts Dept.</option>
              <option>Sports Dept.</option><option>Library</option>
              <option>Security</option>
            </select>
            <select value={role} onChange={e => { setRole(e.target.value); setCurrentPage(1); }} className="select w-36">
              <option value="">All Roles</option>
              <option>Head of Department</option><option>Senior Lecturer</option>
              <option>Adjunct Professor</option><option>Lab Instructor</option>
              <option>Teacher</option>
            </select>
            <select value={status} onChange={e => { setStatus(e.target.value); setCurrentPage(1); }} className="select w-36">
              <option value="">All Status</option>
              <option>Active</option><option>On Leave</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="card p-0 overflow-hidden animate-in stagger-3">
          <table className="table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((m) => {
                const sc = statusColors[m.status] || { bg: '#F3F4F6', text: '#4B5563' }
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                             style={{ background: 'linear-gradient(135deg, #C9A020, #8B6E10)' }}>
                          {getInitials(m.name)}
                        </div>
                        <span className="font-semibold">{m.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#6B6660' }}>{m.role}</td>
                    <td style={{ color: '#6B6660' }}>{m.department}</td>
                    <td style={{ color: '#6B6660' }}>{m.email}</td>
                    <td><span className="badge text-xs px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{m.status}</span></td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => handleViewDetails(m)} className="btn-outline text-xs px-2.5 py-1.5 flex items-center gap-1"><Eye size={12} /> View</button>
                        <button onClick={() => handleEditClick(m)} className="btn-outline text-xs px-2.5 py-1.5"><Pencil size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: '#E4E1D8' }}>
              <p className="text-sm" style={{ color: '#6B6660' }}>
                Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredMembers.length)}</span> of <span className="font-semibold">{filteredMembers.length}</span> staff members
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border transition-all disabled:opacity-50"
                  style={{ borderColor: '#E4E1D8', background: 'white' }}
                >
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className="w-9 h-9 rounded-md border text-sm font-semibold transition-all"
                    style={{
                      borderColor: currentPage === i + 1 ? '#C9A020' : '#E4E1D8',
                      background: currentPage === i + 1 ? '#C9A020' : 'white',
                      color: currentPage === i + 1 ? 'white' : '#0D0D0D'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border transition-all disabled:opacity-50"
                  style={{ borderColor: '#E4E1D8', background: 'white' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Details Modal */}
      {showDetails && selectedStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative h-32 bg-gradient-to-r from-gold-600 to-gold-400">
              <button 
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-white overflow-hidden"
                     style={{ background: 'linear-gradient(135deg, #C9A020, #8B6E10)' }}>
                  {getInitials(selectedStaff.name)}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="pt-16 pb-8 px-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h2>
                  <p className="text-gold-600 font-semibold">{selectedStaff.role}</p>
                </div>
                <span className="badge px-4 py-1.5 rounded-full font-bold text-sm"
                      style={{ 
                        background: statusColors[selectedStaff.status]?.bg || '#F3F4F6', 
                        color: statusColors[selectedStaff.status]?.text || '#4B5563' 
                      }}>
                  {selectedStaff.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Contact Information</h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gold-600">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-medium">{selectedStaff.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gold-600">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm font-medium">{selectedStaff.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gold-600">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-medium">{selectedStaff.address}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Employment Details</h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gold-600">
                      <Briefcase size={16} />
                    </div>
                    <span className="text-sm font-medium">{selectedStaff.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gold-600">
                      <Calendar size={16} />
                    </div>
                    <span className="text-sm font-medium">Joined {selectedStaff.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowDetails(false)}
                  className="btn-outline px-6 py-2"
                >
                  Close
                </button>
                <button onClick={() => handleEditClick(selectedStaff)} className="btn-gold px-6 py-2 flex items-center gap-2">
                  <Pencil size={16} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEdit && editFormData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Staff Profile</h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Employee ID: {editFormData.id}</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                  <input 
                    type="text" required
                    value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Role / Designation</label>
                  <input 
                    type="text" required
                    value={editFormData.role}
                    onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Department</label>
                  <select 
                    value={editFormData.department}
                    onChange={e => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="select w-full"
                  >
                    <option>Mathematics Dept.</option><option>Physics Dept.</option>
                    <option>Administration</option><option>Humanities Dept.</option>
                    <option>Science Dept.</option><option>Arts Dept.</option>
                    <option>Sports Dept.</option><option>Library</option>
                    <option>Security</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                  <input 
                    type="email" required
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
                  <input 
                    type="text" required
                    value={editFormData.phone}
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
                  <select 
                    value={editFormData.status}
                    onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="select w-full"
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowEdit(false)} className="btn-outline px-8 py-2.5">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-8 py-2.5 shadow-lg shadow-gold-500/20">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
