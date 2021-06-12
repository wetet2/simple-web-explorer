import styled from 'styled-components';

export const ToastWrap = styled.div`
   position: fixed;
   bottom: 0;
   left: 0;
   right: 0;
   height: 0;

   display: flex;
   align-items: flex-end;
   flex-direction: column-reverse;

   padding-right: 30px;
   z-index: 1;

   .toast {
      display: inline-flex;
      align-items: center;

      width: 350px;
      min-height: 50px;
      margin-bottom: 12px;
      padding: 12px 32px 12px 16px;
      border-radius: 12px;
      background-color: #137cbd;
      box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
      font-size: 16px;
      font-weight: 500;
      color: #fff;
      
      opacity: 0;
      transition: all .3s;
      transform: translateY(30px);
      z-index: 1;

      &.active {
         opacity: 1;
         transform: translateY(0px);
      }
      &.shrink{
         min-height: 0;
         height: 0;
         padding-top: 0;
         padding-bottom: 0;
         margin: 0;
         color: transparent;
         opacity: 0;
      }
   }
`;