import React  from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
export const File = ({filename, order}) =>{

    return (
        
        <ul ClassName="list">
             <FontAwesomeIcon icon={faFilePdf} size="2x"/>  &nbsp;
         {filename}
      
      </ul>
      
      )

}
