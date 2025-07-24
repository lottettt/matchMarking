'use client'
import React, { useState, useTransition, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Layout, Menu } from 'antd'
import { PieChartOutlined, DesktopOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useDepartments, useDepartmentProductStore } from '@/store/departmentProductSlice'
const { Sider } = Layout

const items: MenuProps['items'] = [
    { label: 'OVERVIEW', key: '/overview', icon: <PieChartOutlined /> },
    {
        label: 'PRO.CONTROL', key: 'procontrol', icon: <DesktopOutlined />, children: [
            {
                type: 'group',
                label: 'Planning',
                children: [
                    { label: 'InputPlan', key: '/ProPlan' },
                    { label: 'MonthlyOverview', key: '/MonthlyOverview' },
                ] as MenuProps['items'],
            },
            {
                type: 'group',
                label: 'Material',
                children: [
                    { label: 'MatReady', key: '/MatReady' },
                    { label: 'MatRecycle', key: '/MatRecycle' },
                ] as MenuProps['items'],
            }
        ] as MenuProps['items'],
    },
    {
        label: 'PRODUCTION', key: 'production', icon: <UserOutlined />, children: [
            { label: 'LineFormation', key: '/LineFormation' },
            { label: 'LotControl', key: '/LotControl' },
            { label: 'Calendar Management', key: '/CalendarManagement' },
            { label: 'LotScheduling', key: '/LotScheduling' },
        ] as MenuProps['items'],
    },
    { label: 'AUTHORITY', key: '/Authority', icon: <SafetyCertificateOutlined /> },
]

const SiderMenu: React.FC = () => {
    const [collapsed, setCollapsed] = useState(true)
    const [selectedDepartment, setSelectedDepartment] = useState<string>('')
    const [selectedProduct, setSelectedProduct] = useState<string>('')
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const pathname = usePathname()
    const selectedKey = '/' + pathname.split('/').pop()

    // Department product data
    const departments = useDepartments()
    const { fetchDepartmentProductData, products: allProductData } = useDepartmentProductStore()

    // Fetch data on component mount
    useEffect(() => {
        fetchDepartmentProductData()
    }, [fetchDepartmentProductData])

    // Set initial department when data is loaded
    useEffect(() => {
        if (departments.length > 0 && !selectedDepartment) {
            // Try to get stored department from localStorage, fallback to first department
            const storedDepartment = localStorage.getItem('selectedDepartment')
            const validDepartment = storedDepartment && departments.includes(storedDepartment)
                ? storedDepartment
                : departments[0]
            setSelectedDepartment(validDepartment)
        }
    }, [departments, selectedDepartment])

    // Filter products based on selected department
    const filteredProducts = allProductData
        .filter(item => item.department === selectedDepartment)
        .map(item => item.product)

    // Get CCC name for the selected product
    const selectedProductCccName = allProductData
        .find(item => item.department === selectedDepartment && item.product === selectedProduct)?.ccc_name || '61CM'

    // Set initial product when department changes or data is loaded
    useEffect(() => {
        if (filteredProducts.length > 0 && (!selectedProduct || !filteredProducts.includes(selectedProduct))) {
            // Try to get stored product from localStorage, fallback to first product
            const storedProduct = localStorage.getItem('selectedProduct')
            const validProduct = storedProduct && filteredProducts.includes(storedProduct)
                ? storedProduct
                : filteredProducts[0]
            setSelectedProduct(validProduct)
        }
    }, [filteredProducts, selectedProduct])

    // Save selected department to localStorage when it changes
    useEffect(() => {
        if (selectedDepartment) {
            localStorage.setItem('selectedDepartment', selectedDepartment)
        }
    }, [selectedDepartment])

    // Save selected product to localStorage when it changes
    useEffect(() => {
        if (selectedProduct) {
            localStorage.setItem('selectedProduct', selectedProduct)
        }
    }, [selectedProduct])

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (typeof e.key === 'string' && e.key.startsWith('/')) {
            startTransition(() => {
                router.push(e.key)
            })
        }
    }

    return (
        <>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
                <div className='flex items-center justify-center mb-6 mt-4'>
                    <Image src="/onePlan/Image/Murata_Logo.svg" alt="Murata Logo" width={120} height={120} />
                </div>
                <div className="mb-4 px-2">
                    {collapsed && <span className="block text-gray-700 text-sm font-bold mb-2 text-center">{selectedDepartment}</span>}
                    {!collapsed && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">Department</label>
                            <select
                                id="department"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {departments.map((dept: string, index: number) => (
                                    <option key={index} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="mb-4 px-2">
                    {collapsed && <><span className="block text-gray-700 text-sm font-bold text-center">{selectedProduct}</span><span className="block text-gray-700 text-sm mb-2 text-center text-xs">({selectedProductCccName})</span></>}
                    {!collapsed && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product">Product</label>
                            <select
                                id="product"
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {filteredProducts.map((product: string, index: number) => (
                                    <option key={index} value={product}>{product}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <Menu
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    items={items}
                    style={{ backgroundColor: 'white', marginTop: '20px' }}
                    onClick={handleMenuClick}
                />
            </Sider>
            {isPending && (
                <LoadingSpinner message="Loading..." size="md" overlay={true} />
            )}
        </>
    )
}

export default SiderMenu 