import styled from 'styled-components';

export const LoginBox = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100vw;
   height: 100vh;
   background: -webkit-gradient(linear, left top, right top, from(#689fd7), color-stop(25%, #8cd2da), color-stop(50%, #56bd97), to(#51c586));
   background: linear-gradient(to right, #689fd7, #8cd2da 25%, #56bd97 50%, #51c586);
`

export const Input = styled.input`
   width: 200px;
   height: 30px;
   border: 0;
   background-color: #fff;
   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
   text-align: center;
   outline: none;
`
