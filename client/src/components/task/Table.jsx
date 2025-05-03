import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, formatDate, getPriority } from "../../utils";
import clsx from "clsx";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import CatInfo from "../CatInfo";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ complaints }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const deleteHandler = () => {
    // Handle delete logic here
    toast.success("Complaint deleted successfully!");
    setOpenDialog(false);
  };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300'>
      <tr className='w-full text-black text-left'>
        <th className='py-2'>Complaint Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Created At</th>
        <th className='py-2'>Proof</th>
        <th className='py-2'>Issue Category</th>
        <th className='py-2'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ complaint }) => {
    const priority = getPriority(complaint?.priority_factor);

    return (
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
        <td className='py-2'>
          <p className='w-full line-clamp-2 text-base text-black'>
            {complaint?.title}
          </p>
        </td>

        <td className='py-2'>
          <div className='flex gap-1 items-center'>
            <span className={clsx("text-lg", PRIOTITYSTYELS[priority])}>
              {ICONS[priority]}
            </span>
            <span className='capitalize line-clamp-1'>{priority} Priority</span>
          </div>
        </td>

        <td className='py-2'>
          <span className='text-sm text-gray-600'>
            {formatDate(new Date(complaint?.date))}
          </span>
        </td>

        <td className='py-2'>
          <div className='flex items-center gap-3'>
            <div className='flex gap-1 items-center text-sm text-gray-600'>
              <MdAttachFile />
              <span>{complaint?.complaint_proof ? 1 : 0}</span>
            </div>
          </div>
        </td>

        <td className='py-2'>
          <div className='flex'>
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
        </td>

        <td className='py-2 flex gap-2 md:gap-4 justify-end'>
          <Button
            className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
            label='Edit'
            type='button'
          />

          <Button
            className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
            label='Delete'
            type='button'
            onClick={() => deleteClicks(complaint._id)}
          />
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <TableHeader />
            <tbody>
              {complaints.map((complaint, index) => (
                <TableRow key={index} complaint={complaint} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Table;