'use client'
import React, { useState } from 'react'
import { matRecycle } from '@/mock/matRecycle'
import { Select } from 'antd'
import 'antd/dist/reset.css'

// Mock master data for mapping
const mcsParts = [
    { code: 'MCS-001', name: 'Copper Wire' },
    { code: 'MCS-002', name: 'Steel Plate' },
    { code: 'MCS-003', name: 'Aluminum Rod' },
    { code: 'MCS-004', name: 'Brass Fitting' },
    { code: 'MCS-005', name: 'Iron Casting' },
    { code: 'MCS-006', name: 'Zinc Alloy' },
    { code: 'MCS-007', name: 'Titanium Sheet' },
    { code: 'MCS-008', name: 'Nickel Coil' },
    { code: 'MCS-009', name: 'Lead Block' },
    { code: 'MCS-010', name: 'Tin Foil' },
]
const recycleParts = [
    { code: 'RC-01', name: 'ScrapCu' },
    { code: 'RC-02', name: 'ScrapSt' },
    { code: 'RC-03', name: 'ScrapAl' },
    { code: 'RC-04', name: 'ScrapBr' },
    { code: 'RC-05', name: 'ScrapFe' },
    { code: 'RC-06', name: 'ScrapZn' },
    { code: 'RC-07', name: 'ScrapTi' },
    { code: 'RC-08', name: 'ScrapNi' },
    { code: 'RC-09', name: 'ScrapPb' },
    { code: 'RC-10', name: 'ScrapSn' },
]
const initialMappings = [
    { mcsCode: 'MCS-001', recycleCode: 'RC-01' },
    { mcsCode: 'MCS-002', recycleCode: 'RC-02' },
    { mcsCode: 'MCS-003', recycleCode: 'RC-03' },
    { mcsCode: 'MCS-004', recycleCode: 'RC-04' },
    { mcsCode: 'MCS-005', recycleCode: 'RC-05' },
    { mcsCode: 'MCS-006', recycleCode: 'RC-06' },
    { mcsCode: 'MCS-007', recycleCode: 'RC-07' },
    { mcsCode: 'MCS-008', recycleCode: 'RC-08' },
    { mcsCode: 'MCS-009', recycleCode: 'RC-09' },
    { mcsCode: 'MCS-010', recycleCode: 'RC-10' },
]

const mcsOptions = mcsParts.map(m => ({ value: m.code, label: m.code }))
const recycleOptions = recycleParts.map(r => ({ value: r.code, label: r.code }))

const MatRecyclePage: React.FC = () => {
    // --- Mapping State ---
    const [mappings, setMappings] = useState(initialMappings)
    const [editMode, setEditMode] = useState(false)
    const [newMapping, setNewMapping] = useState({ mcsCode: '', recycleCode: '' })
    const [draftMappings, setDraftMappings] = useState(mappings)

    // --- Stock State ---
    const [materials, setMaterials] = useState(matRecycle.initialMaterials)
    const [selectedMaterial, setSelectedMaterial] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('')
    const [remark, setRemark] = useState<string>('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [pendingUpdate, setPendingUpdate] = useState<{ code: string, qty: number, current: number, newStock: number } | null>(null)

    // --- Filter State ---
    const [searchTerm, setSearchTerm] = useState<string>('')

    // --- Mapping helpers ---
    const getMcsName = (code: string) => mcsParts.find(m => m.code === code)?.name || ''

    // --- Filtered data calculations ---
    const filteredMaterials = materials.filter(mat => {
        const search = searchTerm.trim().toLowerCase()
        if (!search) return true
        return (
            mat.name['EN'].toLowerCase().includes(search) ||
            mat.code.toLowerCase().includes(search) ||
            mat.stock.toString().includes(search)
        )
    })

    // --- Mapping handlers ---
    const handleEdit = () => { setDraftMappings(mappings); setEditMode(true) }
    const handleCancel = () => { setEditMode(false); setNewMapping({ mcsCode: '', recycleCode: '' }) }
    const handleSave = () => { setMappings(draftMappings); setEditMode(false); setNewMapping({ mcsCode: '', recycleCode: '' }) }
    const handleDraftChange = (idx: number, field: 'mcsCode' | 'recycleCode', value: string) => {
        setDraftMappings(draftMappings => draftMappings.map((row, i) => i === idx ? { ...row, [field]: value } : row))
    }
    const handleAddMapping = () => {
        if (!newMapping.mcsCode || !newMapping.recycleCode) return
        setDraftMappings([...draftMappings, newMapping])
        setNewMapping({ mcsCode: '', recycleCode: '' })
    }
    const handleDelete = (idx: number) => {
        setDraftMappings(draftMappings => draftMappings.filter((_, i) => i !== idx))
    }

    // --- Stock handlers ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const mat = materials.find(m => m.code === selectedMaterial)
        if (!mat) return
        const qty = Number(quantity)
        const current = mat.stock
        const newStock = current + qty
        setPendingUpdate({ code: mat.code, qty, current, newStock })
        setShowConfirm(true)
    }
    const handleConfirm = () => {
        if (!pendingUpdate) return
        setMaterials(mats => mats.map(m => m.code === pendingUpdate.code ? { ...m, stock: pendingUpdate.newStock } : m))
        setShowConfirm(false)
        setPendingUpdate(null)
        setQuantity('')
        setRemark('')
    }



    const matObj = pendingUpdate ? materials.find(m => m.code === pendingUpdate.code) : null
    const matName = matObj ? matObj.name['EN'] : ''

    return (
        <div className="min-h-screen relative flex flex-col items-center py-10 overflow-x-hidden">
            {/* Immersive 3D Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-indigo-300/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-purple-200/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-cyan-200/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl font-bold mb-8 text-slate-800 drop-shadow-sm text-center">
                Material Recycle Management System
            </h1>

            {/* Unified Layout Container */}
            <div className="w-full max-w-7xl px-6 space-y-8">

                {/* Left Section - Mapping Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Mapping Management Card */}
                    <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Part Mapping Management
                            </h2>
                            {!editMode && (
                                <button
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                    onClick={handleEdit}
                                >
                                    Edit Mappings
                                </button>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-100/80 to-slate-200/60 border-b-2 border-slate-300">
                                        <th className="p-4 font-bold text-slate-700 text-left">MCS Part Code</th>
                                        <th className="p-4 font-bold text-slate-700 text-left">MCS Part Name</th>
                                        <th className="p-4 font-bold text-slate-700 text-left">Recycle Part Code</th>
                                        {editMode && <th className="p-4 font-bold text-slate-700 text-center">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(editMode ? draftMappings : mappings).map((row, idx) => (
                                        <tr key={idx} className={`hover:bg-slate-50/60 transition-all duration-200 border-b border-slate-200/50 ${idx % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/20'}`}>
                                            <td className="p-4">
                                                {editMode ? (
                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select MCS part..."
                                                        style={{ minWidth: 140 }}
                                                        value={row.mcsCode || undefined}
                                                        onChange={val => handleDraftChange(idx, 'mcsCode', val || '')}
                                                        options={mcsOptions}
                                                        optionFilterProp="label"
                                                    />
                                                ) : (
                                                    <span className="font-mono text-sm text-slate-600">{row.mcsCode}</span>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium text-slate-700">{getMcsName(row.mcsCode)}</td>
                                            <td className="p-4">
                                                {editMode ? (
                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select recycle part..."
                                                        style={{ minWidth: 140 }}
                                                        value={row.recycleCode || undefined}
                                                        onChange={val => handleDraftChange(idx, 'recycleCode', val || '')}
                                                        options={recycleOptions}
                                                        optionFilterProp="label"
                                                    />
                                                ) : (
                                                    <span className="font-mono text-sm text-slate-600">{row.recycleCode}</span>
                                                )}
                                            </td>
                                            {editMode && (
                                                <td className="p-4 text-center">
                                                    <button
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100/50 rounded-lg transition-all duration-200"
                                                        onClick={() => handleDelete(idx)}
                                                        title="Delete Mapping"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {editMode && (
                                        <tr className="bg-indigo-50/30 border-b border-slate-200/50">
                                            <td className="p-4">
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    placeholder="Select MCS part..."
                                                    style={{ minWidth: 140 }}
                                                    value={newMapping.mcsCode || undefined}
                                                    onChange={val => setNewMapping(nm => ({ ...nm, mcsCode: val || '' }))}
                                                    options={mcsOptions}
                                                    optionFilterProp="label"
                                                />
                                            </td>
                                            <td className="p-4 font-medium text-slate-700">{getMcsName(newMapping.mcsCode)}</td>
                                            <td className="p-4">
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    placeholder="Select recycle part..."
                                                    style={{ minWidth: 140 }}
                                                    value={newMapping.recycleCode || undefined}
                                                    onChange={val => setNewMapping(nm => ({ ...nm, recycleCode: val || '' }))}
                                                    options={recycleOptions}
                                                    optionFilterProp="label"
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100/50 rounded-lg transition-all duration-200"
                                                    onClick={handleAddMapping}
                                                    title="Add New Mapping"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {editMode && (
                            <div className="flex gap-3 mt-6 justify-end">
                                <button className="px-5 py-2 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl shadow-md transition-all" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-md transition-all" onClick={handleSave}>
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Stock Management */}
                    <div className="space-y-6">

                        {/* Add Stock Form */}
                        <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add to Stock
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-700 font-semibold">Material</label>
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder="Select material..."
                                        style={{ minWidth: '100%' }}
                                        value={selectedMaterial || undefined}
                                        onChange={val => setSelectedMaterial(val || '')}
                                        options={materials.map(m => ({ value: m.code, label: m.name['EN'] }))}
                                        optionFilterProp="label"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-700 font-semibold">Quantity (kg)</label>
                                    <input
                                        type="number"
                                        className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-300 focus:outline-none text-slate-700 bg-white/70 shadow-sm"
                                        placeholder="e.g., 500"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        min={0}
                                        step={1}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-700 font-semibold">Remark (Optional)</label>
                                    <textarea
                                        className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-300 focus:outline-none text-slate-700 bg-white/70 shadow-sm"
                                        placeholder="Add any relevant notes here..."
                                        value={remark}
                                        onChange={e => setRemark(e.target.value)}
                                        rows={2}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                    disabled={!selectedMaterial || !quantity || Number(quantity) <= 0}
                                >
                                    Add to Stock
                                </button>
                            </form>
                        </div>

                        {/* Current Stock Levels */}
                        <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                    </svg>
                                    Current Stock Levels
                                </h2>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search materials..."
                                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-300 focus:outline-none text-slate-700 bg-white/70 shadow-sm w-48"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-2.5 text-slate-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                            </div>



                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-100/80 to-slate-200/60 border-b-2 border-slate-300">
                                            <th className="p-4 font-bold text-slate-700 text-left">Material Code</th>
                                            <th className="p-4 font-bold text-slate-700 text-left">Material Name</th>
                                            <th className="p-4 font-bold text-slate-700 text-right">Current Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMaterials.map((mat, idx) => (
                                            <tr key={mat.code} className={`hover:bg-slate-50/60 transition-all duration-200 border-b border-slate-200/50 ${idx % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/20'}`}>
                                                <td className="p-4 font-mono text-sm text-slate-600">{mat.code}</td>
                                                <td className="p-4 font-medium text-slate-700">{mat.name['EN']}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="font-bold text-slate-800">{mat.stock.toLocaleString()}</span>
                                                        <span className="text-sm text-slate-500">kg</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredMaterials.length === 0 && (
                                <div className="text-center py-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-slate-400 mb-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                    </svg>
                                    <p className="text-slate-500 font-medium">No materials found matching your criteria</p>
                                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter settings</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <dialog open className="modal modal-open">
                    <form method="dialog" className="modal-box max-w-md backdrop-blur-2xl bg-white/90 border border-slate-200/50 rounded-2xl shadow-2xl">
                        <h3 className="font-bold text-xl mb-4 text-slate-800">Confirm Stock Update</h3>
                        <p className="text-sm text-slate-600 mb-6">You are about to add <span className="font-bold text-emerald-600">{pendingUpdate?.qty} kg</span> to <span className="font-bold text-blue-600">{matName}</span>.</p>
                        <div className="mt-3 mb-6">
                            <div className="font-semibold text-slate-700 mb-2">Current Stock: <span className="text-blue-700">{pendingUpdate?.current} kg</span></div>
                            <div className="font-semibold text-slate-700">New Stock will be: <span className="text-emerald-700">{pendingUpdate?.newStock} kg</span></div>
                        </div>
                        <div className="modal-action flex gap-3">
                            <button
                                type="button"
                                className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                    <form method="dialog" className="modal-backdrop backdrop-blur">
                        <button aria-label="close" onClick={() => setShowConfirm(false)}></button>
                    </form>
                </dialog>
            )}
        </div>
    )
}

export default MatRecyclePage 