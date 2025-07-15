import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import TagCloud from './TagCloud';
import ArticleList from './ArticleList';
import Footer from '../common/Footer';
import '../styles/category/category.css';

const CategoryPage = () => {
    const [articles, setArticles] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 獲取文章列表
                const articlesResponse = await fetch('https://skincake.online/wp-json/wp/v2/posts?_embed');
                const articlesData = await articlesResponse.json();
                setArticles(articlesData);

                // 獲取標籤列表
                const tagsResponse = await fetch('https://skincake.online/wp-json/wp/v2/tags');
                const tagsData = await tagsResponse.json();
                setTags(tagsData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">載入中...</div>;
    }

    return (
        <div className="category-page">
            <Navbar />
            <main className="category-container">
                <div className="tag-cloud-container">
                    <TagCloud tags={tags} />
                </div>
                <div className="article-list">
                    <ArticleList articles={articles} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CategoryPage; 