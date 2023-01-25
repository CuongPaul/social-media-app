import { useContext, useState } from 'react'
import axios from 'axios'
import { PostContext, UIContext } from '../App'
import { storage } from '../firebase/firebase';

const url = process.env.REACT_APP_ENDPOINT

const useCreateComment = ({
  post_id,
  commentText,
  setError,
  setCommentText,
  commentImage,
  removeFileImage,
  setShowEmoji,
}) => {
  const [loading, setLoading] = useState(false)

  const { postDispatch } = useContext(PostContext)
  const { uiDispatch } = useContext(UIContext)

  const createComment = async (uri = '') => {
    setLoading(true)
    try {
      let token = JSON.parse(localStorage.getItem('token'))
      const response = await axios.post(
        `${url}/api/post/${post_id}/comment`,
        { text: commentText, image: uri ? uri : '' },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.data) {
        setCommentText('')
        postDispatch({ type: 'ADD_POST_COMMENT', payload: response.data.comment })
        uiDispatch({
          type: 'SET_MESSAGE',
          payload: {
            color: 'success',
            display: true,
            text: response.data.message,
          },
        })
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
      if (err && err.response) {
        if (err.response.status === 422) {
          setError(err.response.data.error)
        }

        uiDispatch({ type: 'SET_MESSAGE', payload: err.response.data.error })
      }
    }
  }

  const handleSubmitComment = (e) => {
    if (commentImage) {
      let filename = `comment/comment-${Date.now()}-${commentImage.name}`
      const uploadTask = storage.ref(`images/${filename}`).put(commentImage)
      uploadTask.on(
        'state_changed',
        () => {
          setLoading(true)
        },
        (err) => {
          console.log('error from firebase')
          setLoading(false)
        },
        () => {
          storage
            .ref('images')
            .child(filename)
            .getDownloadURL()
            .then((uri) => {
              createComment(uri)
            })
        },
      )
    } else {
      createComment();
    }
    removeFileImage();
    setShowEmoji(false);
  }

  return {
    handleSubmitComment,
    loading,
  }
}

export default useCreateComment
