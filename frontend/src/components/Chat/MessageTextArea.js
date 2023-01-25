import { IconButton, InputBase, Paper, makeStyles } from '@material-ui/core'
import { Send } from '@material-ui/icons'
import React, { useContext, useState, useRef } from 'react';
import { UIContext } from '../../App'
import useSendMessage from '../../hooks/useSendMessage'
import EmojiPicker from 'emoji-picker-react';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import FileField from '../Post/PostForm/PostDialog/FileField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PreviewImage from '../Post/PostForm/PostDialog/PreviewImage';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    padding: '16px 8px 16px 8px',
  },
  inputInput: {
    flexGrow: 1,
    paddingLeft: '4px',
  },
}))

function MessageTextArea() {
  const { uiState } = useContext(UIContext)
  const classes = useStyles()
  const [textMessage, setTextMessage] = useState('')

  const fileRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [messageImage, setMessageImage] = useState(null);

  function removeFileImage() {
    setPreviewImage('')
    setMessageImage(null)
  }

  const handleImageChange = (e) => {
    setMessageImage(e.target.files[0])

    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      setPreviewImage(reader.result)
    }
  }

  const onEmojiClick = (e, emojiObject) => {
    setTextMessage(textMessage + emojiObject.emoji)
  }

  const { handleSubmitMessage } = useSendMessage({ textMessage, setTextMessage, setShowEmoji, messageImage, removeFileImage })

  const handleSendMessage = (e) => {
    e.preventDefault()
    handleSubmitMessage()
  }
  return (
    <Paper
      elevation={0}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        width: '100%',
        backgroundColor: uiState.darkMode && 'rgb(36,37,38)',
      }}
    >
      <InputBase
        value={textMessage}
        onChange={(e) => setTextMessage(e.target.value)}
        placeholder="Enter Your Text..."
        multiline
        rowsMax={4}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        style={{
          borderRadius: '20px 20px 20px 20px',
          backgroundColor: uiState.darkMode ? 'rgb(24,25,26)' : 'whitesmoke',
          width: '100%',
        }}
      />
      <FileField fileRef={fileRef} />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileRef}
        onChange={handleImageChange}
        accept="image/*,video/*"
        capture="user"
      />
      <IconButton onClick={() => setShowEmoji(!showEmoji)}>
        <FontAwesomeIcon icon={faSmile} color="rgb(250,199,94)" />
      </IconButton>
      {showEmoji && (
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          className="emoji-container"
        />
      )}
      <IconButton
        onClick={handleSendMessage}
        style={{
          backgroundColor: 'rgb(1,133,243)',
          color: '#fff',
          marginLeft: '16px',
        }}
      >
        <Send fontSize="small" />
      </IconButton>
      {previewImage && (
        <>
          <PreviewImage
            previewImage={previewImage}
            removeFileImage={removeFileImage}
          />
        </>
      )}
    </Paper>
  )
}

export default MessageTextArea
