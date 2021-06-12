import React from 'react';
import { connect } from 'react-redux';
import * as S from './Toast.style';

import Toast from './Toast';

class ToastWrap extends React.Component {

   constructor() {
      super();
      this.refToastWrap = React.createRef();
   }

   componentDidUpdate() {
      if (this.props.message && this.props.message.trim().length > 0) {
         this.makeToast(this.props.message);
      }
   }

   toastMargin = 12;
   makeToast = (message) => {
      let newToast = new Toast(message);
      newToast.appendTo(this.refToastWrap.current)
      newToast.show();      
      setTimeout(() => {
         newToast.hide();
      }, 3000)
   }

   render() {
      return <S.ToastWrap ref={this.refToastWrap} />
   }
}

const mapStateToProps = ({ toast }) => ({
   message: toast.message,
   refreshFlag: toast.refreshFlag,
})
export default connect(
   mapStateToProps,
   null
)(ToastWrap);
