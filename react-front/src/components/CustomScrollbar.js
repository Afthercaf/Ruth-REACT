// src/components/CustomScrollbar.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../App.css';

const CustomScrollbar = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const contentRef = useRef(null);
  const scrollbarRef = useRef(null);
  const thumbRef = useRef(null);

  const checkScrollable = useCallback(() => {
    if (contentRef.current) {
      const isScrollable = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setShowScrollbar(isScrollable);
    }
  }, []);

  const handleScroll = () => {
    if (contentRef.current && thumbRef.current) {
      const scrollPercentage = contentRef.current.scrollTop / (contentRef.current.scrollHeight - contentRef.current.clientHeight);
      const thumbPosition = scrollPercentage * (contentRef.current.clientHeight - thumbRef.current.clientHeight);
      thumbRef.current.style.top = `${thumbPosition}px`;
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY - thumbRef.current.offsetTop);
    setStartScrollTop(contentRef.current.scrollTop);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const y = e.clientY - scrollbarRef.current.offsetTop;
    const walk = (y - startY) * (contentRef.current.scrollHeight / contentRef.current.clientHeight);
    contentRef.current.scrollTop = startScrollTop + walk;
  }, [isDragging, startY, startScrollTop]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('resize', checkScrollable);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, checkScrollable]);

  useEffect(() => {
    checkScrollable();
    const content = contentRef.current;
    const thumb = thumbRef.current;
    if (content && thumb && showScrollbar) {
      const scrollbarHeight = content.clientHeight;
      const scrollHeight = content.scrollHeight;
      thumb.style.height = `${(scrollbarHeight / scrollHeight) * 100}%`;
    }
  }, [children, showScrollbar, checkScrollable]);

  return (
    <div className="custom-scrollbar-container">
      <div 
        className={`custom-scrollbar-content ${showScrollbar ? 'scrollable' : ''}`} 
        ref={contentRef} 
        onScroll={handleScroll}
      >
        {children}
      </div>
      {showScrollbar && (
        <div className="custom-scrollbar" ref={scrollbarRef}>
          <div className="custom-scrollbar-thumb" ref={thumbRef} onMouseDown={handleMouseDown}>
            <div className="arrow up">▲</div>
            <div className="arrow down">▼</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomScrollbar;