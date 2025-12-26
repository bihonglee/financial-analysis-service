import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = ({ googleFormUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    affiliation: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (googleFormUrl) {
      // 구글폼 URL이 있으면 새 창에서 열기
      window.open(googleFormUrl, '_blank');
    } else {
      // 구글폼 URL이 없으면 콘솔에 출력 (개발용)
      console.log('문의 내용:', formData);
      alert('구글폼 URL이 설정되지 않았습니다. 문의 내용이 콘솔에 출력되었습니다.');
    }
    
    // 폼 리셋
    setFormData({
      name: '',
      affiliation: '',
      email: '',
      message: '',
    });
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">커피챗 문의</h2>
        <p className="contact-subtitle">
          궁금한 점이 있으시면 언제든지 문의해주세요.
        </p>
        
        {googleFormUrl ? (
          <div className="google-form-container">
            <iframe
              src={googleFormUrl}
              width="100%"
              height="800"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="문의 폼"
            >
              로드 중...
            </iframe>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">성함 및 소속</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 홍길동 (서울대학교)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">연락받으실 이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">문의 내용</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="문의하실 내용을 자세히 적어주세요."
                rows="6"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              문의하기
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm;

