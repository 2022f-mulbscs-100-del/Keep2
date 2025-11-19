import {IoMdArchive} from 'react-icons/io'; // archive icon

// import Snackbar from '@mui/material/Snackbar';// snackbar component from Material UI
import Tooltip from '@mui/material/Tooltip'; // tooltip component from Material UI
import {useEffect, useState} from 'react';
import IconStyling from '../IconStyling';
import {useNote} from '../../Context/noteContext';
import IconsArray, {DeleteIconsArray} from '../../../public/Data.js';
import {useLocation} from 'react-router-dom';
import axios from 'axios';
type ActionIconsProps = {
  IsHover: boolean;
  id: number;
};

const ActionIcons = ({IsHover, id}: ActionIconsProps) => {
  const {fetchApiData} = useNote();

  // LOCAL STATES
  const [SnackBaropen, setSnackBarOpen] = useState(false);

  // GLOBAL STATES
  const {
    StoreNoteChange,
    setStoreNoteChange,
    deletedNotes,
    remainderNote,
    setremainderNote,
    setDeletedNotes,
    archievedNote,
    setArchieveNote
  } = useNote();

  console.log(SnackBaropen);
  // deleting note and sending it to bin by saving it into deleteNotes state array
  const deleteNote = (id: number) => {
    axios
      .delete(`http://localhost:2404/api/notes/${id}`)
      .then(() => {
        fetchApiData();
      })
      .catch(error => {
        console.error('Error deleting note:', error);
      });
    const pushDeleteNote = StoreNoteChange.find(item => item.id === id);
    const pushAarchieveDeleteNote = archievedNote.find(item => item.id === id);
    const pushRemainderDeleteNote = remainderNote.find(item => item.id === id);
    const permnentDeleteNote = deletedNotes.find(item => item.id === id);
    // note delete logic
    if (pushDeleteNote) {
      setDeletedNotes(prev => [...prev, pushDeleteNote]);
      const updateNote = StoreNoteChange.filter(item => {
        return item.id !== id;
      });
      setStoreNoteChange(updateNote);
      return;
    }

    //  archieve delete logic
    if (pushAarchieveDeleteNote) {
      setDeletedNotes(prev => [...prev, pushAarchieveDeleteNote]);
      const updateNoteArchieve = archievedNote.filter(item => {
        return item.id !== id;
      });
      setArchieveNote(updateNoteArchieve);
    }

    // remainder delete logic
    if (pushRemainderDeleteNote) {
      setDeletedNotes(prev => [...prev, pushRemainderDeleteNote]);
      const updateNoteRemainder = remainderNote.filter(item => {
        return item.id !== id;
      });
      setremainderNote(updateNoteRemainder);
    }

    // permanent delete logic
    if (permnentDeleteNote) {
      const updateNotePermnentDelete = deletedNotes.filter(item => {
        return item.id !== id;
      });
      setDeletedNotes(updateNotePermnentDelete);
    }
  };

  // removing  note  from notes and sending it to archieve by saving it into archievenote state array
  const archieveNote = (id: number) => {
    const pushArchieveNote = StoreNoteChange.find(item => item.id === id);
    const pushRemainderNoteToArchieve = remainderNote.find(
      item => item.id === id
    );

    if (pushArchieveNote) {
      pushArchieveNote.catgeory = '/archieve';
      setArchieveNote(prev => [...prev, pushArchieveNote]);
    }
    if (pushRemainderNoteToArchieve) {
      pushRemainderNoteToArchieve.catgeory = '/archieve';
      setArchieveNote(prev => [...prev, pushRemainderNoteToArchieve]);
    }
    // removing note from StoreNoteChange state array
    // and remainderNote state array if it exists in remainderNote
    if (pushArchieveNote) {
      const updateNote = StoreNoteChange.filter(item => {
        return item.id !== id;
      });
      setStoreNoteChange(updateNote);
    }
    if (pushRemainderNoteToArchieve) {
      const updateRemainderNote = remainderNote.filter(item => {
        return item.id !== id;
      });
      setremainderNote(updateRemainderNote);
    }
  };

  // removing  note  from notes and sending it to remainder by saving it into remaindernote state array
  const RemainderNote = (id: number) => {
    const PushRemainderNote = StoreNoteChange.find(item => item.id === id);

    if (PushRemainderNote) {
      PushRemainderNote.catgeory = '/reminders';
      setremainderNote(prev => [...prev, PushRemainderNote]);
    }
    const updateNote = StoreNoteChange.filter(item => {
      return item.id !== id;
    });
    setStoreNoteChange(updateNote);
  };

  //restoring note from deleted notes
  const restoreNote = (id: number) => {
    const pushRestoreNote = deletedNotes.find(item => item.id === id);
    if (pushRestoreNote) {
      if (pushRestoreNote.catgeory === '/') {
        setStoreNoteChange(prev => [...prev, pushRestoreNote]);
      }
      if (pushRestoreNote.catgeory === '/archieve') {
        setArchieveNote(prev => [...prev, pushRestoreNote]);
      }
      if (pushRestoreNote.catgeory === '/reminders') {
        setremainderNote(prev => [...prev, pushRestoreNote]);
      }
      const updateDeletedNote = deletedNotes.filter(item => {
        return item.id !== id;
      });
      setDeletedNotes(updateDeletedNote);
    }
  };

  const UnarchievedNote = (id: number) => {
    const pushUnarchieveNote = archievedNote.find(item => item.id === id);
    if (pushUnarchieveNote) {
      pushUnarchieveNote.catgeory = '/notes';
      setStoreNoteChange(prev => [...prev, pushUnarchieveNote]);
      const updateArchieveNote = archievedNote.filter(item => {
        return item.id !== id;
      });
      setArchieveNote(updateArchieveNote);
    }
  };

  useEffect(() => {
    console.log(StoreNoteChange, 'StoreNoteChange');
    console.log(remainderNote, 'remainderNote');
    console.log(archievedNote, 'archievedNote');
    console.log(deletedNotes, 'deletedNotes');
  }, [StoreNoteChange, remainderNote, archievedNote, deletedNotes]);

  const {pathname} = useLocation();

  return (
    <>
      <div
        className={` flex ${pathname != '/bin' ? 'justify-between' : 'justify-start'}  items-center gap-2 px-2 py-1  transition-all duration-500 opacity-0 ${IsHover && `opacity-100`}`}
      >
        {pathname != '/bin'
          ? IconsArray.map(item => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === 6) {
                      deleteNote(id);
                      console.log('delete note', id);
                    }
                    if (item.id === 5) {
                      archieveNote(id);
                    }
                    if (item.id === 3) {
                      RemainderNote(id);
                    }
                    setSnackBarOpen(true);
                  }}
                >
                  {pathname === '/archieve' && item.id === 5 ? (
                    <div
                      className="rotate-180"
                      onClick={() => (
                        UnarchievedNote(id),
                        setSnackBarOpen(true)
                      )}
                    >
                      <Tooltip title={item.title}>
                        <IconStyling id={item.id} icon={IoMdArchive} />
                      </Tooltip>
                    </div>
                  ) : (
                    <IconStyling id={item.id} icon={item.icon} />
                  )}
                </div>
              );
            })
          : DeleteIconsArray.map(item => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === 1) {
                      deleteNote(id);
                    }
                    if (item.id === 2) {
                      restoreNote(id);
                    }
                  }}
                >
                  <IconStyling id={item.id} icon={item.icon} />
                </div>
              );
            })}
      </div>
    </>
  );
};

export default ActionIcons;
