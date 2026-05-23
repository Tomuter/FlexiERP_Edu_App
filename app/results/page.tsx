'use client'
import { useState } from 'react'
<<<<<<< HEAD
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, Settings, X } from 'lucide-react'
import { adminMockViews } from '@/lib/admin-mock-db'

const INITIAL_GRADING_SCALE = adminMockViews.results.grading_scale
const INITIAL_ASSESSMENTS = adminMockViews.results.assessments

export default function ResultsPage() {
  const [cls, setCls] = useState('Grade 10')
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS)
  const [gradingScale, setGradingScale] = useState(INITIAL_GRADING_SCALE)
  const [newAssessment, setNewAssessment] = useState({ name: '', maxScore: '' })
  const [newGrade, setNewGrade] = useState({ lower: '', upper: '', grade: '', remark: '' })
  const [disabledTemplates, setDisabledTemplates] = useState<Record<string, boolean>>({
    'JSS 3': true,
    'Grade 10': false,
  })
  const [templateByClass, setTemplateByClass] = useState<Record<string, string>>({
    'Grade 9': 'Standard Academic Template',
    'Grade 10': 'Standard Academic Template',
    'Grade 11': 'Standard Academic Template',
    'Grade 12': 'Standard Academic Template',
    'JSS 1': 'Standard Academic Template',
    'JSS 2': 'Standard Academic Template',
    'JSS 3': 'Standard Academic Template',
  })
  const [showEditAssessment, setShowEditAssessment] = useState(false)
  const [editAssessment, setEditAssessment] = useState<{ id: string; name: string; maxScore: string } | null>(null)
  const [showEditGrade, setShowEditGrade] = useState(false)
  const [editGrade, setEditGrade] = useState<{ id: string; lower: string; upper: string; grade: string; remark: string } | null>(null)

  const availableClasses = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'JSS 1', 'JSS 2', 'JSS 3']
  const availableTemplates = ['Standard Academic Template', 'Continuous Assessment focused Template']

  const isTemplateDisabled = (targetCls: string) => {
    if (targetCls === 'All Grades') {
      return availableClasses.every(c => disabledTemplates[c] === true)
    }
    return !!disabledTemplates[targetCls]
  }

  const toggleTemplate = () => {
    if (cls === 'All Grades') {
      const newState = !isTemplateDisabled('All Grades')
      const nextMap: Record<string, boolean> = {}
      availableClasses.forEach(c => nextMap[c] = newState)
      setDisabledTemplates(nextMap)
      toast.success(`Template ${newState ? 'disabled' : 'enabled'} for all grades`)
    } else {
      const newState = !disabledTemplates[cls]
      setDisabledTemplates(prev => ({ ...prev, [cls]: newState }))
      toast.success(`Template ${newState ? 'disabled' : 'enabled'} for ${cls}`)
    }
  }

  // CA Handlers
  const addAssessment = () => {
    if (!newAssessment.name || !newAssessment.maxScore) return
    const id = (assessments.length + 1).toString()
    setAssessments([...assessments, { id, name: newAssessment.name, maxScore: Number(newAssessment.maxScore) }])
    setNewAssessment({ name: '', maxScore: '' })
    toast.success('Assessment type added')
  }

  const deleteAssessment = (id: string) => {
    setAssessments(assessments.filter(a => a.id !== id))
    toast.success('Assessment type removed')
  }

  const openEditAssessment = (a: typeof INITIAL_ASSESSMENTS[number]) => {
    setEditAssessment({ id: a.id, name: a.name, maxScore: String(a.maxScore) })
    setShowEditAssessment(true)
  }

  const saveEditAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editAssessment) return
    setAssessments(prev => prev.map(a => a.id === editAssessment.id ? { ...a, name: editAssessment.name, maxScore: Number(editAssessment.maxScore) } : a))
    toast.success('Assessment updated')
    setShowEditAssessment(false)
    setEditAssessment(null)
  }

  // Grading Scale Handlers
  const addGrade = () => {
    if (!newGrade.grade || !newGrade.lower || !newGrade.upper) return
    const id = (gradingScale.length + 1).toString()
    setGradingScale([...gradingScale, { 
      id, 
      grade: newGrade.grade, 
      lower: Number(newGrade.lower), 
      upper: Number(newGrade.upper), 
      remark: newGrade.remark,
      color: '#0D0D0D'
    }])
    setNewGrade({ lower: '', upper: '', grade: '', remark: '' })
    toast.success('Grade rule added')
  }

  const deleteGrade = (id: string) => {
    setGradingScale(gradingScale.filter(g => g.id !== id))
    toast.success('Grade rule removed')
  }

  const openEditGrade = (g: typeof INITIAL_GRADING_SCALE[number]) => {
    setEditGrade({ id: g.id, lower: String(g.lower), upper: String(g.upper), grade: g.grade, remark: g.remark })
    setShowEditGrade(true)
  }

  const saveEditGrade = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editGrade) return
    setGradingScale(prev => prev.map(g => {
      if (g.id !== editGrade.id) return g
      return { ...g, lower: Number(editGrade.lower), upper: Number(editGrade.upper), grade: editGrade.grade, remark: editGrade.remark }
    }))
    toast.success('Grade rule updated')
    setShowEditGrade(false)
    setEditGrade(null)
  }

  const templateValue = (() => {
    if (cls !== 'All Grades') return templateByClass[cls] || 'Standard Academic Template'
    if (availableClasses.length === 0) return 'Standard Academic Template'
    const first = templateByClass[availableClasses[0]] || 'Standard Academic Template'
    const allSame = availableClasses.every(c => (templateByClass[c] || 'Standard Academic Template') === first)
    return allSame ? first : 'Standard Academic Template'
  })()
=======
import { useQuery, useMutation } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import { examApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Printer, RefreshCw, Pencil } from 'lucide-react'

const GRADING_SCALE = [
  { grade: 'A+', range: '90 – 100', color: '#C9A020' },
  { grade: 'A',  range: '80 – 89', color: '#10B981' },
  { grade: 'B',  range: '70 – 79', color: '#3B82F6' },
  { grade: 'C',  range: '60 – 69', color: '#8B5CF6' },
  { grade: 'D',  range: '50 – 59', color: '#F59E0B' },
  { grade: 'F',  range: '0 – 49', color: '#EF4444' },
]

const MOCK_STUDENTS = [
  { id: '101', name: '[Student Name 1]', math: 85, science: 92, english: 78 },
  { id: '102', name: '[Student Name 2]', math: 45, science: 50, english: 38 },
  { id: '103', name: '[Student Name 3]', math: null, science: null, english: null },
]

function calcGrade(score: number | null): { grade: string; color: string } {
  if (score === null) return { grade: '-', color: '#6B6660' }
  if (score >= 90) return { grade: 'A+', color: '#C9A020' }
  if (score >= 80) return { grade: 'A', color: '#10B981' }
  if (score >= 70) return { grade: 'B', color: '#3B82F6' }
  if (score >= 60) return { grade: 'C', color: '#8B5CF6' }
  if (score >= 50) return { grade: 'D', color: '#F59E0B' }
  return { grade: 'F', color: '#EF4444' }
}

export default function ResultsPage() {
  const [examType, setExamType] = useState('Mid Terms')
  const [cls, setCls] = useState('Grade 10')
  const [section, setSection] = useState('Section A')
  const [term, setTerm] = useState('2025 - Spring Term')
  const [marks, setMarks] = useState<Record<string, Record<string, string>>>({})
  const [quickScore, setQuickScore] = useState('')
  const [published, setPublished] = useState(false)

  const setMark = (sid: string, subj: string, val: string) =>
    setMarks(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), [subj]: val } }))

  const getMark = (sid: string, subj: string, fallback: number | null): string => {
    const v = marks[sid]?.[subj]
    if (v !== undefined) return v
    return fallback !== null ? String(fallback) : ''
  }

  const saveMutation = useMutation({
    mutationFn: () => examApi.saveMarks({ exam_type: examType, class_id: cls, section_id: section, marks }),
    onSuccess: () => toast.success('All marks saved!'),
    onError: () => toast.error('Failed to save marks.'),
  })

  const quickGrade = quickScore ? calcGrade(Number(quickScore)) : null
>>>>>>> origin/main

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Exam', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Examination & Result Processing</h1>
      </div>

      <div className="px-6 pb-8">
<<<<<<< HEAD
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Class Selector for Configuration */}
          <div className="card">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#6B6660' }}>Select Class to Configure</label>
            <select value={cls} onChange={e => setCls(e.target.value)} className="select max-w-xs">
              <option value="All Grades">All Grades</option>
              {availableClasses.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Continuous Assessment Set-up */}
            <div className="space-y-4">
              <div className="card p-0 overflow-hidden">
                <div className="px-5 py-4 bg-gold-600 text-white flex justify-between items-center">
                  <h3 className="font-bold">Continuous Assessment Set-up for {cls}</h3>
                </div>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-12">#</th>
                        <th>Assessment</th>
                        <th>Max Obtainable Score</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((a, i) => (
                        <tr key={a.id}>
                          <td className="text-xs text-gray-500">{i + 1}</td>
                          <td className="font-semibold">{a.name}</td>
                          <td className="text-center">{a.maxScore}</td>
                          <td className="text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => openEditAssessment(a)} className="p-1.5 rounded hover:bg-gray-100 text-blue-600"><Pencil size={14} /></button>
                              <button onClick={() => deleteAssessment(a.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* New Assessment Record Form */}
              <div className="card">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">New Assessment Record</h3>
                <div className="space-y-3">
                  <input 
                    placeholder="New Assessment Name (e.g. FIRST C.A)" 
                    value={newAssessment.name}
                    onChange={e => setNewAssessment({...newAssessment, name: e.target.value})}
                    className="input" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max Obtainable Score" 
                    value={newAssessment.maxScore}
                    onChange={e => setNewAssessment({...newAssessment, maxScore: e.target.value})}
                    className="input" 
                  />
                  <button onClick={addAssessment} className="btn-gold w-full flex items-center justify-center gap-2">
                    <Plus size={14} /> Add Assessment
                  </button>
                </div>
              </div>
            </div>

            {/* Grade Set-up */}
            <div className="space-y-4">
              <div className="card p-0 overflow-hidden">
                <div className="px-5 py-4 bg-gold-600 text-white flex justify-between items-center">
                  <h3 className="font-bold">Grade Set-up for {cls}</h3>
                </div>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-12">#</th>
                        <th>Lower</th>
                        <th>Upper</th>
                        <th>Grade</th>
                        <th>Remark</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradingScale.map((g, i) => (
                        <tr key={g.id}>
                          <td className="text-xs text-gray-500">{i + 1}</td>
                          <td>{g.lower}</td>
                          <td>{g.upper}</td>
                          <td className="font-bold">{g.grade}</td>
                          <td className="text-xs text-gray-500">{g.remark}</td>
                          <td className="text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => openEditGrade(g)} className="p-1.5 rounded hover:bg-gray-100 text-blue-600"><Pencil size={14} /></button>
                              <button onClick={() => deleteGrade(g.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* New Grade Record Form */}
              <div className="card">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">New Grade Record</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input 
                    type="number" placeholder="Lower Limit" 
                    value={newGrade.lower}
                    onChange={e => setNewGrade({...newGrade, lower: e.target.value})}
                    className="input" 
                  />
                  <input 
                    type="number" placeholder="Upper Limit" 
                    value={newGrade.upper}
                    onChange={e => setNewGrade({...newGrade, upper: e.target.value})}
                    className="input" 
                  />
                  <input 
                    placeholder="Grade (e.g. A1)" 
                    value={newGrade.grade}
                    onChange={e => setNewGrade({...newGrade, grade: e.target.value})}
                    className="input" 
                  />
                  <input 
                    placeholder="Remark (e.g. GOOD)" 
                    value={newGrade.remark}
                    onChange={e => setNewGrade({...newGrade, remark: e.target.value})}
                    className="input" 
                  />
                </div>
                <button onClick={addGrade} className="btn-gold w-full flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Rule
=======
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Area */}
          <div className="xl:col-span-3 space-y-4">
            {/* Filter & Select */}
            <div className="card animate-in stagger-1">
              <h2 className="font-bold mb-4">Filter & Select</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Exam Type</label>
                  <select value={examType} onChange={e => setExamType(e.target.value)} className="select">
                    <option>Mid Terms</option><option>Final Exams</option><option>Unit Test</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Class</label>
                  <select value={cls} onChange={e => setCls(e.target.value)} className="select">
                    <option>Grade 10</option><option>Grade 11</option><option>Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B6660' }}>Section</label>
                  <select value={section} onChange={e => setSection(e.target.value)} className="select">
                    <option>Section A</option><option>Section B</option>
                  </select>
                </div>
              </div>
              <button className="btn-outline flex items-center gap-2">
                <RefreshCw size={14} /> Load Students
              </button>
            </div>

            {/* Marks Entry */}
            <div className="card animate-in stagger-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Marks Entry</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#6B6660' }}>Progress</span>
                  <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: '#E4E1D8' }}>
                    <div className="h-full rounded-full" style={{ width: '45%', background: '#C9A020' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#C9A020' }}>45%</span>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <button className="btn-outline text-xs px-3 py-1.5">Fill Default Marks</button>
                <button className="btn-dark text-xs px-3 py-1.5">Apply Grading</button>
              </div>

              <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#E4E1D8' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Roll</th>
                      <th>Student Name</th>
                      <th>Math</th>
                      <th>Science</th>
                      <th>English</th>
                      <th>Total</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_STUDENTS.map(st => {
                      const m = Number(getMark(st.id, 'math', st.math)) || 0
                      const s = Number(getMark(st.id, 'science', st.science)) || 0
                      const e = Number(getMark(st.id, 'english', st.english)) || 0
                      const isPending = st.math === null
                      const total = isPending ? 0 : m + s + e
                      const avg = isPending ? null : Math.round(total / 3)
                      const { grade, color } = calcGrade(avg)
                      const pass = avg !== null && avg >= 50

                      return (
                        <tr key={st.id}>
                          <td className="font-mono text-sm" style={{ color: '#6B6660' }}>{st.id}</td>
                          <td className="font-medium">{st.name}</td>
                          {(['math', 'science', 'english'] as const).map(subj => {
                            const val = getMark(st.id, subj, st[subj])
                            const numVal = Number(val)
                            const isLow = !isPending && val && numVal < 50
                            return (
                              <td key={subj}>
                                <input
                                  type="number" min="0" max="100"
                                  value={val}
                                  onChange={e => setMark(st.id, subj, e.target.value)}
                                  placeholder="--"
                                  className="w-16 px-2 py-1.5 rounded-lg text-sm text-center border outline-none transition-all"
                                  style={{
                                    borderColor: isLow ? '#EF4444' : '#E4E1D8',
                                    background: isLow ? '#FEF2F2' : 'white',
                                    fontFamily: 'inherit',
                                  }}
                                />
                              </td>
                            )
                          })}
                          <td className="font-bold">{isPending ? 0 : total}</td>
                          <td className="font-bold" style={{ color }}>{grade}</td>
                          <td>
                            {isPending ? (
                              <span className="badge badge-gray">Pending</span>
                            ) : pass ? (
                              <span className="badge badge-green">Pass</span>
                            ) : (
                              <span className="badge badge-red">Fail</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
                        className="btn-gold flex items-center gap-2">
                  💾 {saveMutation.isPending ? 'Saving…' : 'Save All Marks'}
>>>>>>> origin/main
                </button>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Template Selection */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="card">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">SELECT RESULT TEMPLATE</label>
              <select
                className="select"
                value={templateValue}
                onChange={e => {
                  const nextTemplate = e.target.value
                  if (cls === 'All Grades') {
                    const nextMap: Record<string, string> = {}
                    availableClasses.forEach(c => nextMap[c] = nextTemplate)
                    setTemplateByClass(nextMap)
                    toast.success('Template updated for all grades')
                  } else {
                    setTemplateByClass(prev => ({ ...prev, [cls]: nextTemplate }))
                    toast.success(`Template updated for ${cls}`)
                  }
                }}
              >
                {availableTemplates.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={`card flex items-center justify-between gap-3 transition-colors ${isTemplateDisabled(cls) ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isTemplateDisabled(cls) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  <Settings size={16} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isTemplateDisabled(cls) ? 'text-red-800' : 'text-green-800'}`}>
                    {isTemplateDisabled(cls) ? 'Class Template Disabled' : 'Class Template Enabled'}
                  </p>
                  <p className="text-xs opacity-70">
                    Current status for {cls}
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleTemplate}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner`}
                style={{ background: isTemplateDisabled(cls) ? '#EF4444' : '#10B981' }}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300`}
                      style={{ left: isTemplateDisabled(cls) ? '4px' : '28px' }} />
              </button>
            </div>
          </div>

          {showEditAssessment && editAssessment && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Assessment</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Update assessment name and score</p>
                  </div>
                  <button onClick={() => { setShowEditAssessment(false); setEditAssessment(null) }} className="p-2 hover:bg-gray-200 rounded-full">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <form onSubmit={saveEditAssessment} className="p-8 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Assessment Name</label>
                    <input
                      className="input w-full"
                      value={editAssessment.name}
                      onChange={e => setEditAssessment({ ...editAssessment, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Max Obtainable Score</label>
                    <input
                      type="number"
                      className="input w-full"
                      value={editAssessment.maxScore}
                      onChange={e => setEditAssessment({ ...editAssessment, maxScore: e.target.value })}
                      required
                    />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => { setShowEditAssessment(false); setEditAssessment(null) }} className="btn-outline px-8 py-2.5">Cancel</button>
                    <button type="submit" className="btn-gold px-8 py-2.5">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEditGrade && editGrade && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Grade Rule</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Update range, grade and remark</p>
                  </div>
                  <button onClick={() => { setShowEditGrade(false); setEditGrade(null) }} className="p-2 hover:bg-gray-200 rounded-full">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <form onSubmit={saveEditGrade} className="p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Lower</label>
                      <input
                        type="number"
                        className="input w-full"
                        value={editGrade.lower}
                        onChange={e => setEditGrade({ ...editGrade, lower: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Upper</label>
                      <input
                        type="number"
                        className="input w-full"
                        value={editGrade.upper}
                        onChange={e => setEditGrade({ ...editGrade, upper: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Grade</label>
                      <input
                        className="input w-full"
                        value={editGrade.grade}
                        onChange={e => setEditGrade({ ...editGrade, grade: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Remark</label>
                      <input
                        className="input w-full"
                        value={editGrade.remark}
                        onChange={e => setEditGrade({ ...editGrade, remark: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => { setShowEditGrade(false); setEditGrade(null) }} className="btn-outline px-8 py-2.5">Cancel</button>
                    <button type="submit" className="btn-gold px-8 py-2.5">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
=======
          {/* Right Panel */}
          <div className="space-y-4">
            {/* Final Actions */}
            <div className="card animate-in stagger-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6660' }}>Final Actions</h3>
              <div className="flex items-center justify-between p-3 rounded-xl mb-3"
                   style={{ background: '#F7F6F3', border: '1px solid #E4E1D8' }}>
                <div>
                  <p className="font-semibold text-sm">Publish Results</p>
                  <p className="text-xs" style={{ color: '#6B6660' }}>Visible to students</p>
                </div>
                <button onClick={() => setPublished(!published)}
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{ background: published ? '#C9A020' : '#E4E1D8' }}>
                  <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                        style={{ left: published ? '28px' : '4px' }} />
                </button>
              </div>
              <button className="w-full btn-outline flex items-center justify-center gap-2 text-sm"
                      style={{ color: '#C9A020', borderColor: '#C9A020' }}>
                <Printer size={14} /> Generate Report Card
              </button>
            </div>

            {/* Grading Scale */}
            <div className="card animate-in stagger-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B6660' }}>Grading Scale</h3>
                <button className="p-1 rounded hover:bg-gray-100"><Pencil size={12} style={{ color: '#6B6660' }} /></button>
              </div>
              <div className="space-y-2">
                {GRADING_SCALE.map(({ grade, range, color }) => (
                  <div key={grade} className="flex justify-between items-center py-1.5 border-b last:border-0 text-sm"
                       style={{ borderColor: '#E4E1D8' }}>
                    <span className="font-bold w-8" style={{ color }}>{grade}</span>
                    <span style={{ color: '#6B6660' }}>{range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Grade Calc */}
            <div className="rounded-xl p-4 animate-in stagger-3" style={{ background: '#0D0D0D' }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 text-white/60">Quick Grade Calc</h3>
              <div className="flex gap-2 items-center mb-3">
                <input type="number" placeholder="Score" value={quickScore}
                       onChange={e => setQuickScore(e.target.value)}
                       className="flex-1 px-3 py-2 rounded-lg text-sm text-center text-white outline-none"
                       style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'inherit' }} />
                <span className="text-white/40 text-sm">/</span>
                <div className="w-14 px-3 py-2 rounded-lg text-sm text-center text-white"
                     style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>100</div>
              </div>
              {quickGrade && (
                <div className="text-sm text-white/60">
                  Calculated: <span className="text-xl font-bold ml-2" style={{ color: quickGrade.color }}>
                    {quickGrade.grade}
                  </span>
                  <span className="ml-1 text-white/40">({quickScore}%)</span>
                </div>
              )}
            </div>
          </div>
>>>>>>> origin/main
        </div>
      </div>
    </AppLayout>
  )
}
