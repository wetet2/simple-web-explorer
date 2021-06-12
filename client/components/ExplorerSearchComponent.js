import React from 'react';
import * as S from './ExplorerComponent.style';
import ajax from '../utils/ajax'
import path from 'path'
import { connect } from 'react-redux';
import { addToast } from '../reducer/toastReducer';
import _ from 'lodash';


const LAST_FILE_PATH = 'lastFilePath';

class ExplorerSearchComponent extends React.Component {

   constructor() {
      super();
      this.state = {
         lastPath: '',
         fileArr: [],
         folderArr: [],
         searchList: [],
         filterText: '',
      }

      this.refSearch = React.createRef();
   }
   async componentDidMount() {

      this.props.history.listen((location, action) => {
         this.searchFiles(this.getParam('dir'), this.getParam('text'));
      });

      document.body.addEventListener('click', this.clearContentMenu)

      this.refSearch.current.value = this.getParam('text');
      this.searchFiles(this.getParam('dir'), this.getParam('text'));

      await ajax('/api/trace', { params: { page: 'explorer/search', data: { dir: this.getParam('dir'), text: this.getParam('text') } } })
   }

   componentWillUnmount() {
      document.body.removeEventListener('click', this.clearContentMenu)
   }


   clearContentMenu = () => {
      document.querySelectorAll('.row-menu').forEach(e => e.classList.remove('active'));
   }

   searchFiles = (dir, text) => {
      if (!dir) dir = this.getParam();
      ajax('/api/file/search', { dir, text }, (result) => {
         this.setState({
            ...result.data,
         })
      }, null, true);


   }

   getParam = (key) => {
      let params = new URLSearchParams(location.search);
      return params.get(key);
   }


   onChangeSearch = (evt) => {
      if (evt.key === 'Enter') {
         if (!evt.target.value || evt.target.value.trim() === '') {
            setTimeout(() => {
               this.props.addToast('검색어를 입력해주세요.');
            })
            return;
         };
         this.props.history.push(`/search?dir=${encodeURIComponent(this.getParam('dir'))}&text=${encodeURIComponent(evt.target.value)}`)
      }
   }

   onChangeFilter = _.debounce((evt) => {
      this.setState({ filterText: evt.target.value });
      ajax('/api/trace', { params: { page: location.pathname + location.search, action: 'filter', data: evt.target.value } })
   }, 500);

   onClickFile = async (evt, f) => {
      let fullPath = this.makeServerPath(f.dir, f.name);
      await ajax('/api/trace', { params: { page: fullPath, action: 'click' } })
      window.open('about:blank').location.href = fullPath;
   }

   makeServerPath = (dir, fileName) => {
      return path.join('/__repo', dir, fileName);
   }

   copyFileLink = (evt, f) => {
      let dir = this.makeServerPath(f.dir, f.name);
      let fullPath = window.location.origin + dir;
      let input = document.createElement("input");
      input.style.position = 'absolute';
      input.style.opacity = 0;
      document.body.appendChild(input);
      input.value = fullPath;
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);

      evt.target.classList.add('copied');
      this.props.addToast('클립보드에 복사되었습니다');
      ajax('/api/trace', { params: { page: dir, action: 'copy' } })
   }

   goBack = () => {
      window.location.href = `/?dir=${this.getParam('dir')}`
   }

   onClickClearInput = (evt, type) => {
      if (type === 1) {
         this.goBack();
      }
      if (type === 2) {
         this.setState({ filterText: '' });
      }
   }

   render() {
      const { lastPath, fileArr, folderArr, searchList } = this.state;
      const { filterText } = this.state;

      return (
         <>
            <S.Header>
               <div style={{ flex: 1 }}>
                  <button className="back" onClick={this.goBack}></button>
               </div>
               <label>검색 결과</label>
               <div style={{ flex: 1 }}></div>
            </S.Header>

            <S.TopBar>
               <S.TopBarInput>
                  <input ref={this.refSearch} type="text" placeholder="Search File..." onKeyDown={(evt) => { evt.persist(); this.onChangeSearch(evt) }}></input>
                  <button className="clear" onClick={evt => this.onClickClearInput(evt, 1)} tabIndex={-1} ></button>
               </S.TopBarInput>
               <S.TopBarInput>
                  <input type="text" placeholder="Filter..." onChange={(evt) => { evt.persist(); this.onChangeFilter(evt) }} />
                  <button className="clear" onClick={evt => this.onClickClearInput(evt, 2)} tabIndex={-1}></button>
               </S.TopBarInput>

            </S.TopBar>

            <S.FileList>
               <S.Row style={{ alignItems: 'center', fontSize: 16 }}>
                  검색 결과:&nbsp;<span style={{ color: '#3b88c3' }}>{searchList.filter(e => e.name.includes(filterText)).length}</span>&nbsp;건
               </S.Row>
               {
                  searchList.filter(e => e.name.includes(filterText)).map((f, i) => (
                     <S.Row key={i}>
                        <S.Icon icon={`/ext/${f.icon}`}></S.Icon>
                        <S.Name onClick={evt => this.onClickFile(evt, f)}>
                           {path.join(f.dir, f.name)}
                           {
                              f.isRecentCreated &&
                              <S.UpdateIcon icon="new" style={{ display: 'inline-block', marginLeft: 8 }} />
                           }
                           {
                              f.isRecentUpdated &&
                              <S.UpdateIcon icon="updated" style={{ display: 'inline-block', marginLeft: 4 }} />
                           }
                        </S.Name>
                        <S.Info >{f.size}</S.Info>
                        <S.Info type={1} style={{ marginLeft: 16 }}>{f.updateTime}</S.Info>
                        <S.Icon icon={`copy`} onClick={evt => this.copyFileLink(evt, f)}></S.Icon>
                     </S.Row>
                  ))
               }

            </S.FileList>

         </>
      )
   }
}


const mapStateToProps = ({ auth }) => ({
   isAdmin: auth.isAdmin,
})
const matDispatchToProps = { addToast };

export default connect(
   mapStateToProps,
   matDispatchToProps
)(ExplorerSearchComponent)
