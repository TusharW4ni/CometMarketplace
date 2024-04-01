//VINCENT WIP
import React from 'react'
/*
export default function EditItem()
{
    useEffect(() => {
        const getUserAndPosts = async () => {
          try {
            const userRes = await axios.post(
              `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
              { email: user.email },
            );
            setCurrUser(userRes.data);
            const postsRes = await axios.get(
              `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/get-posts/${
                userRes.data.id
              }`,
            );
            // const postsRes = await axios.get(
            //   `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getAllPosts`,
            // );
            console.log(postsRes.data)
            setPosts(postsRes.data.posts);
          } catch (error) {
            console.log('error in getUser', error);
          }
        };
        getUserAndPosts();
    }, []);

    return (
        <div>
      <button type="button">Click Me</button>
    </div>
    );
};
*/

const EditItem = () => {
    return (
      <div>
        <button type="button">Edit</button>
      </div>
    );
  };
  
  export default EditItem;