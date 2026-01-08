import React, { createContext } from 'react'

export const UserDataContext = createContext()

const UserContext = (props) => {
    
    const user= 'Sujoy'


  return (
    <div className='context-div'>
        <UserDataContext.Provider value={user} >
            {props.children}
        </UserDataContext.Provider>
    </div>
  )
}

export default UserContext