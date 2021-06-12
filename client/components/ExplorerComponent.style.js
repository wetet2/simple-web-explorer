import styled from 'styled-components';

const media = {
   mobile: `@media screen and (max-width: 767px)`
}

export const Header = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;

   width: 100%;
   height: 40px;
   padding: 0 16px;
   background: linear-gradient(to right,#689fd7,#8cd2da 25%,#56bd97 50%,#4ab77c);

   label{
      font-size: 16px;
      color: #fff;
      cursor: pointer;
   }
   span{
      color: #fff;
      margin-left: 8px;
      word-break: break-all;
   }

   button.back{
      width: 40px;
      height: 40px;
      border: 0;
      outline: none;
      position: absolute;
      top: 0;
      left: 0;
      background: url(/images/back.svg) no-repeat 50% / 12px;
      
   }

   ${media.mobile} {
      min-height: 55px;
      height: auto;
      justify-content: flex-start;

      button.back{
         width: 55px;
         height: 55px;
         background-size: 16px;
      }
   }

`;

export const TopBar = styled.div`
   display: flex;
   height: 30px;
   background-color: #ffd70038;
   border-bottom: 1px solid #ccc;
`

export const TopBarInput = styled.div`
   flex: 1;
   position: relative;

   input{
      width: 100%;
      height: 100%;
      border: 0;
      background: none;
      outline: none;
      padding: 0 12px;
   }
   .clear{
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -12px;
      width: 24px;
      height: 24px;
      background: url(/images/close3.svg) no-repeat 50% / 12px;
      opacity: .4;
      border: 0;
      outline: none;
   }
   & + &{
      border-left: 1px solid #ccc;
   }
`


export const FileList = styled.div`
   padding: 0 16px;
   flex: 1;
   min-height: 0;
   height: calc(100vh - 70px);
   overflow: auto;
   overflow: overlay;

   &:after{
      content:'';
      display: flex;
      height: 100px;
   }

   ${media.mobile} {
      padding: 0;
   }
`;

export const Row = styled.div`
   display: flex;
   align-itens: center;
   position: relative;
   padding: 6px 8px;
   border-bottom: 1px solid #ddd;
   user-select: none;

   max-width: 800px;
   min-height: 40px;
   margin: 0 auto;

   &:hover{
      background: #cdf5ef;
   }

   > * {
      user-select: none;
   }
   > * + * {
      margin-left: 8px;
   }

   &.file-drag-over{
      background: rgba(255, 215, 0 , .2);
   }

   ${media.mobile} {
      min-height: 50px;
      padding: 6px 16px;
      &:hover{
         background: none;
      }
   }
`

export const Icon = styled.div`
   width: ${props => props.size ? props.size + 'px' : '24px'};
   height: ${props => props.size ? props.size + 'px' : '24px'};
   ${props => {
      if (props.backgroundImage && props.backgroundImage.length > 0) {
         return `background: url(${props.backgroundImage}) no-repeat 50%;`
      }
      else {
         return `background: url(/images/${props.icon}.svg) no-repeat 50%;`
      }
   }}
   background-size: ${props => props.bgSize ? props.bgSize + 'px' : 'contain'};
   cursor: pointer;

   &.copied{
      background-image: url(/images/copied.svg);
   }

   ${media.mobile} {
      height: 38px;
   }
`;


export const UpdateIcon = styled.span`
   display: inline-block;
   width: 13px;
   height: 13px;
   background: url(/images/${props => props.icon}.svg) no-repeat 50%;
   background-size: ${props => props.bgSize ? props.bgSize + 'px' : 'contain'};
   cursor: pointer;
   vertical-align: -2px;
`;


export const TopIcon = styled.div`
   width: 30px;
   height: 100%;
   background: #fff url(/images/${props => props.icon}.svg) no-repeat 50%;
   background-size: ${props => props.bgSize + 'px' || 'contain'};
   border-left: 1px solid #ccc;
   cursor: pointer;
`

export const FolderName = styled.div`
   flex: 1;
   min-width: 60px;
   word-break: break-all;
   font-weight: 400;
   cursor: pointer;
   font-size: 16px;

   &.viewed{
      color: #006ff1;
   }

   ${media.mobile} {
      align-items: flex-start;
      padding-bottom: 16px;
      font-size: 15px;
   }
`

export const Name = styled.div`
   flex: 1;
   min-width: 60px;
   padding-top: 2px;
   word-break: break-all;
   font-weight: 400;
   cursor: pointer;

   &.viewed{
      color: #006ff1;
   }

   ${media.mobile} {
      align-items: flex-start;
      padding-bottom: 16px;
      font-size: 13px;
   }
`

export const Info = styled.div`
   display: inline-flex;
   font-weight: 400;
   padding-top: 2px;
   color: #bbb;
   ${media.mobile} {
      align-items: flex-end;
      font-size: 13px;
      font-weight: 400;
      ${props => props.type === 1 ? `
         position: absolute; 
         left: 48px; 
         bottom: 8px; 
         margin-left: 0 !important;
         line-height: 1;
         
      `: ''}
   }
`

export const Progress = styled.div`
   position: absolute;
   top: 70px;
   left: 0;
   right: 0;
   display: flex;
   width: 100%;
   height: 4px;
   z-index: 1;

   > div{
      width: 0;
      transition: width .3s;
      background: linear-gradient(to right,#689fd7,#8cd2da 25%,#56bd97 50%,#4ab77c);
   }

   ${media.mobile} {
      top: 85px;
   }

`


export const Menu = styled.div`
   position: relative;
   width: 24px;
   height: 24px;
   background: url(/images/menu.svg) no-repeat 50%;
   background-size: 11px;
   cursor: pointer;

   ul{
      display: none;
      position: absolute;
      top: 33px;
      right: -8px;
      background-color: #fff;
      // border: 1px solid #ddd;
      box-shadow: 0 3px 6px rgba(0,0,0,.5);
      z-index: 1;

      li{
         display: flex;
         align-items: center;
         min-width: 100px;
         padding: 4px 8px;
         font-size: 12px;
         white-space: nowrap;
         color: #666;
         
         &:hover{
            background-color: #eee;
         }

         & + li {
            border-top: 1px solid #eee;
         }
      }
   }

   &.active{
      ul{
         display: block;
      }
   }
   

   ${media.mobile} {
      height: 38px;

      ul{
         li{
            min-width: 120px;
            height: 40px;
            font-size: 14px;
         }
      }
   }
`;





