'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import Topbar from '@/components/layout/Topbar'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, Download, Settings } from 'lucide-react'

const INITIAL_GRADING_SCALE = [
  { id: '1', grade: 'A1', lower: 75, upper: 100, remark: 'EXCELLENT', color: '#C9A020' },
  { id: '2', grade: 'B2', lower: 70, upper: 74, remark: 'VERY GOOD', color: '#10B981' },
  { id: '3', grade: 'B3', lower: 65, upper: 69, remark: 'GOOD', color: '#3B82F6' },
  { id: '4', grade: 'C4', lower: 60, upper: 64, remark: 'CREDIT', color: '#8B5CF6' },
  { id: '5', grade: 'C5', lower: 55, upper: 59, remark: 'CREDIT', color: '#F59E0B' },
  { id: '6', grade: 'C6', lower: 50, upper: 54, remark: 'CREDIT', color: '#EF4444' },
  { id: '7', grade: 'F9', lower: 0, upper: 49, remark: 'FAIL', color: '#EF4444' },
]

const INITIAL_ASSESSMENTS = [
  { id: '1', name: 'FIRST C. A', maxScore: 10 },
  { id: '2', name: 'SECOND C. A', maxScore: 10 },
  { id: '3', name: 'THIRD C. A', maxScore: 10 },
  { id: '4', name: 'EXAM', maxScore: 70 },
]

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

  const availableClasses = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'JSS 1', 'JSS 2', 'JSS 3']

  const isTemplateDisabled = (targetCls: string) => {
    if (targetCls === 'All Grades') {
      return Object.values(disabledTemplates).every(v => v)
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

  const { data = { top_performers: [] } } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => ({ data: { top_performers: [] } }),
  })

  return (
    <AppLayout>
      <Topbar action={{ label: 'New Exam', onClick: () => {} }} />

      <div className="page-header animate-in">
        <div className="gold-accent" />
        <h1 className="page-title">Examination & Result Processing</h1>
      </div>

      <div className="px-6 pb-8">
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
                              <button className="p-1.5 rounded hover:bg-gray-100 text-blue-600"><Pencil size={14} /></button>
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
                              <button className="p-1.5 rounded hover:bg-gray-100 text-blue-600"><Pencil size={14} /></button>
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
                </button>
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="card">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">SELECT RESULT TEMPLATE</label>
              <select className="select">
                <option>Standard Academic Template</option>
                <option>Continuous Assessment focused Template</option>
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
        </div>
      </div>
    </AppLayout>
  )
}
