import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ItemPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/getPostNameFromId/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch post', error);
            }
        };

        fetchPost();
    }, [id]);

    return (
        <div style={{ color: 'white' }}>
            <Navbar />
            {post ? post.title : 'Loading...'}
            <div>
                {post ? post.desc : 'Loading...'}
                <br></br>
                {post ? post.price : 'Loading...'}
            </div>
        </div>
    );
};

export default ItemPage;