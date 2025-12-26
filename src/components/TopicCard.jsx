import React from 'react';
import './TopicCard.css';

const TopicCard = ({ title, description, link }) => {
  const topics = [
    {
      id: 1,
      title: 'AI 교육 수업계획안 & 성공 사례',
      description: '실제 수업에 활용할 수 있는 AI 교육 수업계획안과 성공 사례를 확인하세요.',
    },
    {
      id: 2,
      title: '청소년과 AI 활용',
      description: '청소년들이 안전하고 윤리적으로 AI를 활용하는 방법을 알아봅니다.',
    },
    {
      id: 3,
      title: '인공지능 윤리 관련 웹사이트',
      description: 'AI 윤리에 대한 깊이 있는 정보를 제공하는 신뢰할 수 있는 웹사이트들을 소개합니다.',
    },
  ];

  return (
    <section className="topics-section">
      <h2 className="topics-title">주요 주제</h2>
      <div className="topics-grid">
        {topics.map((topic) => (
          <div key={topic.id} className="topic-card">
            <div className="topic-number">{topic.id}</div>
            <h3 className="topic-card-title">{topic.title}</h3>
            <p className="topic-card-description">{topic.description}</p>
            {link && (
              <a href={link} className="topic-link" target="_blank" rel="noopener noreferrer">
                자세히 보기 →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopicCard;

