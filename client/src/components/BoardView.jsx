import React from "react";
import ComplaintCard from "./ComplaintCard";

const BoardView = ({ complaints }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-10'>
      {/* To Do Column */}
      <div className='space-y-4'>
        {complaints
          ?.filter((task) => task.status === 'todo')
          .map((task, index) => (
            <ComplaintCard complaint={task} key={index} />
          ))}
      </div>
  

      <div className='space-y-4'>
        {complaints
          ?.filter((task) => task.status === 'in-progress')
          .map((task, index) => (
            <ComplaintCard complaint={task} key={index} />
          ))}
      </div>
  
      {/* Completed Column */}
      <div className='space-y-4'>
        {complaints
          ?.filter((task) => task.status === 'resolved')
          .map((task, index) => (
            <ComplaintCard complaint={task} key={index} />
          ))}
      </div>
    </div>
  );
}

export default BoardView;
