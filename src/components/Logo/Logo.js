import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png';


const logoStyle = {
    maxHeight: '100px',
    paddingTop: '5px',
    alignItems: 'center'
}
const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt>
                <div className='tilt' style={{ display: 'flex', height: '150px', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={brain} style={logoStyle} alt="logo"></img>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;