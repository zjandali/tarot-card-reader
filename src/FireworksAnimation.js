import React, { useState, useEffect } from 'react';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`card ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const TarotCardPicker = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  const cards = Array(22).fill(null).map((_, index) => ({
    id: index,
    image: `https://creactive.astrocenter.fr/tarotouinon/assets/localized/fr/cards/${index}.png`
  }));

  const handleCardClick = (card) => {
    if (selectedCard) return;
    setSelectedCard(card);
    setIsMoving(true);
    setTimeout(() => setIsRevealed(true), 1000);
  };

  useEffect(() => {
    if (isMoving) {
      const timer = setTimeout(() => setIsMoving(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isMoving]);

  const getCardStyle = (card, index) => ({
    width: '100px',
    height: '160px',
    left: selectedCard?.id === card.id && isMoving ? '170px' : `${index * 15}px`,
    top: selectedCard?.id === card.id && isMoving ? '200px' : '0px',
    transform: `
      rotate(${selectedCard?.id === card.id ? 0 : (index - 10) * 2}deg) 
      translateY(${hoveredCard === card.id ? '-20px' : '0'})
    `,
    transformOrigin: 'bottom center',
    transition: 'all 0.5s ease-in-out',
    zIndex: hoveredCard === card.id ? 22 : index,
  });

  return (
    <div className="tarot-card-picker">
      <h2 className="title">Tarot Card Reading</h2>
      <div className="card-container">
        <div className="card-deck">
          {cards.map((card, index) => (
            <Card 
              key={card.id} 
              className={`tarot-card ${selectedCard?.id === card.id ? 'selected' : ''} 
                ${!selectedCard ? 'hoverable' : ''}`}
              style={getCardStyle(card, index)}
              onClick={() => handleCardClick(card)}
              onMouseEnter={() => !selectedCard && setHoveredCard(card.id)}
              onMouseLeave={() => !selectedCard && setHoveredCard(null)}
            >
              <div className="card-inner">
                <img 
                  src="https://creactive.astrocenter.fr/tarotouinon/assets/card_back.png" 
                  alt="Card back" 
                  className="card-back"
                />
                <img 
                  src={card.image} 
                  alt={`Card ${card.id}`} 
                  className="card-front"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
      {selectedCard && isRevealed && (
        <div className="result">
          <p className="result-text">
            You have drawn Arcana {selectedCard.id}
          </p>
          <button 
            className="reset-button"
            onClick={() => {
              setSelectedCard(null);
              setIsRevealed(false);
              setHoveredCard(null);
              setIsMoving(false);
            }}
          >
            Draw a new card
          </button>
        </div>
      )}
      <style jsx>{`
        .tarot-card-picker {
          padding: 2rem;
          background: linear-gradient(to bottom right, #f0e6ff, #e6e6ff);
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-align: center;
          color: #4b0082;
        }
        .card-container {
          position: relative;
          height: 400px;
          width: 100%;
          overflow: hidden;
        }
        .card-deck {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 440px;
          top: 40px;
        }
        .tarot-card {
          position: absolute;
          cursor: pointer;
          transition: all 0.5s ease-in-out;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .tarot-card.hoverable:hover {
          box-shadow: 0 4px 8px rgba(75, 0, 130, 0.3);
        }
        .tarot-card.selected {
          z-index: 30;
        }
        .card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.5s;
          transform-style: preserve-3d;
        }
        .selected .card-inner {
          transform: ${isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)'};
        }
        .card-back, .card-front {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          backface-visibility: hidden;
          border-radius: 8px;
        }
        .card-front {
          transform: rotateY(180deg);
        }
        .result {
          text-align: center;
          margin-top: 2rem;
          animation: fadeIn 0.5s;
        }
        .result-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #4b0082;
        }
        .reset-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #4b0082;
          color: white;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .reset-button:hover {
          background-color: #3a006f;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TarotCardPicker;