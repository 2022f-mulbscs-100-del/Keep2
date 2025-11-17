
import  { useRef, useState, useEffect } from 'react'

//Custom component 
import SelectIcon from './SelectIcon';
import NoteDescription from './NoteDescription';
import ActionIcons from './ActionIcons';
import NoteTitle from './NoteTitle';
import { useNavigate } from 'react-router-dom';



type NoteProps = {  
    id: number,
    title: string,
    description: string,
    NotePinned: boolean
}
const Note = ({ title, description, NotePinned, id }: NoteProps) => {



    // LOCAL STATES
    const [_, setLocalIsPinned] = useState(false);
    const [IsHover, setIsHover] = useState<boolean>(false);
    const NoteRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    //detecting click to close input
    useEffect(() => {
        const HandleHover = (e: MouseEvent) => {
            if (
                NoteRef.current &&
                NoteRef.current.contains(e.target as Node)
            ) {
                setIsHover(true);
            } else {
                setIsHover(false);
            }

        }
       
        document.addEventListener('mouseover', HandleHover);
        return () => {
            document.removeEventListener('mouseover', HandleHover);
        };
    }, []);

     const HandleClick = () => {
            navigate('/notes/' + id);
        }

    return (
        <>
            <div  ref={NoteRef} className={`relative w-[250px] h-min-[100px]   shadow-lg   border rounded-[8px] border-[#5F6368] break-words cursor-pointer `}>

                {/* Select Icon for selecting the note */}
                <SelectIcon
                    IsHover={IsHover}
                />

                {/* title and description of the note */}
                <div className='p-4' onClick={HandleClick}>

                    {/* title of the note */}

                    <NoteTitle
                        title={title}
                        IsHover={IsHover}
                        NotePinned={NotePinned}
                        setLocalIsPinned={setLocalIsPinned}

                    />

                    {/* description of the note */}
                    <NoteDescription
                        setLocalIsPinned={setLocalIsPinned}
                        title={title}
                        description={description}
                        IsHover={IsHover}
                        NotePinned={NotePinned}
                    />

                </div>

                {/* Icons for note actions */}

                <ActionIcons
                    IsHover={IsHover}
                    id={id}
                />


            </div>
        </>
    )
}

export default Note;