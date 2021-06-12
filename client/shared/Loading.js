import React from 'react';
import { connect } from 'react-redux';
import * as S from './Loading.style';

class Loading extends React.Component {

   constructor() {
      super();
      this.refLoading = React.createRef();
   }

   componentDidUpdate() {
      if (this.props.showLoading) {
         this.refLoading.current.classList.add('active');
         setTimeout(() => {
            this.refLoading.current.classList.add('animate');
         })
      } else {
         this.refLoading.current.classList.remove('animate');
         setTimeout(() => {
            this.refLoading.current.classList.remove('active');
         }, 300)
      }
   }
   render() {
      return <S.Loading ref={this.refLoading}><S.LoadingInner /></S.Loading>
   }
}

const mapStateToProps = ({ loading }) => ({
   showLoading: loading.show,
})
export default connect(
   mapStateToProps,
   null
)(Loading);
