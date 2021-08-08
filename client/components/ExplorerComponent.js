import React from 'react';
import * as S from './ExplorerComponent.style';
import ajax from '../utils/ajax'
import path from 'path'
import axios from 'axios';
import ls from '../utils/localStorage';
import { connect } from 'react-redux';
import { addToast } from '../reducer/toastReducer';
import _ from 'lodash';

const LAST_FILE_PATH = 'lastFilePath';

class ExplorerComponent extends React.Component {

   constructor() {
      super();
      this.state = {
         lastPath: '',
         fileArr: [],
         folderArr: [],
         filterText: '',
         currentDir: '/',
      }

      this.refUpload = React.createRef();
      this.refProgress = React.createRef();
      this.refTxtFilter = React.createRef();
   }
   componentDidMount() {

      this.props.history.listen((location, action) => {
         this.loadList(this.getParam('dir'));
      });

      this.loadList(this.getParam('dir'));
      this.refUpload.current.addEventListener('change', this.onChangeFileUpload)

      document.body.addEventListener('click', this.clearContentMenu)

      // await ajax('/api/trace', { params: { page: 'explorer' } })
   }


   componentWillUnmount() {
      document.body.removeEventListener('click', this.clearContentMenu)
   }


   clearContentMenu = () => {
      document.querySelectorAll('.row-menu').forEach(e => e.classList.remove('active'));
   }

   loadList = async (dir) => {
      if (!dir) dir = this.state.currentDir;
      let result = await ajax('/api/repo/list', { dir });
      // console.log(result.data);
      let lastPath = ls.get(LAST_FILE_PATH);
      this.setState({
         ...result.data,
         lastPath,
         currentDir: dir
      }, () => {
         if (this.state.currentDir !== dir) {
            this.props.history.push(`/?dir=${dir}`)
         }
      })
   }

   onClickBack = () => {
      if (!this.state.currentDir) {
         this.props.history.push(`/?dir=/`)
      } else {
         let pathArr = path.join(this.state.currentDir).split('/');
         pathArr = pathArr.filter(e => e.trim() !== '')
         pathArr.pop();
         this.props.history.push(`/?dir=/${pathArr.join('/')}`)
      }
      this.refTxtFilter.current.value = '';
      this.setState({ filterText: '' });
   }

   onClickFolder = async (evt, folder) => {
      let newDir = path.join(this.state.currentDir, folder.name);
      let url = `/?dir=${newDir}`;
      await ajax('/api/trace', { params: { page: url, action: 'click' } })
      this.props.history.push(url);
      this.refTxtFilter.current.value = '';
      this.setState({ filterText: '' });
   }

   onClickFile = async (evt, file) => {
      let fullPath = this.makeServerPath(file.name);
      ls.set(LAST_FILE_PATH, fullPath);
      await ajax('/api/trace', { params: { page: fullPath, action: 'click' } })
      // location.href = fullPath;
      window.location.href = fullPath;
      this.setState({ lastPath: fullPath })
   }

   makeServerPath = (fileName) => {
      return path.join('/__repo', this.state.currentDir, fileName);
   }

   goRoot = () => {
      this.props.history.push(`/?dir=/`)
   }

   getParam = (key) => {
      let params = new URLSearchParams(location.search);
      return params.get(key) || '/';
   }

   copyFolderLink = (evt, f) => {
      let dir = path.join('/?dir=' + this.state.currentDir, f.name);
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
   copyFileLink = (evt, f) => {
      let dir = this.makeServerPath(f.name);
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

   onClickFileMenu = (evt, f) => {
      evt.target.classList.add('active');
   }

   onClickDelete = async (evt, f) => {
      if (confirm('삭제 하시겠습니까?')) {
         let result = await ajax('/api/file/delete', { dir: this.state.currentDir, fileName: f.name });
         this.loadList();
         this.props.addToast('삭제하였습니다');
      }
   }

   onClickRename = async (evt, f) => {
      let newName = prompt('변경할 이름을 입력해주세요', f.name);
      if (!newName || newName === f.name) return;
      let result = await ajax('/api/file/rename', { dir: this.state.currentDir, fileName: f.name, newName });
      this.loadList();

   }

   onClickDownload = async (evt, f) => {
      let res = await ajax(this.makeServerPath(f.name), null, null, null, null, {
         responseType: 'blob'
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = f.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
   }

   onChangeFilter = _.debounce((evt) => {
      this.setState({ filterText: evt.target.value });
      ajax('/api/trace', { params: { page: location.pathname + location.search, action: 'filter', data: evt.target.value } })
   }, 500);

   onChangeSearch = (evt) => {
      if (evt.key === 'Enter') {
         window.location.href = `/search?dir=${encodeURIComponent(this.state.currentDir)}&text=${encodeURIComponent(evt.target.value)}`
      }
   }

   onClickNewFolder = async () => {
      let newName = prompt('새폴더 이름을 정해주세요', '');
      if (!newName || newName.trim() === '') return;
      let result = await ajax('/api/file/newfolder', { dir: this.state.currentDir, newName });
      this.loadList();

   }

   onClickClearInput = (evt, type) => {
      evt.target.parentNode.querySelector('input').value = '';
      if (type === 2) {
         this.setState({ filterText: '' });
      }
   }

   onDropOver = (evt) => evt.preventDefault();
   onDropFile = async (evt) => {
      evt.preventDefault();
      if (evt.dataTransfer.items) {
         let items = evt.dataTransfer.items;
         let fileArr = [];
         for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
               fileArr.push(items[i].getAsFile());
            }
         }
         if (fileArr.length > 0) await this.uploadFiles(fileArr);
      }
      else {
         let files = evt.dataTransfer.files;
         for (let i = 0; i < files.length; i++) {
         }
      }
   }

   onChangeFileUpload = (evt) => {
      const { fileArr } = this.state;
      let files = [];
      for (let i = 0; i < evt.target.files.length; i++) {
         files.push(evt.target.files[i]);
      }
      this.uploadFiles(files);
   }

   uploadFiles = async (files, inputTarget) => {
      let formData = new FormData();
      files.forEach(file => {
         formData.append("file", file);
      })
      let result = await axios.post(
         `/api/file/upload?dir=${this.state.currentDir}`,
         formData,
         {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: this.onUploadProgress,
         }
      );
      if (result.status === 200) {
         this.loadList();
         this.props.addToast('upload를 완료하였습니다');
         if (inputTarget) inputTarget.value = '';
         this.refProgress.current.style.width = '0%';
         this.refProgress.current.style.visibility = 'hidden';
      }

   }

   onUploadProgress = (evt) => {
      let percent = evt.loaded * 100 / evt.total;
      this.refProgress.current.style.visibility = 'visible';
      this.refProgress.current.style.width = percent + '%';
   }

   onDragStartRow = (evt, f) => {
      this.dragged = f;
      // evt.dataTransfer.effectAllowed = 'move';
      // evt.preventDefault();
      // evt.stopPropagation();
   }

   onDragOverFolder = (evt) => {
      evt.target.closest('.row-folder').classList.add('file-drag-over');
      evt.preventDefault();
      // this.dragged.style.display = "none"; 
      // if(evt.target.className === 'placeholder') return; 
      // this.over = evt.target; 
      // evt.target.parentNode.insertBefore(placeholder, evt.target); 
   }
   onDragLeaveFolder = (evt) => {
      evt.target.closest('.row-folder').classList.remove('file-drag-over');
      evt.preventDefault();
   }

   onDragEnd = (evt) => {
      this.dragged = undefined;
   }

   onDropFolder = (evt, f) => {
      document.querySelectorAll('.row-folder.file-drag-over').forEach(e => {
         e.classList.remove('file-drag-over');
      })
      if (this.dragged && f) {
         this.moveFile(this.dragged, f);
      }
   }

   moveFile = async (src, folder) => {
      let params = {
         dir: this.state.currentDir,
         srcName: src.name,
         targetFolder: folder.name
      };
      await ajax('/api/file/move', params);
      this.loadList();
   }

   onClickViewSource = (evt, f) => {
      let fullPath = this.makeServerPath(f.name);
      ls.set(LAST_FILE_PATH, fullPath);
      this.props.history.push(`/viewer?path=${path.join(this.state.currentDir, f.name)}`)
   }

   render() {
      const { lastPath, fileArr, folderArr, currentDir } = this.state;
      const { filterText } = this.state;

      let fileDropProps = {};
      if (this.props.isAdmin) fileDropProps = { onDrop: this.onDropFile, onDragOver: this.onDropOver };

      return (
         <>
            <S.Header>
               <label onClick={this.goRoot}>Repository</label>
               <span>( {this.state.currentDir} )</span>
            </S.Header>

            <S.TopBar>
               <S.TopBarInput>
                  <input type="text" placeholder="Search File..." onKeyDown={(evt) => { evt.persist(); this.onChangeSearch(evt) }}></input>
                  {/* <button className="clear" onClick={evt => this.onClickClearInput(evt, 1)} tabIndex={-1} ></button> */}
               </S.TopBarInput>
               <S.TopBarInput>
                  <input type="text" placeholder="Filter..." ref={this.refTxtFilter} onChange={(evt) => { evt.persist(); this.onChangeFilter(evt) }} />
                  <button className="clear" onClick={evt => this.onClickClearInput(evt, 2)} tabIndex={-1}></button>
               </S.TopBarInput>
               {
                  this.props.isAdmin &&
                  <>
                     <S.TopIcon icon={`upload`} bgSize={18} title="파일 업로드" onClick={() => this.refUpload.current.click()} />

                     <S.TopIcon icon={`newfolder`} bgSize={20} title="새폴더" onClick={this.onClickNewFolder} />
                  </>
               }
            </S.TopBar>

            <S.Progress><div ref={this.refProgress}></div></S.Progress>

            <S.FileList className="drop" {...fileDropProps}>
               {/* .. 부모 폴더로 */}
               <S.Row className="row-folder"
                  onClick={evt => this.onClickBack()}
                  onDragOver={this.onDragOverFolder}
                  onDrop={(evt) => this.onDropFolder(evt, { name: '..' })}
                  onDragLeave={this.onDragLeaveFolder}
               >
                  <S.Icon icon={`folder`}></S.Icon>
                  <S.Name style={{ letterSpacing: 2 }}>..</S.Name>
               </S.Row>
               {
                  // 폴더 목록
                  folderArr.filter(e => e.name.includes(filterText)).map((f, i) => (
                     <S.Row key={i} className="row-folder" draggable
                        onDragStart={(evt) => this.onDragStartRow(evt, f)}
                        onDragOver={this.onDragOverFolder}
                        onDrop={(evt) => this.onDropFolder(evt, f)}
                        onDragLeave={this.onDragLeaveFolder}
                     >
                        <S.Icon icon={`folder`}></S.Icon>
                        <S.FolderName onClick={evt => this.onClickFolder(evt, f)}>{f.name}</S.FolderName>
                        <S.Info type={1}>{f.updateTime}</S.Info>
                        <S.Icon icon={`copy`} onClick={evt => this.copyFolderLink(evt, f)}></S.Icon>
                        {
                           this.props.isAdmin &&
                           <S.Menu className="row-menu" style={{ marginLeft: 0 }} bgSize={11} onClick={evt => this.onClickFileMenu(evt, f)}>
                              <ul>
                                 <li onClick={(evt) => this.onClickDelete(evt, f)}>삭제</li>
                                 <li onClick={(evt) => this.onClickRename(evt, f)}>이름 변경</li>
                              </ul>
                           </S.Menu>
                        }
                     </S.Row>
                  ))
               }
               {
                  // 파일 목록
                  fileArr.filter(e => e.name.includes(filterText)).map((f, i) => (
                     <S.Row key={i} draggable
                        onDragStart={(evt) => this.onDragStartRow(evt, f)}
                        onDragEnd={this.onDragEnd}
                     >

                        <S.Icon icon={`/ext/${f.icon}`}
                           backgroundImage={f.isImage ? path.join('/', '__repo', currentDir, f.name) : ''}
                        ></S.Icon>
                        <S.Name title={f.name}
                           onClick={evt => this.onClickFile(evt, f)}
                           className={this.makeServerPath(f.name) === lastPath ? 'viewed' : ''}>
                           {f.name}
                           {
                              f.isRecentCreated &&
                              <S.UpdateIcon icon="new" style={{ display: 'inline-block', marginLeft: 8 }} />
                           }
                           {
                              f.isRecentUpdated &&
                              <S.UpdateIcon icon="updated" style={{ display: 'inline-block', marginLeft: 4 }} />
                           }
                        </S.Name>
                        <S.Info>{f.size}</S.Info>
                        <S.Info type={1} style={{ marginLeft: 16 }}>{f.updateTime}</S.Info>
                        <S.Icon icon={`copy`} onClick={evt => this.copyFileLink(evt, f)}></S.Icon>
                        {
                           this.props.isAdmin &&
                           <S.Menu className="row-menu" style={{ marginLeft: 0 }} bgSize={11} onClick={evt => this.onClickFileMenu(evt, f)}>
                              <ul>
                                 <li onClick={(evt) => this.onClickDelete(evt, f)}>삭제</li>
                                 <li onClick={(evt) => this.onClickRename(evt, f)}>이름 변경</li>
                                 <li onClick={(evt) => this.onClickViewSource(evt, f)}>소스 보기</li>
                                 <li onClick={(evt) => this.onClickDownload(evt, f)}>다운로드</li>
                              </ul>
                           </S.Menu>
                        }
                     </S.Row>
                  ))
               }
               <input type="file" multiple ref={this.refUpload} style={{ display: 'none' }} />
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
)(ExplorerComponent)
