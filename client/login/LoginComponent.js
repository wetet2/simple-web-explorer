import React from 'react';
import axios from 'axios';
import * as S from './LoginComponent.style';

class LoginComponent extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         inputPass: '',
      }

      this.refInput = React.createRef();
   }

   componentDidMount() {
      this.refInput.current.select();
      this.refInput.current.focus();
   }

   onKeyDown = (evt) => {
      if (evt.key === 'Enter') {
         this.onLoginClick();
      }
   }

   onLoginClick = (evt) => {

      const { inputPass } = this.state;
      const urlParams = new URLSearchParams(location.search);
      if (!inputPass || inputPass.trim() == '') {
         // alert('비밀번호를 확인해 주세요.')
         return;
      }

      axios.post('/auth/login', { inputPass, redirect: urlParams.get('redirect') })
         .then(res => {
            console.log(res.data);
            if (res.data.status === 1) {
               location.href = res.data.redirect || '/';
            } else {
               alert(res.data.msg);
               this.refInput.current.select();
               this.refInput.current.focus();
            }
         })
         .catch(error => {
            console.log(error);
            console.log(error.response);
         })

   }

   render() {
      const { inputPass } = this.state;
      return (
         <S.LoginBox className="">
            <div>
               <S.Input type="password" placeholder="Key" placeholderTextColor="#cecece" value={inputPass} ref={this.refInput}
                  onKeyDown={this.onKeyDown} onChange={evt => this.setState({ inputPass: evt.target.value })} />
            </div>
         </S.LoginBox>
      )
   }
}
export default LoginComponent;
