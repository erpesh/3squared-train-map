import React from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import {AlignJustify, XIcon} from "lucide-react";
import Sidebar from "./sidebar/Sidebar";

const Header = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }

    return (
        <nav className="header">
            <img
                src="https://workable-application-form.s3.amazonaws.com/advanced/production/6246349ef4eee0e673b5e81a/02f6a105-676a-9b3a-a58b-58fc717de521"
                alt="Logo" className="logo"/>
            <h1 className="title">National Rail Map</h1>
            <div>
                <button onClick={toggleDrawer} className={'clean-button'}>
                    <AlignJustify/>
                </button>
                <Drawer
                    open={isOpen}
                    onClose={toggleDrawer}
                    direction='left'
                    style={{
                        background: "#AFEEEE",
                        maxWidth: 400,
                        zIndex: 1001,
                        overflow: 'scroll'
                    }}
                    className={'drawer'}
                    size={'80%'}
                >
                    <button className={'clean-button'} onClick={toggleDrawer}>
                        <XIcon style={{width: 24, height: 24}}/>
                    </button>
                    <Sidebar mobile/>
                </Drawer>
            </div>
        </nav>
    );
};

export default Header;
