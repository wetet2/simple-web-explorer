import styled from 'styled-components';

const media = {
   mobile: `@media screen and (max-width: 767px)`
}

export const ErrorWrap = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 100vh;
`

export const Image = styled.img`
   max-width: 50vw;
`

export const Message = styled.div`

   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   margin-top: 12px;

   h4{
      font-size: 20px;
      margin-bottom: 8px;
   }
   p{
      text-align: center;
   }

`





export default {};




