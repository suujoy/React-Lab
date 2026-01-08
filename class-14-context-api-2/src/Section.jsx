import React from 'react'

const Section = (props) => {
    console.log(props.children)
  return (
    <div className='h-90 bg-zinc-500'>
        <h1 className='text-xl'>Section</h1>
        {props.children}
    </div>
  )
}

export default Section