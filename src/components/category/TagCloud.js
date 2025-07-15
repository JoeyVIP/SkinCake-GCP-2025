import React from 'react';

const TagCloud = ({ tags }) => {
    return (
        <div className="tag-cloud">
            <h2 className="text-2xl font-bold mb-4">文章標籤</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <a
                        key={tag.id}
                        href={`/category.html?tag=${tag.id}`}
                        className="tag"
                    >
                        {tag.name}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default TagCloud; 