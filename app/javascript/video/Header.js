
import React from 'react';

import brandmark from './assets/brandmark@3x.png';

export default function Header(props) {
  return (
    <header className="header margin-bottom-2em" >
        {/* <div class="logo-box">
            <img src={brandmark} alt="Logo" class="logo"></img>
        </div> */}
        <div className="text-box">
            <h1 className="heading-primary">
                <span className="heading-primary-main">Renew Video</span>
                <span className="heading-primary-sub">come chat with us</span>
            </h1>
        </div>
    </header>
  );
}