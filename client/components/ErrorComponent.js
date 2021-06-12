import React from 'react';

import * as S from './ErrorComponent.style';

class ErrorComponent extends React.Component {
   render() {
      return (
         <S.ErrorWrap>
            <S.Image src="/images/error.svg" />
            <S.Message>
               <h4>이 페이지를 열 수 없습니다.</h4>
               <p>
                  이 페이지를 찾을 수 없거나 오류가 발생하였습니다.
               </p>
               
            </S.Message>
         </S.ErrorWrap>
      )
   }
}
export default ErrorComponent;
