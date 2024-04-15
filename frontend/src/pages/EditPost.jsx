//VINCENT WIP
import Navbar from '../components/Navbar';
import { Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import FormData from 'form-data';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function EditItem() {
  //delcare new variable, called user, posts, currUser
  const [currUser, setCurrUser] = useState(null);
  const { user } = useAuth0();
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [post, setPost] = useState('');
  const [userID, setUserID] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    desc: '',
    userId: 0,
    postId: '',
  });
  

  const {postID} = useParams();



  useEffect(() => {
    

    const getUserAndPost = async () => {

        const userRes = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`, { email: user.email }, );
        setCurrUser(userRes.data);
          
        const postRes = await axios.get(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/get-post/${postID}`, );

        // '/api/user/edit-post/:postId'
        console.log("postRes: ",postRes.data);
        console.log("userRes data:", userRes.data.id);
        setPost(postRes.data);
        setTitle(post.title);
        setPrice(post.price);
        setDesc(post.desc);
        setUserID(userRes.data.id.toString());

        
        console.log("userID data:", userID);
        setFormData({title: postRes.data.title, price: postRes.data.price, desc: postRes.data.desc, userId: userRes.data.id, postId: postID});
        //setFormData({ ...formData, userId: userRes.data.id, postId: postRes.data.id});
        
        
        //setFormData({...formData, userId: userRes.data.id.toString(), postId: postID});
        //console.log("get user and posts form data", formData);
        
    //console.log("after getuserandpsots", formData);
    };
    //console.log("before getuserandpsots", formData);
    //setFormData({...formData, userId: userID, postId: postID});
    const settingFormData = async () =>
    {
      
      if (post.title === 'undefined' && post.price === 'undefined' && post.desc === 'undefined')
      {
        return;
      }
        
      //htis doesnt work lol
      //setFormData({...formData, title: title, price: price, desc: desc, userId: userID.toString(), postId: postID});
      console.log("formData: ", formData);
      
    };

    getUserAndPost();

    //setFormData({...formData, title: title, price: price, desc: desc, userId: userID, postId: postID});
    settingFormData();
    

    
  }, [post.title]);
 
  //console.log(formData);
  // const editPost = async (newTitle) => {
  //   const editPostResponse = await axios.post(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/edit-post/${postID}`, 
  //   json.stringify({
  //     title: newTitle
  //   }))
  // }

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);

    // Create URLs representing the files
    const urls = uploadedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };
/*
  const handlePriceChange = (event) => {
   
    // Remove all non-digit characters
    
    const rawValue = event.target.value.replace(/\D/g, '');
    setFormData({ ...formData, price: rawValue });

    // Convert to a number and format with commas
    const formattedValue = Number(rawValue).toLocaleString('en-US');

    setPrice(formattedValue);
  };
*/


  const navigate = useNavigate();
  const handleSubmit = async () => {
    
    console.log(formData);
    try {
      //setFormData({title: title, price: price, desc: desc, userId: userID.toString(), postId: postID});
      
      setFormData({...formData, userId: userID, postId: postID});
      console.log(formData);
      const editPostResponse = await axios.put(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/edit-a-post/${postID}`, formData);
      /*
      const res1 = await axios.put(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/edit-a-post/${postID}`, formData
        
      );
      */
      //console.log(editPostResponse.response.data);

      //postId = editPostResponse.data.postId;
      //console.log(postId);
      

    } catch (error) {
      console.error(error)
;      /*
      if (!error.response) {
        // network error
        this.errorStatus = 'Error: Network Error';
    } else {
        this.errorStatus = error.response.data.message;
    }
    */
    }

    let formDataObj = new FormData();
    files.forEach((file) => {
      formDataObj.append('files', file);
    });
    try {
      await axios.post(
        `${
          import.meta.env.VITE_APP_EXPRESS_BASE_URL
        }/api/user/add-images-to-new-post`,
        formDataObj,
        {
          params: {
            userId: currUser.id,
            postId: postID,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      //setIsPosted(true);
      setTimeout(() => {
        //setIsPosted(false);
        window.location.reload();
      }, 2000);

      
      navigate('/my-posts/');
    } catch (error) {
      console.error(error);
    }
    
  };


  return (
    <>
      
      <Navbar />
      <div 
      
      className="flex flex-col items-center">
        <div className="space-y-5">
          
          <h1 className="text-2xl font-bold text-white mt-5">Item for Sale</h1>
          <div className="flex space-x-40">
            <div>
              <Button component="label" htmlFor="fileUpload">
                Upload Photos
              </Button>
              <input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
              />
              <div className="mt-5 grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt="Preview" width={100} height={100} />
                    <button
                      className="absolute top-0 right-0 bg-gray-500 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-white">
                Title
              </label>
              <input
                type="text"
                defaultValue={post.title}
                className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) =>
                  //setTitle(e.target.value)
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <label htmlFor="price" className="text-white">
                Price($)
              </label>
             
                <input
                  type="number"
                  defaultValue={post.price}
                  onChange={(e) =>
                   //setPrice(e.target.value)
                   setFormData({ ...formData, price: e.target.value })

                  }
                  className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                

              
             

              <label htmlFor="description" className="text-white">
                Description
              </label>
              <textarea
                className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                defaultValue={post.desc}
                onChange={(e) =>
                  //setDesc(e.target.value)
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
              <Button color="orange" onClick={handleSubmit}>
                Post
              </Button>
            </div>
          </div>
          </div>
        </div>
    </>
  );
}