
import React, { useRef, useState, useEffect } from 'react';

const CenteredList = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // Handle clicking an item: mark it as selected.
  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  // When the selected index changes, scroll so the item is centered.
  useEffect(() => {
    if (
      selectedIndex !== null &&
      containerRef.current &&
      itemRefs.current[selectedIndex]
    ) {
      const container = containerRef.current;
      const item = itemRefs.current[selectedIndex];
      const containerHeight = container.clientHeight;
      const itemTop = item.offsetTop;
      const itemHeight = item.clientHeight;
      // Calculate the scroll position to center the item.
      const scrollTop = itemTop - containerHeight / 2 + itemHeight / 2;
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        overflowY: 'auto',
        // Add top and bottom padding equal to 50% of viewport height
        // so even the first and last items can be centered.
        paddingTop: '50vh',
        paddingBottom: '50vh'
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          onClick={() => handleClick(index)}
          style={{
            padding: '1rem',
            margin: '0.5rem 1rem',
            background: index === selectedIndex ? '#cce5ff' : '#f8f9fa',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default CenteredList;
