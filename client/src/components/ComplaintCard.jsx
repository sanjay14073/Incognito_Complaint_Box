import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, formatDate, getPriority } from "../utils";
import ComplaintDialog from "./task/ComplaintDialog"; 
import { BiMessageAltDetail } from "react-icons/bi";
import CatInfo from "./CatInfo";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};



const ComplaintCard = ({ complaint }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  // Priority logic based on priority_factor


  const priority = getPriority(complaint?.priority_factor);

  return (
    <>
      <div className='w-full h-fit bg-white shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[priority]
            )}
          >
            <span className='text-lg'>{ICONS[priority]}</span>
            <span className='uppercase'>{priority} Priority</span>
          </div>

          {  <ComplaintDialog complaint={complaint} />}
        </div>

        <>
          <div className='flex items-center gap-2'>
            <h4 className='line-clamp-1 text-black'>{complaint?.title}</h4>
          </div>
          <span className='text-sm text-gray-600'>
            {formatDate(new Date(complaint?.date))}
          </span>
        </>

        <div className='w-full border-t border-gray-200 my-2' />
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3'>
            <div className='flex gap-1 items-center text-sm text-gray-600'>
              <BiMessageAltDetail />
              <span>{complaint?.comments?.length}</span>
            </div>
            <div className='flex gap-1 items-center text-sm text-gray-600 '>
              <MdAttachFile />
              <span>{complaint?.complaint_proof ? 1 : 0}</span>
            </div>
          </div>

          <div className='flex flex-row-reverse'>
            {complaint?.issue_category?.map((category, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
               <CatInfo user={category} />
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Description */}
        <div className='py-4 border-t border-gray-200'>
          <h5 className='text-base line-clamp-2 text-black'>
            {complaint?.complaint}
          </h5>
        </div>

        <div className='w-full pb-2'>
          <span className='text-sm text-gray-600'>
            Last Updated: {formatDate(new Date(complaint?.lastupdate))}
          </span>
        </div>
      </div>
    </>
  );
};

export default ComplaintCard;