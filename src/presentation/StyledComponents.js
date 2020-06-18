import styled, { css } from "styled-components";

export const RDisplay = styled.div`
  min-height: 100vh;
  background-color: #fbfffe;
  color: #003459;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

export const RSection = styled.div`
  text-align: center;
`;

export const RButton = styled.button`
  background-color: #00a8e8;
  color: #fbfffe;
  margin: 2vw;
  border: none;
  border-radius: 0.5vw;
  text-align: center;
  font-size: 2vw;

  :focus {
    outline: none;
  }

  :hover {
    cursor: pointer;
  }

  :active {
    background-color: #003459;
  }

  @media (max-width: 768px) {
    margin: 6vw;
    font-size: 6vw;
    border-radius: 1.5vw;
  }
`;

export const RLink = styled.a`
  color: #003459;

  :hover {
    color: #00a8e8;
  }
`;

export const PeerIdInput = styled.input`
  display: block;
  margin: auto;
  background-color: #fbfffe;
  border: 0.3vw solid #00a8e8;
  border-radius: 0.5vw;
  text-align: center;
  font-size: 2vw;

  :focus {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 6vw;
    border-width: 0.9vw;
    border-radius: 1.5vw;
  }
`;

export const DisplayPeerId = styled.div`
  display: block;
  margin: 1vw;
  font-size: 2vw;

  :hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

export const CopyButton = styled(RButton)`
  ${(props) =>
    props.copied &&
    css`
      color: red;
      background-color: #003459;

      :active {
        background-color: #00a8e8;
        color: #fbfffe;
      }
    `};
`;

export const GameBoard = styled.div`
  margin: 2vw;
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: auto;
  place-content: center;
  gap: 0.5vw;

  @media (max-width: 768px) {
    gap: 2vw;
  }
`;

export const GameBox = styled.button`
  background-color: #00a8e8;
  color: #fbfffe;
  height: 5vw;
  width: 5vw;
  border: none;
  border-radius: 0.5vw;
  text-align: center;
  font-size: 2vw;

  :focus {
    outline: none;
  }

  :active {
    background-color: #fbfffe;
    color: #00a8e8;
  }

  ${(props) =>
    props.isMarked &&
    css`
      background-color: red;
    `};

  @media (max-width: 768px) {
    height: 15vw;
    width: 15vw;
    font-size: 6vw;
    border-radius: 1.5vw;
  }
`;

export const DisplayTurn = styled.div`
  display: block;
  color: #003459;
  font-size: 2vw;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
  ${(props) =>
    props.yourTurn &&
    css`
      color: red;
    `}
`;

export const DisplayBingoStatus = styled.div`
  display: flex;
  justify-content: space-around;
  color: #003459;
  font-size: 2vw;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

export const BingoStatusItem = styled.div`
  ${(props) =>
    props.strike &&
    css`
      text-decoration: line-through;
      color: red;
    `};
`;

export const DisplayGameEnd = styled.div`
  font-size: 6vw;
  text-align: center;

  ${(props) => {
    if (props.status === 1) {
      return css`
        color: #00a8e8;
      `;
    } else if (props.status === -1) {
      return css`
        color: red;
      `;
    } else {
      return css`
        color: orange;
      `;
    }
  }}
`;

export const BingoButton = styled.button`
  background-color: red;
  margin: 1vw;
  color: white;
  font-size: 2vw;
  border: none;
  border-radius: 0.5vw;
  text-align: center;

  :focus {
    outline: none;
  }

  :active {
    background-color: white;
    color: slategray;
  }

  @media (max-width: 768px) {
    font-size: 6vw;
    margin: 3vw;
    border-radius: 1.5vw;
  }
`;
