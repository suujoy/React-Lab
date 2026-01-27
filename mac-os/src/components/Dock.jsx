import React from 'react'
import "./dock.scss"

const Dock = () => {
  return (
    <footer className='dock'>
        <div className="icon github"><img src="/doc-icon/github.svg" alt="" /></div>
        <div className="icon note"><img src="/doc-icon/note.svg" alt="" /></div>
        <div className="icon pdf"><img src="/doc-icon/pdf.svg" alt="" /></div>
        <div className="icon calender"><img src="/doc-icon/calender.svg" alt="" /></div>
        <div className="icon spotify"><img src="/doc-icon/spotify.svg" alt="" /></div>
        <div className="icon mail"><img src="/doc-icon/mail.svg" alt="" /></div>
        <div className="icon link"><img src="/doc-icon/link.svg" alt="" /></div>
        <div className="icon cli"><img src="/doc-icon/cli.svg" alt="" /></div>
    </footer>
  )
}

export default Dock
