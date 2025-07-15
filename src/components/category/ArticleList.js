import React from 'react';

const ArticleList = ({ articles }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
                <article key={article.id} className="article-card">
                    <img
                        src={article._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg'}
                        alt={article.title.rendered}
                        className="article-image"
                    />
                    <div className="article-content">
                        <h3 className="article-title">
                            <a href={`/article.html?id=${article.id}`}>
                                {article.title.rendered}
                            </a>
                        </h3>
                        <div className="article-excerpt" dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }} />
                        <div className="article-meta">
                            <span>{new Date(article.date).toLocaleDateString('zh-TW')}</span>
                            <span>{article._embedded?.author?.[0]?.name || '未知作者'}</span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default ArticleList; 