'use client'
import React from "react"
import "@/public/styles/index.css"
import Ranking from './ranking'

export default function Drawer() {
    const [open, setOpen] = React.useState(false);
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label htmlFor="my-drawer" className="bg-blue-900 border-none drawer-button btn btn-primary text-2xl font-Dalmoori">RANKING</label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu text-2xl w-96 text-base-content bg-blue-950 bg-opacity-50 drawer-height">
                    <p className="absolute mt-5 left-10 text-5xl font-Sam3 logo">Ranking</p>
                    <Ranking/>
                </ul>
            </div>
        </div>
    )
}