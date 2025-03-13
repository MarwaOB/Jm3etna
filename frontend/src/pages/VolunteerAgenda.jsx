import React from 'react'
import {cards} from "./cardExport"


const VolunteerAgenda = () => {
  return (
    <div className='flex justify-between items-center gap-4 w-full h-fit m-auto p-4'>
            {cards.map((card, index) => (
            <div className='border-greenMain border bg-red'>
              <div className='flex flex-row justify-between items-start gap-2 font-body'>
                <div>{card.date}</div>
                <div>{card.period}</div>
              </div>  
              <div>{card.task}</div>
              <div>{card.orgaName}</div>
              <div>{card.location}</div>
            </div>
          ))}
    </div>
  )
}

export default VolunteerAgenda