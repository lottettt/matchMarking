'use client'
import React, { useState, useMemo } from 'react'
import { matReady as matReadyRaw } from '@/mock/matReady'
import { formatNumberWithCommas } from '@/lib/number-utils'
import { DatePicker, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

interface MatReadyData {
    [key: string]: Array<{
        lot: string
        model: string
        part: string
        need: number
        stock: number
        recycle: number
        series: string // Added series field
    }>
}

// Series and model data (reuse from ProPlan)
const seriesData = {
    HARNESS: {
        models: ['MSA1AA002', 'MSA1AA002A+MJP1', 'MSA1AA002A+MTH1']
    },
    CONNECTOR: {
        models: ['MSA1RAJ003+MJP1', 'MSA1RAM003+MJP1', 'MSA1RBA002+MJP1']
    },
    BIKE: {
        models: ['MSA1RBA002+MJP2', 'MSA1RBA002+MTH2', 'MSA1TAC002+P']
    }
}

type TableRow = {
    key: string
    date: string
    lot: string
    model: string
    part: string
    need: number
    needScm: number
    stock: number
    recycle: number
    mcsStock: number
    mcsStockExpired: number
    nearlyExpired: number
    result: 'G' | 'NG'
    overallResult?: 'G' | 'NG'
    rowSpan?: number
    series: string // Added series field
    inputQty?: number
}

// Flatten all lots from all dates, each with a date property
const getAllRows = (matReady: MatReadyData): TableRow[] => {
    const allRows: TableRow[] = []
    Object.entries(matReady).forEach(([date, lots]) => {
        // Group by lot within each date
        const grouped: Record<string, { model: string; materials: TableRow[]; overallResult: 'G' | 'NG' }> = {}
        lots.forEach(item => {
            if (!grouped[item.lot]) {
                grouped[item.lot] = { model: item.model, materials: [], overallResult: 'G' }
            }
            const needScm = Math.round(item.need * 1.1)
            const mcsStock = Math.round(item.stock * 0.7)
            const mcsStockExpired = Math.round(item.stock * 0.1)
            const nearlyExpired = Math.round(item.stock * 0.05)
            const result = (item.stock + item.recycle) >= item.need ? 'G' : 'NG'
            grouped[item.lot].materials.push({
                ...item,
                date,
                key: `${date}-${item.lot}-${item.part}`,
                needScm,
                mcsStock,
                mcsStockExpired,
                nearlyExpired,
                result,
            })
            if (result === 'NG') grouped[item.lot].overallResult = 'NG'
        })
        Object.values(grouped).forEach(group => {
            // Calculate inputQty as the sum of 'need' for all parts in the lot
            const inputQty = group.materials.reduce((sum, mat) => sum + mat.need, 0)
            group.materials.forEach((mat, idx) => {
                allRows.push({
                    ...mat,
                    overallResult: group.overallResult,
                    rowSpan: idx === 0 ? group.materials.length : 0,
                    inputQty: idx === 0 ? inputQty : undefined // Only first row gets the value
                })
            })
        })
    })
    return allRows
}

const MatReadyPage: React.FC = () => {
    const [checkedLots, setCheckedLots] = useState<Set<string>>(new Set())
    const [modalOpen, setModalOpen] = useState(false)
    const [lotsToApprove, setLotsToApprove] = useState<string[]>([])
    const [showCurrentStockDetails, setShowCurrentStockDetails] = useState(false)
    const [seriesFilter, setSeriesFilter] = useState<string>('All')
    const [modelFilter, setModelFilter] = useState<string>('All')
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
    const [approvedLots, setApprovedLots] = useState<Set<string>>(new Set())
    const [currentMatReady, setCurrentMatReady] = useState<MatReadyData>(JSON.parse(JSON.stringify(matReadyRaw)))
    const [summaryModal, setSummaryModal] = useState<{ type: 'all' | 'filtered' | 'ngAll' | 'ngFiltered', open: boolean }>({ type: 'all', open: false })

    // All rows from all dates
    const allRows = useMemo(() => getAllRows(currentMatReady), [currentMatReady])

    // Filter by series and model
    const filteredRows = useMemo(() => {
        let rows = allRows
        if (seriesFilter !== 'All') {
            rows = rows.filter(row => row.series === seriesFilter)
        }
        if (modelFilter !== 'All') {
            rows = rows.filter(row => row.model === modelFilter)
        }
        if (dateRange && dateRange[0] && dateRange[1]) {
            const start = dateRange[0].startOf('day')
            const end = dateRange[1].endOf('day')
            rows = rows.filter(row => {
                const rowDate = dayjs(row.date)
                return rowDate.isSameOrAfter(start) && rowDate.isSameOrBefore(end)
            })
        }
        // Remove approved lots
        rows = rows.filter(row => !approvedLots.has(`${row.date}-${row.lot}`))
        // Sort by date, then lot, then part for deterministic simulation
        rows = [...rows].sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date)
            if (a.lot !== b.lot) return a.lot.localeCompare(b.lot)
            return a.part.localeCompare(b.part)
        })

        // Initialize available stock for each material part
        const availableRecycle: Record<string, number> = {}
        const availableMcsStock: Record<string, number> = {}
        rows.forEach(row => {
            if (!(row.part in availableRecycle)) availableRecycle[row.part] = row.recycle
            if (!(row.part in availableMcsStock)) availableMcsStock[row.part] = row.mcsStock
        })

        // Group rows by lot
        const grouped: Record<string, TableRow[]> = {}
        rows.forEach(row => {
            const lotKey = `${row.date}-${row.lot}`
            if (!grouped[lotKey]) grouped[lotKey] = []
            grouped[lotKey].push(row)
        })

        const resultRows: TableRow[] = []
        Object.entries(grouped).forEach(([lotKey, lotRows]) => {
            let lotOverallResult: 'G' | 'NG' = 'G'
            const simulatedRows: TableRow[] = lotRows.map(row => {
                const needScm = row.needScm
                const currentRecycle = availableRecycle[row.part]
                const currentMcsStock = availableMcsStock[row.part]
                const totalStock = currentRecycle + currentMcsStock

                // Calculate how much will be used
                let usedRecycle = 0
                let usedMcsStock = 0
                let result: 'G' | 'NG' = 'NG'

                if (totalStock >= needScm) {
                    result = 'G'
                    // Use recycle first, then MCS stock
                    usedRecycle = Math.min(currentRecycle, needScm)
                    usedMcsStock = Math.max(0, needScm - usedRecycle)
                } else {
                    // Not enough stock, use what's available
                    usedRecycle = Math.min(currentRecycle, needScm)
                    usedMcsStock = Math.max(0, Math.min(currentMcsStock, needScm - usedRecycle))
                }

                if (result === 'NG') lotOverallResult = 'NG'

                // If this lot is reserved, deduct from available stock for subsequent lots and show remaining
                if (checkedLots.has(lotKey)) {
                    // Deduct from available stock for subsequent lots
                    availableRecycle[row.part] -= usedRecycle
                    availableMcsStock[row.part] -= usedMcsStock
                    // Show remaining stock after deduction
                    return {
                        ...row,
                        recycle: availableRecycle[row.part],
                        mcsStock: availableMcsStock[row.part],
                        stock: availableRecycle[row.part] + availableMcsStock[row.part],
                        result,
                    }
                } else {
                    // Show current available stock (not consumed yet)
                    return {
                        ...row,
                        recycle: currentRecycle,
                        mcsStock: currentMcsStock,
                        stock: totalStock,
                        result,
                    }
                }
            })

            simulatedRows.forEach((row, idx) => {
                resultRows.push({
                    ...row,
                    overallResult: lotOverallResult,
                    rowSpan: idx === 0 ? lotRows.length : 0,
                })
            })
        })
        return resultRows
    }, [allRows, seriesFilter, modelFilter, dateRange, checkedLots, approvedLots])

    // Calculate total lot count (all data, not filtered)
    const totalLotCountAll = useMemo(() => {
        const lotSet = new Set<string>()
        allRows.forEach(row => {
            lotSet.add(`${row.date}-${row.lot}`)
        })
        return lotSet.size
    }, [allRows])

    // Calculate total lot count (filtered data)
    const totalLotCountFiltered = useMemo(() => {
        const lotSet = new Set<string>()
        filteredRows.forEach(row => {
            lotSet.add(`${row.date}-${row.lot}`)
        })
        return lotSet.size
    }, [filteredRows])

    // Calculate total NG lot count (all data, not filtered)
    const totalNgLotCountAll = useMemo(() => {
        const ngLotSet = new Set<string>()
        allRows.forEach(row => {
            if (row.overallResult === 'NG') {
                ngLotSet.add(`${row.date}-${row.lot}`)
            }
        })
        return ngLotSet.size
    }, [allRows])

    // Calculate total NG lot count (filtered data)
    const totalNgLotCountFiltered = useMemo(() => {
        const ngLotSet = new Set<string>()
        filteredRows.forEach(row => {
            if (row.overallResult === 'NG') {
                ngLotSet.add(`${row.date}-${row.lot}`)
            }
        })
        return ngLotSet.size
    }, [filteredRows])

    // Get all series for filter dropdown
    const allSeries = useMemo(() => ['All', ...Object.keys(seriesData)], [])

    // Get models for selected series
    const modelsForSeries = useMemo(() => {
        if (seriesFilter === 'All') {
            // All models from all series
            return ['All', ...Object.values(seriesData).flatMap(s => s.models)]
        }
        return ['All', ...seriesData[seriesFilter as keyof typeof seriesData].models]
    }, [seriesFilter])

    const updateReservedMaterials = (lot: string, isChecked: boolean) => {
        const newCheckedLots = new Set(checkedLots)
        if (isChecked) newCheckedLots.add(lot)
        else newCheckedLots.delete(lot)
        setCheckedLots(newCheckedLots)
    }

    const handleSelectAllG = () => {
        // Simulate sequential reservation, updating available stock as we go
        const tempChecked = new Set<string>()
        // Prepare a copy of available stock for each material part
        const availableRecycle: Record<string, number> = {}
        const availableMcsStock: Record<string, number> = {}
        // Get all unique parts
        filteredRows.forEach(row => {
            if (!(row.part in availableRecycle)) availableRecycle[row.part] = row.recycle
            if (!(row.part in availableMcsStock)) availableMcsStock[row.part] = row.mcsStock
        })
        // Group rows by lot in order
        const grouped: Record<string, TableRow[]> = {}
        filteredRows.forEach(row => {
            const lotKey = `${row.date}-${row.lot}`
            if (!grouped[lotKey]) grouped[lotKey] = []
            grouped[lotKey].push(row)
        })
        // Sort lots by date and lot number for deterministic order
        const lotKeys = Object.keys(grouped).sort()
        lotKeys.forEach(lotKey => {
            const lotRows = grouped[lotKey]
            let lotIsG = true
            // Check if all parts in this lot can be fulfilled with current available stock
            for (const row of lotRows) {
                const needScm = row.needScm
                const currentRecycle = availableRecycle[row.part]
                const currentMcsStock = availableMcsStock[row.part]
                const totalStock = currentRecycle + currentMcsStock
                if (totalStock < needScm) {
                    lotIsG = false
                    break
                }
            }
            if (lotIsG) {
                // Reserve this lot: deduct stock for each part
                for (const row of lotRows) {
                    const needScm = row.needScm
                    const usedRecycle = Math.min(availableRecycle[row.part], needScm)
                    const usedMcsStock = Math.max(0, needScm - usedRecycle)
                    availableRecycle[row.part] -= usedRecycle
                    availableMcsStock[row.part] -= usedMcsStock
                }
                tempChecked.add(lotKey)
            }
        })
        setCheckedLots(tempChecked)
    }

    const handleSubmit = () => {
        setLotsToApprove(Array.from(checkedLots).sort())
        setModalOpen(true)
    }

    const handleModalConfirm = () => {
        setModalOpen(false)
        setCurrentMatReady(prev => {
            const updated = JSON.parse(JSON.stringify(prev))
            lotsToApprove.forEach(lotKey => {
                // Find date and lot
                const [date, ...lotArr] = lotKey.split('-')
                const lot = lotArr.join('-')
                if (updated[date]) {
                    updated[date] = updated[date].map((item: {
                        lot: string
                        model: string
                        part: string
                        need: number
                        stock: number
                        recycle: number
                        series: string
                    }) => {
                        if (item.lot === lot) {
                            // Deduct the reserved quantity (needScm) from stock
                            const needScm = Math.round(item.need * 1.1)
                            return {
                                ...item,
                                stock: Math.max(0, item.stock - needScm)
                            }
                        }
                        return item
                    })
                }
            })
            return updated
        })
        setApprovedLots(prev => {
            const updated = new Set(prev)
            lotsToApprove.forEach(lot => updated.add(lot))
            return updated
        })
        setCheckedLots(new Set())
    }

    const materialSummaryByModel = useMemo(() => {
        if (lotsToApprove.length === 0) return {}
        const summary: Record<string, Record<string, { part: string, total: number }>> = {}
        filteredRows.forEach(row => {
            const lotKey = `${row.date}-${row.lot}`
            if (lotsToApprove.includes(lotKey)) {
                if (!summary[row.model]) summary[row.model] = {}
                if (!summary[row.model][row.part]) {
                    summary[row.model][row.part] = { part: row.part, total: 0 }
                }
                summary[row.model][row.part].total += row.needScm
            }
        })
        return summary
    }, [lotsToApprove, filteredRows])

    const summaryModalLots = useMemo(() => {
        let rows: TableRow[] = []
        if (summaryModal.type === 'all') {
            rows = allRows
        } else if (summaryModal.type === 'filtered') {
            rows = filteredRows
        } else if (summaryModal.type === 'ngAll') {
            rows = allRows.filter(row => row.overallResult === 'NG')
        } else if (summaryModal.type === 'ngFiltered') {
            rows = filteredRows.filter(row => row.overallResult === 'NG')
        }
        // Group by lot
        const lotMap: Record<string, { date: string, lot: string, model: string, result: string }> = {}
        rows.forEach(row => {
            const key = `${row.date}-${row.lot}`
            if (!lotMap[key]) {
                lotMap[key] = { date: row.date, lot: row.lot, model: String(row.model ?? '-'), result: String(row.overallResult ?? '-') }
            }
        })
        return Object.values(lotMap)
    }, [summaryModal, allRows, filteredRows])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden">
            {/* Minimal 3D Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-32 left-16 w-48 h-48 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-32 right-16 w-56 h-56 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 p-6">
                {/* Header with 3D Glass Effect */}
                <div className="mb-1">
                    <div className="backdrop-blur-xl bg-white/80 border border-slate-200/50 rounded-xl p-4 shadow-2xl">
                        <h1 className="text-4xl font-bold text-slate-800 mb-1 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Material Confirmation (MatReady)
                        </h1>
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <label className="text-slate-700 font-medium">Series:</label>
                                    <Select
                                        value={seriesFilter}
                                        onChange={value => {
                                            setSeriesFilter(value)
                                            setModelFilter('All') // Reset model when series changes
                                        }}
                                        style={{ width: 160 }}
                                        options={allSeries.map(s => ({ value: s, label: s }))}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-slate-700 font-medium">Model:</label>
                                    <Select
                                        value={modelFilter}
                                        onChange={value => setModelFilter(value)}
                                        style={{ width: 220 }}
                                        options={modelsForSeries.map(m => ({ value: m, label: m }))}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-slate-700 font-medium">Input Date :</label>
                                    <DatePicker.RangePicker
                                        value={dateRange}
                                        onChange={setDateRange}
                                        allowClear
                                        format="YYYY-MM-DD"
                                        className="w-[260px]"
                                        inputReadOnly
                                        placeholder={["Start date", "End date"]}
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                            border: '1px solid rgba(148, 163, 184, 0.5)',
                                            borderRadius: '8px',
                                            color: 'rgb(51, 65, 85)'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Lot Summary Card (now between filter and action buttons) */}
                            <div className="flex gap-6 flex-wrap">
                                <div
                                    className="w-[140px] max-w-[180px] bg-gradient-to-br from-blue-50 via-white to-slate-100 border border-slate-200/60 rounded-lg shadow p-2 px-3 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                                    onClick={() => setSummaryModal({ type: 'all', open: true })}
                                >
                                    <div className="text-slate-600 text-xs font-medium mb-0.5">Total Lots (All Data)</div>
                                    <div className="text-xl font-bold text-blue-700">{totalLotCountAll}</div>
                                </div>
                                <div
                                    className="flex-1 min-w-[140px] max-w-[180px] bg-gradient-to-br from-purple-50 via-white to-slate-100 border border-slate-200/60 rounded-lg shadow p-2 px-3 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                                    onClick={() => setSummaryModal({ type: 'filtered', open: true })}
                                >
                                    <div className="text-slate-600 text-xs font-medium mb-0.5">Total Lots (Filtered)</div>
                                    <div className="text-xl font-bold text-purple-700">{totalLotCountFiltered}</div>
                                </div>
                                <div
                                    className="flex-1 min-w-[140px] max-w-[180px] bg-gradient-to-br from-red-50 via-white to-slate-100 border border-red-200/60 rounded-lg shadow p-2 px-3 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                                    onClick={() => setSummaryModal({ type: 'ngAll', open: true })}
                                >
                                    <div className="text-slate-600 text-xs font-medium mb-0.5">NG Lots (All Data)</div>
                                    <div className="text-xl font-bold text-red-700">{totalNgLotCountAll}</div>
                                </div>
                                <div
                                    className="flex-1 min-w-[140px] max-w-[180px] bg-gradient-to-br from-red-100 via-white to-slate-100 border border-red-200/60 rounded-lg shadow p-2 px-3 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                                    onClick={() => setSummaryModal({ type: 'ngFiltered', open: true })}
                                >
                                    <div className="text-slate-600 text-xs font-medium mb-0.5">NG Lots (Filtered)</div>
                                    <div className="text-xl font-bold text-red-700">{totalNgLotCountFiltered}</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {checkedLots.size === 0 && (
                                    <button
                                        type="button"
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                        onClick={handleSelectAllG}
                                    >
                                        Select All &apos;G&apos;
                                    </button>
                                )}
                                {checkedLots.size > 0 && (
                                    <>
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                            onClick={() => { setCheckedLots(new Set()) }}
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D Table Container */}
                {dateRange && dateRange[0] && dateRange[1] ? (
                    <div className="backdrop-blur-xl bg-white/80 border border-slate-200/50 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <table className="w-full border-collapse">
                                <thead>
                                    {/* Main Header Row */}
                                    <tr className="bg-gradient-to-r from-slate-100 to-slate-150">
                                        <th rowSpan={2} className="p-4 text-center font-bold text-slate-800 sticky top-0 z-10 bg-gradient-to-r from-slate-100 to-slate-150 border-r-2 border-slate-300 shadow-sm">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg">Date</span>
                                                <span className="text-xs text-slate-500 font-normal">Production Date</span>
                                            </div>
                                        </th>
                                        <th colSpan={3} className="p-4 text-center font-bold text-slate-800 sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-blue-100 border-r-2 border-slate-300 shadow-sm">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg">Lot Information</span>
                                                <span className="text-xs text-slate-500 font-normal">Production Details</span>
                                            </div>
                                        </th>
                                        <th colSpan={2} className="p-4 text-center font-bold text-slate-800 sticky top-0 z-20 bg-gradient-to-r from-green-50 to-green-100 border-r-2 border-slate-300 shadow-sm">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg">Material Consumption</span>
                                                <span className="text-xs text-slate-500 font-normal">Required Materials</span>
                                            </div>
                                        </th>
                                        <th colSpan={showCurrentStockDetails ? 5 : 1} className="p-4 text-center font-bold text-slate-800 sticky top-0 z-20 bg-gradient-to-r from-orange-50 to-orange-100 border-r-2 border-slate-300 shadow-sm">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg">Current Stock</span>
                                                <span className="text-xs text-slate-500 font-normal">Available Inventory</span>
                                                <button
                                                    type="button"
                                                    aria-label={showCurrentStockDetails ? 'Hide details' : 'Show details'}
                                                    className="mt-1 text-sm align-middle p-1 rounded-full hover:bg-orange-200 transition-all duration-300"
                                                    onClick={() => setShowCurrentStockDetails(v => !v)}
                                                >
                                                    {showCurrentStockDetails ? (
                                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-orange-600">
                                                            <circle cx="12" cy="12" r="11" fill="rgba(251, 146, 60, 0.2)" stroke="currentColor" strokeWidth="2" />
                                                            <rect x="7" y="11" width="10" height="2" rx="1" fill="currentColor" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-orange-600">
                                                            <circle cx="12" cy="12" r="11" fill="rgba(251, 146, 60, 0.2)" stroke="currentColor" strokeWidth="2" />
                                                            <rect x="7" y="11" width="10" height="2" rx="1" fill="currentColor" />
                                                            <rect x="11" y="7" width="2" height="10" rx="1" fill="currentColor" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </th>
                                        <th colSpan={2} className="p-4 text-center font-bold text-slate-800 sticky top-0 z-20 bg-gradient-to-r from-purple-50 to-purple-100 shadow-sm">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg">Action</span>
                                                <span className="text-xs text-slate-500 font-normal">Status & Selection</span>
                                            </div>
                                        </th>
                                    </tr>
                                    {/* Sub Header Row */}
                                    <tr className="bg-white border-b-2 border-slate-200">
                                        <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">Lot No.</span>
                                                <span className="text-xs text-slate-500">Production Lot</span>
                                            </div>
                                        </th>
                                        <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">Input QTY</span>
                                                <span className="text-xs text-slate-500">Total Required</span>
                                            </div>
                                        </th>
                                        <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r-2 border-slate-300">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">Model</span>
                                                <span className="text-xs text-slate-500">Product Model</span>
                                            </div>
                                        </th>
                                        <th className="p-3 text-left font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-bold">Material Part</span>
                                                <span className="text-xs text-slate-500">Component Name</span>
                                            </div>
                                        </th>
                                        <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r-2 border-slate-300">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">Required SCM</span>
                                                <span className="text-xs text-slate-500">Needed Quantity</span>
                                            </div>
                                        </th>
                                        <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">Total Stock</span>
                                                <span className="text-xs text-slate-500">Available Qty</span>
                                            </div>
                                        </th>
                                        {showCurrentStockDetails && (
                                            <>
                                                <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-bold">Recycle</span>
                                                        <span className="text-xs text-slate-500">Recycled Stock</span>
                                                    </div>
                                                </th>
                                                <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-bold">MCS Stock</span>
                                                        <span className="text-xs text-slate-500">Main Stock</span>
                                                    </div>
                                                </th>
                                                <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-bold">Nearly Expired</span>
                                                        <span className="text-xs text-slate-500">(Today+ PP + WW) - Margin</span>
                                                    </div>
                                                </th>
                                                <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r-2 border-slate-300">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-bold">MCS Stock (Expired)</span>
                                                        <span className="text-xs text-slate-500">Expired Stock</span>
                                                    </div>
                                                </th>
                                            </>
                                        )}
                                        <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">Result</span>
                                                <span className="text-xs text-slate-500">Status</span>
                                            </div>
                                        </th>
                                        <th className="p-3 text-center font-semibold text-slate-700 sticky top-[72px] z-10 bg-white border-r border-slate-200">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">Judgement</span>
                                                <span className="text-xs text-slate-500">Selection</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.length === 0 ? (
                                        <tr>
                                            <td colSpan={showCurrentStockDetails ? 14 : 11} className="p-12 text-center text-slate-500 bg-slate-50">
                                                <div className="flex flex-col items-center gap-3">
                                                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span className="text-lg font-semibold">No data available</span>
                                                    <span className="text-sm text-slate-400">Please adjust your filters to see results</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRows.map((row, index) => {
                                            const isFirstInLot = row.rowSpan && row.rowSpan > 0
                                            const isLastInLot = index === filteredRows.length - 1 ||
                                                (filteredRows[index + 1] && filteredRows[index + 1].lot !== row.lot)

                                            return (
                                                <tr
                                                    key={row.key}
                                                    className={`hover:bg-slate-50/80 transition-all duration-300 ${isFirstInLot ? 'border-t-2 border-blue-300 bg-blue-50/30' : ''
                                                        } ${isLastInLot ? 'border-b-2 border-slate-200' : ''
                                                        }`}
                                                >
                                                    {isFirstInLot ? (
                                                        <td rowSpan={row.rowSpan} className="p-4 text-center text-slate-700 font-semibold border-r-2 border-slate-300 bg-slate-50/50">
                                                            {/* Only show the main value, no description */}
                                                            <span className="text-sm font-bold">{row.date}</span>
                                                        </td>
                                                    ) : null}
                                                    {isFirstInLot ? (
                                                        <td rowSpan={row.rowSpan} className="p-4 text-center font-bold text-slate-800 border-r border-slate-200 bg-blue-50/30">
                                                            <span className="text-lg font-bold">{row.lot}</span>
                                                        </td>
                                                    ) : null}
                                                    {isFirstInLot ? (
                                                        <td rowSpan={row.rowSpan} className="p-4 text-center text-slate-700 font-semibold border-r border-slate-200 bg-blue-50/30">
                                                            <span className="text-sm font-bold">{row.inputQty !== undefined ? formatNumberWithCommas(row.inputQty) : null}</span>
                                                        </td>
                                                    ) : null}
                                                    {isFirstInLot ? (
                                                        <td rowSpan={row.rowSpan} className="p-4 text-center text-slate-700 border-r-2 border-slate-300 bg-blue-50/30">
                                                            <span className="text-sm font-semibold">{row.model}</span>
                                                        </td>
                                                    ) : null}
                                                    <td className="p-4 text-slate-700 font-medium border-r border-slate-200">
                                                        <span className="font-semibold">{row.part}</span>
                                                    </td>
                                                    <td className="p-4 text-center text-slate-700 font-semibold border-r-2 border-slate-300">
                                                        <span className="text-lg font-bold">{formatNumberWithCommas(row.needScm)}</span>
                                                    </td>
                                                    <td className={`p-4 text-center border-r border-slate-200 ${row.stock < row.needScm
                                                        ? 'bg-red-50 text-red-700 font-bold'
                                                        : 'text-slate-700 font-semibold'
                                                        }`}>
                                                        <span className="text-lg font-bold">{formatNumberWithCommas(row.stock)}</span>
                                                    </td>
                                                    {showCurrentStockDetails && (
                                                        <>
                                                            <td className="p-4 text-center text-slate-700 border-r border-slate-200">
                                                                <span className="text-sm font-semibold">{formatNumberWithCommas(row.recycle)}</span>
                                                            </td>
                                                            <td className="p-4 text-center text-slate-700 border-r border-slate-200">
                                                                <span className="text-sm font-semibold">{formatNumberWithCommas(row.mcsStock)}</span>
                                                            </td>
                                                            <td className="p-4 text-center text-slate-700 border-r border-slate-200">
                                                                <span className="text-sm font-semibold">{formatNumberWithCommas(row.nearlyExpired)}</span>
                                                            </td>
                                                            <td className="p-4 text-center text-slate-700 border-r-2 border-slate-300">
                                                                <span className="text-sm font-semibold">{formatNumberWithCommas(row.mcsStockExpired)}</span>
                                                            </td>
                                                        </>
                                                    )}
                                                    {isFirstInLot ? (
                                                        <td rowSpan={row.rowSpan} className="p-4 text-center border-r border-slate-200">
                                                            <div className={`font-bold flex flex-col items-center gap-2 ${checkedLots.has(`${row.date}-${row.lot}`)
                                                                ? 'text-blue-600'
                                                                : row.overallResult === 'G'
                                                                    ? 'text-emerald-600'
                                                                    : 'text-red-600'
                                                                }`}>
                                                                {checkedLots.has(`${row.date}-${row.lot}`) ? (
                                                                    <>
                                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="text-sm font-bold">Reserved</span>
                                                                        <span className="text-xs text-slate-500">Selected</span>
                                                                    </>
                                                                ) : row.overallResult === 'G' ? (
                                                                    <>
                                                                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="text-sm font-bold">OK</span>
                                                                        <span className="text-xs text-slate-500">Good</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="text-sm font-bold">NG</span>
                                                                        <span className="text-xs text-slate-500">Not Good</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    ) : null}
                                                    {isFirstInLot ? (
                                                        <td rowSpan={row.rowSpan} className="p-4 text-center border-r border-slate-200">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-6 h-6 accent-blue-500 bg-white border-slate-300 rounded focus:ring-blue-400 focus:ring-2 transition-all duration-300"
                                                                    checked={checkedLots.has(`${row.date}-${row.lot}`)}
                                                                    disabled={row.overallResult === 'NG' && !checkedLots.has(`${row.date}-${row.lot}`)}
                                                                    onChange={e => {
                                                                        updateReservedMaterials(`${row.date}-${row.lot}`, e.target.checked)
                                                                    }}
                                                                />
                                                                <span className="text-xs text-slate-500">Select</span>
                                                            </div>
                                                        </td>
                                                    ) : null}
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-xl text-slate-500 font-semibold bg-white/80 border border-slate-200/50 rounded-2xl shadow-2xl mt-8">
                        <div className="flex flex-col items-center gap-4">
                            <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-2xl font-bold">Please select filters</span>
                            <span className="text-sm text-slate-400">Choose a model and date range to view data</span>
                        </div>
                    </div>
                )}

                {/* 3D Modal with Glassmorphism */}
                {modalOpen && (
                    <dialog open className="modal modal-open">
                        <form method="dialog" className="modal-box max-w-md backdrop-blur-2xl bg-white/90 border border-slate-200/50 rounded-2xl shadow-2xl">
                            <h3 className="font-bold text-xl mb-4 text-slate-800">Confirm Lot Approval</h3>
                            <p className="text-sm text-slate-600 mb-6">You are about to approve the following lots. Please confirm.</p>
                            <div className="mt-3 mb-6">
                                <div className="font-semibold text-slate-700 mb-3">Lot Summary</div>
                                <div className="max-h-40 overflow-y-auto bg-slate-50 backdrop-blur-sm p-4 rounded-xl space-y-2 border border-slate-200">
                                    {lotsToApprove.map(lot => (
                                        <div key={lot} className="font-semibold text-slate-700 bg-white p-2 rounded-lg shadow-sm">LOT: {lot}</div>
                                    ))}
                                </div>
                            </div>
                            {/* Material Consumption Summary (grouped by model) */}
                            {Object.keys(materialSummaryByModel).length > 0 && (
                                <div className="mt-6 bg-slate-50 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                                    <div className="font-semibold text-slate-700 mb-3">Material Consumption Summary</div>
                                    {Object.entries(materialSummaryByModel).map(([model, parts]) => (
                                        <div key={model} className="mb-4">
                                            <div className="font-semibold text-blue-600 mb-2">Model: {model}</div>
                                            <table className="w-full text-sm mb-3">
                                                <thead>
                                                    <tr className="text-slate-600">
                                                        <th className="text-left py-1 px-2">Material Part</th>
                                                        <th className="text-right py-1 px-2">Total Reserved</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.values(parts).map(mat => (
                                                        <tr key={mat.part} className="text-slate-700">
                                                            <td className="py-1 px-2">{mat.part}</td>
                                                            <td className="py-1 px-2 text-right font-semibold">{formatNumberWithCommas(mat.total)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="modal-action flex gap-3">
                                <button
                                    type="button"
                                    className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                    onClick={handleModalConfirm}
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                        <form method="dialog" className="modal-backdrop backdrop-blur">
                            <button aria-label="close" onClick={() => setModalOpen(false)}></button>
                        </form>
                    </dialog>
                )}

                {/* Summary Modal */}
                {summaryModal.open && (
                    <dialog open className="modal modal-open">
                        <form method="dialog" className="modal-box max-w-lg backdrop-blur-2xl bg-white/90 border border-slate-200/50 rounded-2xl shadow-2xl">
                            <h3 className="font-bold text-xl mb-4 text-slate-800">
                                {summaryModal.type === 'all' && 'All Lots (All Data)'}
                                {summaryModal.type === 'filtered' && 'All Lots (Filtered)'}
                                {summaryModal.type === 'ngAll' && 'NG Lots (All Data)'}
                                {summaryModal.type === 'ngFiltered' && 'NG Lots (Filtered)'}
                            </h3>
                            <div className="max-h-96 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-slate-600">
                                            <th className="text-left py-1 px-2">Date</th>
                                            <th className="text-left py-1 px-2">Lot No.</th>
                                            <th className="text-left py-1 px-2">Model</th>
                                            <th className="text-left py-1 px-2">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summaryModalLots.map(lot => (
                                            <tr key={[String(lot.date), String(lot.lot)].join('-')} className="text-slate-700">
                                                <td className="py-1 px-2">{lot.date ?? '-'}</td>
                                                <td className="py-1 px-2">{lot.lot ?? '-'}</td>
                                                <td className="py-1 px-2">{lot.model ?? '-'}</td>
                                                <td className={`py-1 px-2 font-bold ${(lot.result ?? '-') === 'NG' ? 'text-red-600' : 'text-emerald-600'}`}>{lot.result ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-action flex gap-3">
                                <button
                                    type="button"
                                    className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                    onClick={() => setSummaryModal({ ...summaryModal, open: false })}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                        <form method="dialog" className="modal-backdrop backdrop-blur">
                            <button aria-label="close" onClick={() => setSummaryModal({ ...summaryModal, open: false })}></button>
                        </form>
                    </dialog>
                )}
            </div>
        </div>
    )
}

export default MatReadyPage
