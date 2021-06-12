import React, { useState, useEffect } from 'react';
import * as S from './SourceViewer.style';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ajax from '../utils/ajax'
import path from 'path';


function SourceViewerComponent() {
   let [text, setText] = useState('');
   let [ext, setExt] = useState('txt');

   useEffect(() => {
      let urlParams = new URLSearchParams(location.search)
      let filePath = urlParams.get('path');
      (async () => {
         let result = await ajax('/api/file/read', { filePath });
         if (result.data && result.data.contents) {
            setText(result.data.contents);
            let extName = path.extname(filePath);
            
            setExt(extName.replace('.', ''));
         }
      })();
   }, [])

   return (
      <S.CodeWrap>
         <SyntaxHighlighter language={ext} style={vscDarkPlus} customStyle={{ margin: 0 }}>{text}</SyntaxHighlighter>
      </S.CodeWrap>
   )
}

export default SourceViewerComponent;
