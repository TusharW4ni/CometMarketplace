

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Button, TextInput } from '@mantine/core';

// const StarRating = ({ rating, setRating }) => {
//   return (
//     <div>
//       {[1, 2, 3, 4, 5].map((index) => (
//         <span key={index} onClick={() => setRating(index)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
//           {rating >= index ? '★' : '☆'}
//         </span>
//       ))}
//     </div>
//   );
// };

// function Modal({ onClose, rating, setRating, comment, setComment, handleSubmit }) {
//   return (
//     <div style={{
//       position: 'fixed',
//       zIndex: 1,
//       left: 0,
//       top: 0,
//       width: '100%',
//       height: '100%',
//       overflow: 'auto',
//       backgroundColor: 'rgba(0,0,0,0.4)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center'
//     }}>
//       <div style={{
//         backgroundColor: '#fefefe',
//         margin: 'auto',
//         padding: '20px',
//         border: '1px solid #888',
//         width: '80%',
//         borderRadius: '5px'
//       }}>
//         <span style={{
//           color: '#aaa',
//           float: 'right',
//           fontSize: '28px',
//           fontWeight: 'bold',
//         }} onClick={onClose}>&times;</span>
//         <h2>Rate the Seller</h2>
//         <form onSubmit={handleSubmit}>
//           <StarRating rating={rating} setRating={setRating} />
//           <TextInput
//             value={comment}
//             onChange={(e) => setComment(e.currentTarget.value)}
//             placeholder="Enter any additional commentary"
//             style={{ marginBottom: '10px' }}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </div>
//     </div>
//   );
// }
// export default function PublicProfile() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [ratings, setRatings] = useState([]);
//   const [averageRating, setAverageRating] = useState(0);
//   const [ratingCount, setRatingCount] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch user, posts, and ratings
//         const userRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUserById/${id}`);
//         const user = userRes.data;

//         const postsRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/get-posts/${id}`);
//         const posts = postsRes.data.posts;

//         const ratingsRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getRatingsForUser/${id}`);
//         const userRatings = ratingsRes.data;

//         // Calculate average rating and count
//         const totalStars = userRatings.reduce((acc, curr) => acc + curr.stars, 0);
//         const average = userRatings.length > 0 ? totalStars / userRatings.length : 0;

//         setUser(user);
//         setPosts(posts);
//         setRatings(userRatings);
//         setAverageRating(average);
//         setRatingCount(userRatings.length);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Submit the new rating
//       const res = await axios.post(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/addRating`, {
//         userId: id,
//         stars: rating,
//         comment: comment
//       });

//       // Update ratings in state
//       const newRating = res.data;
//       setRatings([...ratings, newRating]);
//       setAverageRating(((averageRating * ratingCount) + newRating.stars) / (ratingCount + 1));
//       setRatingCount(ratingCount + 1);

//       closeModal();
//     } catch (error) {
//       console.error("Failed to submit rating:", error);
//     }
//   };

//   if (!user) {
//     return <div>Loading user data...</div>;
//   }
  

//   return (
//     <div>
//       <div style={{ margin: '20px', padding: '40px', fontSize: '24px', textAlign: 'center' }}>
//         <h1>{user.email}</h1>
//         <p>Average Rating: {averageRating ? averageRating.toFixed(1) : "No ratings yet"} ({ratingCount} Rating{ratingCount === 1 ? "" : "s"})</p>
//       </div>
  
//       <div style={{ margin: '20px', padding: '30px' }}>
//         <h2>USER POSTS</h2>
//         {posts.map(post => (
//           <div key={post.id} style={{ marginBottom: '20px' }}>
//             <strong>{post.title}</strong> - {post.desc}
//             <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px' }}>
//               {post.photos && post.photos.map(photo => (
//                 <img key={photo} src={`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${photo}`} alt={post.title} style={{ maxWidth: '150px', height: 'auto' }} />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
  
//       <Button
//         onClick={openModal}
//         style={{
//           fontSize: '1.25rem',
//           fontWeight: 'bold',
//           padding: '10px 22px',
//           color: "white",
//           backgroundColor: 'gray',
//           marginBottom: '20px'
//         }}
//       >
//         RATE SELLER
//       </Button>
  
//       {isModalOpen && (
//         <Modal
//           onClose={closeModal}
//           rating={rating}
//           setRating={setRating}
//           comment={comment}
//           setComment={setComment}
//           handleSubmit={handleSubmit}
//         />
//       )}
  
//       <div style={{ margin: '20px', padding: '30px' }}>
//         <h2>USER FEEDBACK</h2>
//         {ratings.length > 0 ? (
//           <ul>
//             {ratings.map((userRating, index) => (
//               <li key={index}>
//                 <strong>{userRating.stars} Stars:</strong> {userRating.comment}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No feedback available yet.</p>
//         )}
//       </div>
//     </div>
//   );
  
// }




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, TextInput } from '@mantine/core';

const StarRating = ({ rating, setRating }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} onClick={() => setRating(index)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
          {rating >= index ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

function Modal({ onClose, rating, setRating, comment, setComment, handleSubmit }) {
  return (
    <div style={{
      position: 'fixed',
      zIndex: 1,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fefefe',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
        borderRadius: '5px'
      }}>
        <span style={{
          color: '#aaa',
          float: 'right',
          fontSize: '28px',
          fontWeight: 'bold',
        }} onClick={onClose}>&times;</span>
        <h2>Rate the Seller</h2>
        <form onSubmit={handleSubmit}>
          <StarRating rating={rating} setRating={setRating} />
          <TextInput
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            placeholder="Enter any additional commentary"
            style={{ marginBottom: '10px' }}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUserById/${id}`);
        setUser(userRes.data);
        const postsRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/get-posts/${id}`);
        setPosts(postsRes.data.posts);
        const ratingsRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getRatingsForUser/${id}`);
        setRatings(ratingsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchRatings();
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getRatingsForUser/${id}`);
      setRatings(res.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/addRating`, {
        userId: id,
        stars: rating,
        comment: comment
      });
      closeModal();
      fetchUserData(); // Refetch user data to update the profile
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };
  
  const fetchUserData = async () => {
    try {
      const userRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUserById/${id}`);
      setUser(userRes.data);
      // This will also update ratings as they are included in user details
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, [id]);
  

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <div style={{ margin: '20px', padding: '40px', fontSize: '24px', textAlign: 'center' }}>
        <h1>{user.email}</h1>
        <p>Average Rating: {user.averageRating?.toFixed(1)} ({user.ratingCount} Ratings)</p>
      </div>


      <div style={{ margin: '20px', padding: '30px' }}>
        <h2>USER POSTS</h2>
        {posts.map(post => (
          <div key={post.id} style={{ marginBottom: '20px' }}>
            <strong>{post.title}</strong> - {post.desc}
            <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px' }}>
              {post.photos && post.photos.map(photo => (
                <img key={photo} src={`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${photo}`} alt={post.title} style={{ maxWidth: '150px', height: 'auto' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={openModal}
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          padding: '10px 22px',
          color: "white",
          backgroundColor: 'gray'
        }}
      >
        RATE SELLER
      </Button>
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          handleSubmit={handleSubmit}
        />
      )}

      <div style={{ margin: '20px', padding: '30px' }}>
        <h2>USER FEEDBACK</h2>
        <ul>
          {ratings.map((rating, index) => (
            <li key={index}>
              <strong>{rating.stars} Stars:</strong> {rating.comment}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
