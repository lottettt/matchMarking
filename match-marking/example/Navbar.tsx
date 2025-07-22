'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import LanguageSwitcher from './LanguageSwitcher'
import { getUserData, removeTokenFromCookies, removeUserData } from '@/lib/jwt-utils'
import { useRouter } from 'next/navigation'

interface UserData {
    username: string
    section: string
    empcode: string
    position: string
}

const Navbar: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Get user data from localStorage
        const data = getUserData()
        setUserData(data)
    }, [])

    const handleSignOut = () => {
        // Remove token and user data
        removeTokenFromCookies()
        removeUserData()

        // Clear selected department and product
        localStorage.removeItem('selectedDepartment')
        localStorage.removeItem('selectedProduct')

        // Redirect to login page
        router.push('/')
    }

    return (
        <nav className="bg-white/30 backdrop-blur-lg text-gray-800 py-2 px-6 flex items-center justify-between shadow-md z-50">
            <div className="flex items-center">
                <Image src="/onePlan/Image/one_system_icon.svg" alt="One System Icon" width={40} height={40} className="mr-2 drop-shadow-lg" />
                <span className="text-3xl font-bold items-center text-gray-900 tracking-wide">One System</span>
            </div>
            <div className="flex items-center">
                <LanguageSwitcher />
                <div className="flex items-center mr-4 ml-4 bg-white/40 rounded-xl px-3 py-1 shadow-inner backdrop-blur-md">
                    <UserOutlined className="mr-2 text-blue-500" />
                    <span className="font-semibold">{userData?.username || 'Loading...'}</span>
                    <span className="ml-2 text-sm text-gray-400">{userData?.section || ''}</span>
                    <span className="ml-2 text-sm text-gray-500">• {userData?.position || ''}</span>
                </div>
                <button
                    className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-5 rounded-full shadow-lg transition-all duration-200 focus:ring-4 focus:ring-red-200 focus:outline-none text-lg ml-2 gap-2 hover:scale-105"
                    onClick={handleSignOut}
                >
                    <LogoutOutlined className="mr-2" />
                    Sign Out
                </button>
            </div>
        </nav>
    )
}

export default Navbar 