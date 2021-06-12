import styled from 'styled-components';

export const Loading = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   
   display: none;
   align-items: center;
   justify-content: center;

   background: rgba(0,0,0,.3);
   font-size: 40px;
   font-weight: 500;
   color: #fff;
   
   transition: all .3s;
   opacity: 0;
   z-index: 1;
   
   &.active{
      display: flex;
   }

   &.animate{
      opacity: 1;
   }

`;

export const LoadingInner = styled.div`

   
   color: #ffffff;
   position: relative;
   font-size: 11px;
   transform: translateZ(0);
   
   &,
   &:before,
   &:after {
      content: '';
      background: #ffffff;
      animation: kf-loading 1s infinite ease-in-out;
      width: 1em;
      height: 4em;
   }

   &{
      position: relative;
      animation-delay: -0.16s;
   }

   &:before {
      position: absolute;
      left: -1.5em;
      animation-delay: -0.32s;
   }

   &:after {
      position: absolute;
      left: 1.5em;
   }
   
   @keyframes kf-loading {
      0%,
      80%,
      100% {
         box-shadow: 0 0;
         height: 4em;
      }

      40% {
         box-shadow: 0 -2em;
         height: 5em;
      }
   }


`;
